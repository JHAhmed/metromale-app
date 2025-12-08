<!-- routes/appointments/checkout/+page.svelte -->
<script>
	import { goto } from '$app/navigation';
	import { toast, Toaster } from 'svelte-sonner';
	import Icon from '@iconify/svelte';

	const PAYMENT_URL = 'https://api.wurks.studio/metromale?amount=20000';
	const BOOKING_FEE = 200; // ₹200.00 (amount is in paise: 20000)

	let paymentStatus = $state('pending');
	let isRefreshing = $state(false);

	function handlePayNow() {
		// Open payment URL in same window - user will be redirected back after payment
		window.location.href = PAYMENT_URL;
	}

	function handleRefresh() {
		isRefreshing = true;
		// TODO: Implement payment verification API call
		// This will check if payment is completed and verified
		setTimeout(() => {
			isRefreshing = false;
			toast.info('Payment verification coming soon');
		}, 1000);
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
		onclick={() => goto('/appointments')}>
		<Icon icon="ph:arrow-left-bold" class="size-5" />
		<span class="text-sm font-medium">Back to Appointments</span>
	</button>

	<div class="mx-auto max-w-lg">
		<div class="rounded-3xl bg-white p-8 shadow-lg">
			<!-- Header -->
			<div class="mb-8 text-center">
				<div
					class="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-amber-100">
					<Icon icon="ph:receipt" class="size-8 text-amber-600" />
				</div>
				<h1 class="text-2xl font-bold text-gray-800">Appointment Checkout</h1>
				<p class="mt-2 text-gray-600">Complete your payment to confirm your appointment</p>
			</div>

			<!-- Payment Details -->
			<div class="mb-8 rounded-2xl bg-gray-50 p-6">
				<h2 class="mb-4 text-lg font-semibold text-gray-800">Payment Summary</h2>
				<div class="space-y-3">
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

			<!-- Payment Status -->
			<!-- <div class="mb-6 flex items-center justify-between rounded-xl bg-yellow-50 p-4">
				<div class="flex items-center space-x-3">
					<Icon icon="ph:clock" class="size-5 text-yellow-600" />
					<span class="font-medium text-yellow-800">Status: {paymentStatus}</span>
				</div>
				<button
					onclick={handleRefresh}
					disabled={isRefreshing}
					class="flex items-center space-x-1 rounded-lg bg-yellow-100 px-3 py-1.5 text-sm font-medium text-yellow-700 transition-colors hover:bg-yellow-200 disabled:opacity-50">
					<Icon icon="ph:arrows-clockwise" class="size-4 {isRefreshing ? 'animate-spin' : ''}" />
					<span>Refresh</span>
				</button>
			</div> -->

			<!-- Payment Button -->
			<button
				onclick={handlePayNow}
				class="flex w-full items-center justify-center gap-2 rounded-full bg-amber-600 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-amber-700 active:scale-[0.99]">
				<Icon icon="ph:credit-card" class="size-6" />
				Pay ₹{BOOKING_FEE.toFixed(2)}
			</button>

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
				<a href="/contact" class="font-medium text-amber-600 hover:text-amber-700"
					>Contact Support</a>
			</p>
		</div>
	</div>
</div>
