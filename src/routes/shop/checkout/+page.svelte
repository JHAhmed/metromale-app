<!-- routes/shop/checkout/+page.svelte -->
<script>
	import { goto } from '$app/navigation';
	import { toast, Toaster } from 'svelte-sonner';
	import Icon from '@iconify/svelte';
	import { functions } from '$lib/appwrite';
	import { ExecutionMethod } from 'appwrite';
	import { onMount } from 'svelte';
	import { env } from '$env/dynamic/public';
	import { cart } from '$lib/stores/cart.svelte.js';
	import { products } from '$lib/stores/products.svelte.js';
	import { isAuthenticated, user } from '$lib/stores/auth.svelte.js';
	import { storageAdapter } from '$lib/utils/storageAdapter';
	import { getFile } from '$lib/utils/getFile';

	const RAZORPAY_KEY_ID = env.PUBLIC_RAZORPAY_KEY_ID;
	const FUNCTION_ID = env.PUBLIC_RAZORPAY_FUNCTION_ID;

	/** @type {'idle' | 'loading' | 'processing' | 'verifying' | 'success' | 'error'} */
	let status = $state('idle');
	let errorMessage = $state('');

	// Shipping / customer details
	let customerName = $state('');
	let customerEmail = $state('');
	let customerPhone = $state('');
	let shippingAddress = $state('');

	// Pre-fill from user data
	onMount(() => {
		if (cart.items.length === 0) {
			toast.info('Your cart is empty. Redirecting to shop…');
			goto('/shop');
			return;
		}

		if (user.user) {
			customerName = user.user.name || '';
			customerEmail = user.user.email || '';
			customerPhone = user.user.phone || '';
		}
	});

	// Build cart items with full product details
	let cartItems = $derived.by(() => {
		let items = [];
		for (let item of cart.items) {
			let product = products.items.find((p) => p.$id === item.product.$id);
			if (product) {
				items.push({ ...item, product });
			}
		}
		return items;
	});

	let subtotal = $derived(
		cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
	);
	let tax = $derived(subtotal * 0); // GST disabled for now
	let total = $derived(subtotal + tax);

	let formValid = $derived(
		customerName.trim().length > 0 &&
		customerEmail.trim().length > 0 &&
		shippingAddress.trim().length > 0
	);

	async function handlePayNow() {
		if (cartItems.length === 0) {
			toast.error('Your cart is empty.');
			return;
		}

		if (!formValid) {
			toast.error('Please fill in your name, email, and shipping address.');
			return;
		}

		const totalPaise = Math.round(total * 100);

		try {
			// ── Step 1: Create Razorpay order via Appwrite Function ──────────────
			status = 'loading';

			const createExecution = await functions.createExecution(
				FUNCTION_ID,
				JSON.stringify({
					action: 'create-order',
					amount: totalPaise,
					currency: 'INR',
					flow: 'shop-checkout',
					description: `Shop order — ${cartItems.length} item(s)`,
					cartSummary: cartItems.map((item) => ({
						productId: item.product.$id,
						name: item.product.name,
						price: item.product.price,
						quantity: item.quantity
					}))
				}),
				false,
				'/',
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

			// ── Step 2: Open Razorpay checkout modal ──────────────────────────────
			status = 'processing';

			await new Promise((resolve, reject) => {
				const options = {
					key: RAZORPAY_KEY_ID,
					amount: orderData.amount,
					currency: orderData.currency,
					name: 'Metromale Clinic',
					description: `Shop Order — ${cartItems.length} item(s)`,
					order_id: orderData.orderId,
					prefill: {
						name: customerName,
						email: customerEmail,
						contact: customerPhone
					},
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
								show_default_blocks: true
							}
						}
					},
					theme: {
						color: '#d97706'
					},
					modal: {
						ondismiss: () => {
							status = 'idle';
							toast.info('Payment was cancelled.');
							reject(new Error('dismissed'));
						}
					},
					handler: async (response) => {
						try {
							status = 'verifying';

							const verifyExecution = await functions.createExecution(
								FUNCTION_ID,
								JSON.stringify({
									action: 'verify-payment',
									razorpay_order_id: response.razorpay_order_id,
									razorpay_payment_id: response.razorpay_payment_id,
									razorpay_signature: response.razorpay_signature,
									flow: 'shop-checkout',
									userId: user.user.$id,
									orderData: {
										customerName: customerName.trim(),
										customerEmail: customerEmail.trim(),
										customerPhone: customerPhone.trim(),
										shippingAddress: shippingAddress.trim(),
										items: JSON.stringify(
											cartItems.map((item) => ({
												productId: item.product.$id,
												name: item.product.name,
												price: item.product.price,
												quantity: item.quantity
											}))
										),
										totalAmount: Math.round(total),
										itemCount: cartItems.length
									}
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

							// ── Success: clear cart and redirect ────────────────
							status = 'success';
							cart.items = [];
							storageAdapter.setObject('cart', cart);
							toast.success('Payment successful! Your order has been placed.');
							setTimeout(
								() =>
									goto(
										verifyData.shopOrderId
											? `/shop/orders/${verifyData.shopOrderId}`
											: '/shop/orders'
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

				// @ts-ignore
				const rzp = new window.Razorpay(options);

				rzp.on('payment.failed', (response) => {
					status = 'error';
					errorMessage = response.error?.description || 'Payment failed. Please try again.';
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
	<title>Checkout - Metromale Shop</title>
</svelte:head>

<div class="min-h-screen space-y-6 p-4 md:p-8">
	<!-- Back button -->
	<button
		class="mb-2 flex items-center space-x-2 text-gray-600 hover:text-gray-800"
		disabled={status === 'loading' || status === 'verifying'}
		onclick={() => goto('/shop/cart')}
	>
		<Icon icon="ph:arrow-left-bold" class="size-5" />
		<span class="text-sm font-medium">Back to Cart</span>
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
					{#if status === 'loading' || status === 'verifying'}
						<Icon icon="ph:spinner" class="size-8 animate-spin text-amber-600" />
					{:else if status === 'success'}
						<Icon icon="ph:check-circle-fill" class="size-8 text-green-600" />
					{:else if status === 'error'}
						<Icon icon="ph:warning-circle-fill" class="size-8 text-red-500" />
					{:else}
						<Icon icon="ph:shopping-bag" class="size-8 text-amber-600" />
					{/if}
				</div>
				<h1 class="text-2xl font-bold text-gray-800">
					{#if status === 'success'}
						Order Placed!
					{:else if status === 'error'}
						Payment Failed
					{:else}
						Shop Checkout
					{/if}
				</h1>
				<p class="mt-2 text-gray-600">
					{#if status === 'loading'}
						Preparing your payment...
					{:else if status === 'processing'}
						Complete your payment in the window above
					{:else if status === 'verifying'}
						Verifying your payment, please wait...
					{:else if status === 'success'}
						Redirecting to your order...
					{:else if status === 'error'}
						{errorMessage}
					{:else}
						Review your order and complete payment
					{/if}
				</p>
			</div>

			<!-- Shipping Details Form -->
			{#if status !== 'success'}
				<div class="mb-6 rounded-2xl bg-gray-50 p-6">
					<h2 class="mb-4 text-lg font-semibold text-gray-800">
						<Icon icon="ph:map-pin" class="mr-1 inline size-5" />
						Shipping Details
					</h2>
					<div class="space-y-4">
						<div>
							<label for="customerName" class="mb-1 block text-sm font-medium text-gray-700">Full Name *</label>
							<input
								id="customerName"
								type="text"
								bind:value={customerName}
								disabled={status !== 'idle' && status !== 'error'}
								placeholder="Your full name"
								class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition-colors focus:border-amber-400 focus:ring-1 focus:ring-amber-400 disabled:opacity-50"
							/>
						</div>
						<div>
							<label for="customerEmail" class="mb-1 block text-sm font-medium text-gray-700">Email *</label>
							<input
								id="customerEmail"
								type="email"
								bind:value={customerEmail}
								disabled={status !== 'idle' && status !== 'error'}
								placeholder="your@email.com"
								class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition-colors focus:border-amber-400 focus:ring-1 focus:ring-amber-400 disabled:opacity-50"
							/>
						</div>
						<div>
							<label for="customerPhone" class="mb-1 block text-sm font-medium text-gray-700">Phone</label>
							<input
								id="customerPhone"
								type="tel"
								bind:value={customerPhone}
								disabled={status !== 'idle' && status !== 'error'}
								placeholder="Your phone number"
								class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition-colors focus:border-amber-400 focus:ring-1 focus:ring-amber-400 disabled:opacity-50"
							/>
						</div>
						<div>
							<label for="shippingAddress" class="mb-1 block text-sm font-medium text-gray-700">Shipping Address *</label>
							<textarea
								id="shippingAddress"
								bind:value={shippingAddress}
								disabled={status !== 'idle' && status !== 'error'}
								placeholder="Full address including city, state, and PIN code"
								rows="3"
								class="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition-colors focus:border-amber-400 focus:ring-1 focus:ring-amber-400 disabled:opacity-50"
							></textarea>
						</div>
					</div>
				</div>
			{/if}

			<!-- Cart Items -->
			{#if cartItems.length > 0 && status !== 'success'}
				<div class="mb-6 space-y-3">
					{#each cartItems as item (item.product.$id)}
						<div class="flex items-center justify-between rounded-xl bg-gray-50 p-3">
							<div class="flex items-center gap-3">
								{#if item.product.imageUrls?.[0]}
									<div class="size-10 shrink-0 overflow-hidden rounded-lg bg-gray-200">
										{#await getFile(item.product.imageUrls?.[0]) then imageUrl}
											<img
												src={imageUrl}
												alt={item.product.name}
												class="size-full object-cover"
											/>
										{/await}
									</div>
								{/if}
								<div>
									<p class="line-clamp-1 text-sm font-medium text-gray-800">
										{item.product.name}
									</p>
									<p class="text-xs text-gray-500">Qty: {item.quantity}</p>
								</div>
							</div>
							<span class="text-sm font-semibold text-gray-800">
								₹{(item.product.price * item.quantity).toLocaleString()}
							</span>
						</div>
					{/each}
				</div>
			{/if}

			<!-- Order Summary -->
			<div class="mb-8 rounded-2xl bg-gray-50 p-6">
				<h2 class="mb-4 text-lg font-semibold text-gray-800">Order Summary</h2>
				<div class="space-y-3">
					<div class="flex items-center justify-between">
						<span class="text-gray-600">Subtotal ({cartItems.length} item{cartItems.length !== 1 ? 's' : ''})</span>
						<span class="font-medium text-gray-800">₹{subtotal.toLocaleString()}</span>
					</div>
					{#if tax > 0}
						<div class="flex items-center justify-between">
							<span class="text-gray-600">GST (18%)</span>
							<span class="font-medium text-gray-800">₹{tax.toFixed(2)}</span>
						</div>
					{/if}
					<hr class="border-gray-200" />
					<div class="flex items-center justify-between text-lg">
						<span class="font-semibold text-gray-800">Total</span>
						<span class="font-bold text-amber-600">₹{total.toFixed(2)}</span>
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
					<span class="text-sm font-medium">Payment verified! Your order is confirmed.</span>
				</div>
			{/if}

			<!-- Payment Button / State -->
			{#if status === 'idle' || status === 'error'}
				<button
					id="shop-pay-now-btn"
					onclick={handlePayNow}
					disabled={!formValid}
					class="flex w-full items-center justify-center gap-2 rounded-full bg-amber-600 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-amber-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-gray-400"
				>
					<Icon icon="ph:credit-card" class="size-6" />
					{status === 'error' ? 'Retry Payment' : `Pay ₹${total.toFixed(2)}`}
				</button>
			{:else if status === 'loading'}
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
