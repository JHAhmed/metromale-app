<!-- routes/appointments/checkout/+page.svelte -->
<script>
	import { goto } from '$app/navigation';
	import { toast, Toaster } from 'svelte-sonner';
	import Icon from '@iconify/svelte';
	import { page } from '$app/state';
	import { functions } from '$lib/appwrite';
	import { ExecutionMethod } from 'appwrite';
	import { onMount } from 'svelte';
	import { env } from '$env/dynamic/public';
	import {
		clearAppointmentCheckoutDraft,
		getAppointmentCheckoutDraft
	} from '$lib/utils/appointmentCheckout';

	const userId = $derived(page.url.searchParams.get('userId'));

	const BOOKING_FEE = 200; // ₹200.00 (amount in paise: 20000)
	const RAZORPAY_KEY_ID = env.PUBLIC_RAZORPAY_KEY_ID;
	const FUNCTION_ID = env.PUBLIC_RAZORPAY_FUNCTION_ID;

	/** @type {'idle' | 'checking' | 'loading' | 'processing' | 'verifying' | 'success' | 'error'} */
	let status = $state('checking');
	let errorMessage = $state('');
	let bookingDraft = $state(null);

	onMount(async () => {
		status = 'checking';
		const draft = getAppointmentCheckoutDraft();

		if (!draft) {
			status = 'error';
			errorMessage = 'No appointment details found. Please book your appointment again.';
			toast.error(errorMessage);
			return;
		}

		if (userId && draft.userId && draft.userId !== userId) {
			clearAppointmentCheckoutDraft();
			status = 'error';
			errorMessage = 'Appointment checkout data does not match the active user.';
			toast.error(errorMessage);
			return;
		}

		bookingDraft = draft;
		status = 'idle';
	});

	async function handlePayNow() {
		if (!bookingDraft?.userId) {
			toast.error('Missing appointment information. Please go back and try again.');
			return;
		}

		console.log(bookingDraft);

		try {
			// ── Step 1: Create a Razorpay order via Appwrite Function ──────────
			status = 'loading';

			const createExecution = await functions.createExecution(
				FUNCTION_ID,
				JSON.stringify({
					action: 'create-order',
					amount: BOOKING_FEE * 100, // paise
					currency: 'INR',
					flow: 'appointment-checkout',
					userId: bookingDraft.userId,
					appointmentId: bookingDraft.appointmentId
				}),
				false, // async = false (wait for result)
				'/', // path
				ExecutionMethod.POST
			);

			if (createExecution.responseStatusCode !== 200) {
				console.log(createExecution.responseBody);
				throw new Error(createExecution.responseBody || 'Failed to create payment order.');
			}

			const orderData = JSON.parse(createExecution.responseBody);

			console.log(orderData);

			if (!orderData.orderId) {
				throw new Error('Invalid order response from server.');
			}

			// ── Step 2: Open Razorpay checkout modal (inline in WebView) ──────
			status = 'processing';

			await new Promise((resolve, reject) => {

			const options = {
				key: RAZORPAY_KEY_ID,
				amount: orderData.amount,
				currency: orderData.currency,
				name: 'Metromale Clinic',
				description: 'Appointment Booking Fee',
				order_id: orderData.orderId,

				// ── Add this block ──────────────────────────────────────────────
				config: {
					display: {
					blocks: {
						upi: {
						name: 'Pay via UPI',
						instruments: [
							{ method: 'upi', flows: ['intent', 'collect', 'qr'] }
						]
						}
					},
					sequence: ['block.upi'],
					preferences: {
						show_default_blocks: true   // keeps Cards, Netbanking, Wallets too
					}
					}
				},


				// const options = {
				// 	key: RAZORPAY_KEY_ID,
				// 	amount: orderData.amount,
				// 	currency: orderData.currency,
				// 	name: 'Metromale Clinic',
				// 	description: 'Appointment Booking Fee',
				// 	order_id: orderData.orderId,
				// 	prefill: {
				// 		// You can pre-fill if you have the user's details in store
				// 	},
					theme: {
						color: '#d97706' // amber-600
					},
					modal: {
						ondismiss: () => {
							status = 'idle';
							toast.info('Payment was cancelled.');
							reject(new Error('dismissed'));
						}
					},
					handler: async (response) => {
						// ── Step 3: Verify signature via Appwrite Function ─────
						try {
							status = 'verifying';

							const verifyExecution = await functions.createExecution(
								FUNCTION_ID,
								JSON.stringify({
									action: 'verify-payment',
									razorpay_order_id: response.razorpay_order_id,
									razorpay_payment_id: response.razorpay_payment_id,
									razorpay_signature: response.razorpay_signature,
									flow: 'appointment-checkout',
									userId: bookingDraft.userId,
									bookingData: bookingDraft
								}),
								false,
								'/',
								ExecutionMethod.POST
							);

							if (verifyExecution.responseStatusCode !== 200) {
								throw new Error(
									verifyExecution.responseBody || 'Payment verification failed.'
								);
							}

							const verifyData = JSON.parse(verifyExecution.responseBody);

							if (!verifyData.success) {
								throw new Error('Signature mismatch — payment could not be verified.');
							}

							// ── Success ────────────────────────────────────────
							status = 'success';
							clearAppointmentCheckoutDraft();
							toast.success('Payment successful! Your appointment is confirmed.');
							setTimeout(
								() =>
									goto(
										verifyData.appointmentId
											? `/appointments/${verifyData.appointmentId}`
											: '/appointments'
									),
								1500
							);
							resolve();
						} catch (err) {
							status = 'error';
							errorMessage = err.message;
							reject(err);
						}
					}
				};

				// Razorpay checkout.js is loaded via app.html <script> tag
				// @ts-ignore
				const rzp = new window.Razorpay(options);

				rzp.on('payment.failed', (response) => {
					status = 'error';
					errorMessage =
						response.error?.description || 'Payment failed. Please try again.';
					toast.error(errorMessage);
					reject(new Error(errorMessage));
				});

				rzp.open();
			});
		} catch (err) {
			if (err?.message !== 'dismissed') {
				status = 'error';
				errorMessage = err.message || 'An unexpected error occurred.';
				toast.error(errorMessage);
			}
		}
	}
</script>

<Toaster richColors />

<svelte:head>
	<title>Checkout - Metromale</title>
</svelte:head>

<div class="min-h-screen space-y-6 p-4 md:p-8">
	<!-- Back button -->
	<button
		class="mb-2 flex items-center space-x-2 text-gray-600 hover:text-gray-800"
		disabled={status === 'loading' || status === 'verifying'}
		onclick={() => goto('/appointments')}
	>
		<Icon icon="ph:arrow-left-bold" class="size-5" />
		<span class="text-sm font-medium">Back to Appointments</span>
	</button>

	<div class="mx-auto max-w-lg">
		<div class="rounded-3xl bg-white p-8 shadow-lg">
			<!-- Header -->
			<div class="mb-8 text-center">
				<div
					class="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-amber-100 transition-colors"
					class:bg-green-100={status === 'success'}
					class:bg-red-100={status === 'error'}
				>
					{#if status === 'checking' || status === 'loading' || status === 'verifying'}
						<Icon icon="ph:spinner" class="size-8 animate-spin text-amber-600" />
					{:else if status === 'success'}
						<Icon icon="ph:check-circle-fill" class="size-8 text-green-600" />
					{:else if status === 'error'}
						<Icon icon="ph:warning-circle-fill" class="size-8 text-red-500" />
					{:else}
						<Icon icon="ph:receipt" class="size-8 text-amber-600" />
					{/if}
				</div>
				<h1 class="text-2xl font-bold text-gray-800">
					{#if status === 'success'}
						Payment Complete!
					{:else if status === 'error'}
						Payment Failed
					{:else}
						Appointment Checkout
					{/if}
				</h1>
				<p class="mt-2 text-gray-600">
					{#if status === 'checking'}
						Checking your appointment...
					{:else if status === 'loading'}
						Preparing your payment...
					{:else if status === 'processing'}
						Complete your payment in the window above
					{:else if status === 'verifying'}
						Verifying your payment, please wait...
					{:else if status === 'success'}
						Redirecting you to your appointments...
					{:else if status === 'error'}
						{errorMessage}
					{:else}
						Complete your payment to confirm your appointment
					{/if}
				</p>
			</div>

			<!-- Payment Details -->
			<div class="mb-8 rounded-2xl bg-gray-50 p-6">
				<h2 class="mb-4 text-lg font-semibold text-gray-800">Payment Summary</h2>
				<div class="space-y-3">
					{#if bookingDraft}
						<div class="flex items-center justify-between gap-4">
							<span class="text-gray-600">Patient</span>
							<span class="text-right font-medium text-gray-800">{bookingDraft.patientName}</span>
						</div>
						<div class="flex items-center justify-between gap-4">
							<span class="text-gray-600">Appointment</span>
							<span class="text-right font-medium text-gray-800">
								{bookingDraft.appointmentDatetime}
							</span>
						</div>
						<div class="flex items-center justify-between gap-4">
							<span class="text-gray-600">Location</span>
							<span class="text-right font-medium text-gray-800">{bookingDraft.branch}</span>
						</div>
						<div class="flex items-center justify-between gap-4">
							<span class="text-gray-600">Slot</span>
							<span class="text-right font-medium text-gray-800">
								{bookingDraft.appointmentSlot}
							</span>
						</div>
						<hr class="border-gray-200" />
					{/if}
					<div class="flex items-center justify-between">
						<span class="text-gray-600">Consultation Fee</span>
						<span class="font-medium text-gray-800">₹{BOOKING_FEE.toFixed(2)}</span>
					</div>
					<div class="flex items-center justify-between">
						<span class="text-gray-600">Tax</span>
						<span class="font-medium text-gray-800">₹0.00</span>
					</div>
					<hr class="border-gray-200" />
					<div class="flex items-center justify-between text-lg">
						<span class="font-semibold text-gray-800">Total</span>
						<span class="font-bold text-amber-600">₹{BOOKING_FEE.toFixed(2)}</span>
					</div>
				</div>
			</div>

			<!-- Verifying state indicator -->
			{#if status === 'verifying'}
				<div
					class="mb-6 flex items-center justify-center gap-3 rounded-2xl bg-amber-50 p-4 text-amber-800"
				>
					<Icon icon="ph:spinner" class="size-5 animate-spin" />
					<span class="text-sm font-medium">Verifying your payment with our server…</span>
				</div>
			{/if}

			<!-- Success indicator -->
			{#if status === 'success'}
				<div
					class="mb-6 flex items-center justify-center gap-3 rounded-2xl bg-green-50 p-4 text-green-800"
				>
					<Icon icon="ph:check-circle" class="size-5" />
					<span class="text-sm font-medium">Payment verified! Redirecting…</span>
				</div>
			{/if}

			<!-- Payment Button / State -->
			{#if status === 'idle' || status === 'error'}
				<button
					id="pay-now-btn"
					onclick={handlePayNow}
					class="flex w-full items-center justify-center gap-2 rounded-full bg-amber-600 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-amber-700 active:scale-[0.99]"
				>
					<Icon icon="ph:credit-card" class="size-6" />
					{status === 'error' ? 'Retry Payment' : `Pay ₹${BOOKING_FEE.toFixed(2)}`}
				</button>
			{:else if status === 'loading' || status === 'checking'}
				<button
					disabled
					class="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-amber-400 py-4 text-lg font-semibold text-white"
				>
					<Icon icon="ph:spinner" class="size-6 animate-spin" />
					Preparing...
				</button>
			{:else if status === 'processing'}
				<div class="rounded-full bg-blue-50 py-4 text-center text-sm font-medium text-blue-700">
					Complete the payment in the Razorpay window
				</div>
			{/if}

			<!-- Security Note -->
			<div class="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-500">
				<Icon icon="ph:lock-simple" class="size-4" />
				<span>Secure payment powered by Razorpay</span>
			</div>
		</div>

		<!-- Help Section -->
		<div class="mt-6 text-center">
			<p class="text-sm text-gray-500">
				Having trouble with payment?
				<a href="/contact" class="font-medium text-amber-600 hover:text-amber-700">Contact Support</a>
			</p>
		</div>
	</div>
</div>
