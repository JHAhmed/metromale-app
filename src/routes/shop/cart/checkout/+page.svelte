<!-- routes/shop/cart/checkout/+page.svelte -->
<script>
	import { goto } from '$app/navigation';
	import { toast, Toaster } from 'svelte-sonner';
	import Icon from '@iconify/svelte';

	import { user } from '$lib/stores/auth.svelte';
	import { cart } from '$lib/stores/cart.svelte';
	import { addOrder } from '$lib/tables/orders';
	import { ID } from 'appwrite';
	import { storageAdapter } from '$lib/utils/storageAdapter';

	let isSubmitting = $state(false);
	let orderPlaced = $state(false);
	let orderId = $state('');

	// Delivery address fields
	let address = $state({
		street: '',
		city: '',
		state: '',
		pincode: '',
		landmark: ''
	});

	// Calculate cart totals
	let cartTotal = $derived.by(() => {
		return cart.items.reduce((total, item) => {
			return total + item.product.price * item.quantity;
		}, 0);
	});

	let cartItemCount = $derived.by(() => {
		return cart.items.reduce((count, item) => count + item.quantity, 0);
	});

	let isFormValid = $derived.by(() => {
		return (
			address.street && address.city && address.state && address.pincode && cart.items.length > 0
		);
	});

	async function handlePlaceOrder() {
		if (!isFormValid) {
			toast.error('Please fill in all required delivery address fields');
			return;
		}

		isSubmitting = true;

		try {
			// Prepare order data
			const orderData = {
				userId: user.user.$id,
				orderId: ID.unique(),
				customerName: user.user.name || '',
				customerEmail: user.user.email || '',
				customerPhone: user.user.phone || '',
				shippingAddress: `${address.street}, ${address.landmark ? address.landmark + ', ' : ''}${address.city}, ${address.state} - ${address.pincode}`,
				items: JSON.stringify(
					cart.items.map((item) => ({
						productId: item.product.$id,
						productName: item.product.name,
						price: item.product.price,
						quantity: item.quantity
					}))
				),
				totalAmount: cartTotal,
				itemCount: cartItemCount,
				status: 'pending',
				paymentStatus: 'unpaid'
			};

			const order = await addOrder(orderData);

			if (order) {
				orderId = order.$id;
				orderPlaced = true;

				// Clear the cart
				cart.items = [];
				storageAdapter.setObject('cart', cart);
				toast.success('Order placed successfully!');
			} else {
				toast.error('Failed to place order. Please try again.');
			}
		} catch (error) {
			console.error('Order Error:', error);
			toast.error(error.message || 'An error occurred while placing order.');
		} finally {
			isSubmitting = false;
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
		onclick={() => goto('/shop/cart')}>
		<Icon icon="ph:arrow-left-bold" class="size-5" />
		<span class="text-sm font-medium">Back to Cart</span>
	</button>

	{#if orderPlaced}
		<!-- Order Confirmation -->
		<div class="mx-auto max-w-lg">
			<div class="rounded-3xl bg-white p-8 text-center shadow-lg">
				<div
					class="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-green-100">
					<Icon icon="ph:check-circle" class="size-12 text-green-600" />
				</div>
				<h1 class="mb-2 text-2xl font-bold text-gray-800">Order Confirmed!</h1>
				<p class="mb-4 text-gray-600">
					Thank you for your order. Your order has been placed successfully.
				</p>

				<div class="mb-6 rounded-xl bg-gray-50 p-4">
					<p class="text-sm text-gray-500">Order ID</p>
					<p class="font-mono font-semibold text-gray-800">{orderId}</p>
				</div>

				<div class="mb-6 rounded-xl bg-amber-50 p-4">
					<div class="flex items-center justify-center space-x-2 text-amber-700">
						<Icon icon="ph:wallet" class="size-5" />
						<span class="font-medium">Cash on Delivery</span>
					</div>
					<p class="mt-1 text-sm text-amber-600">
						Payment will be collected at the time of delivery
					</p>
				</div>

				<div class="flex gap-3">
					<button
						onclick={() => goto('/shop')}
						class="w-full rounded-full bg-gray-200 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-300 active:scale-[0.99]">
						Continue Shopping
					</button>
					<button
						onclick={() => goto('/shop/orders')}
						class="w-full rounded-full bg-amber-600 py-3 font-semibold text-white transition-all hover:bg-amber-700 active:scale-[0.99]">
						View Orders
					</button>
				</div>
			</div>
		</div>
	{:else}
		<h1 class="text-2xl font-semibold text-gray-800">Checkout</h1>

		{#if cart.items.length === 0}
			<div class="mx-auto max-w-lg rounded-3xl bg-white p-8 text-center shadow-lg">
				<Icon icon="ph:shopping-cart" class="mx-auto mb-4 size-16 text-gray-300" />
				<h2 class="mb-2 text-xl font-semibold text-gray-800">Your cart is empty</h2>
				<p class="mb-6 text-gray-600">Add some products to checkout</p>
				<button
					onclick={() => goto('/shop')}
					class="rounded-full bg-amber-600 px-8 py-3 font-semibold text-white transition-all hover:bg-amber-700">
					Browse Products
				</button>
			</div>
		{:else}
			<div class="mx-auto max-w-2xl space-y-6">
				<!-- Customer Info (from logged in user) -->
				<div class="rounded-3xl bg-white p-6 shadow-lg">
					<h2 class="mb-4 flex items-center space-x-2 text-lg font-semibold text-gray-800">
						<Icon icon="ph:user" class="size-5" />
						<span>Customer Details</span>
					</h2>
					<div class="space-y-2 text-sm text-gray-600">
						<div class="flex items-center space-x-2">
							<Icon icon="ph:user-circle" class="size-4" />
							<span>{user.user?.name || 'N/A'}</span>
						</div>
						<div class="flex items-center space-x-2">
							<Icon icon="ph:envelope" class="size-4" />
							<span>{user.user?.email || 'N/A'}</span>
						</div>
						<div class="flex items-center space-x-2">
							<Icon icon="ph:phone" class="size-4" />
							<span>{user.user?.phone || 'N/A'}</span>
						</div>
					</div>
				</div>

				<!-- Delivery Address -->
				<div class="rounded-3xl bg-white p-6 shadow-lg">
					<h2 class="mb-4 flex items-center space-x-2 text-lg font-semibold text-gray-800">
						<Icon icon="ph:map-pin" class="size-5" />
						<span>Delivery Address</span>
					</h2>
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div class="md:col-span-2">
							<label class="mb-1 block text-sm font-medium text-gray-700">Street Address *</label>
							<input
								type="text"
								bind:value={address.street}
								placeholder="House/Flat no., Street name"
								class="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none" />
						</div>
						<div>
							<label class="mb-1 block text-sm font-medium text-gray-700">City *</label>
							<input
								type="text"
								bind:value={address.city}
								placeholder="City"
								class="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none" />
						</div>
						<div>
							<label class="mb-1 block text-sm font-medium text-gray-700">State *</label>
							<input
								type="text"
								bind:value={address.state}
								placeholder="State"
								class="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none" />
						</div>
						<div>
							<label class="mb-1 block text-sm font-medium text-gray-700">Pincode *</label>
							<input
								type="text"
								bind:value={address.pincode}
								placeholder="6-digit pincode"
								maxlength="6"
								class="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none" />
						</div>
						<div>
							<label class="mb-1 block text-sm font-medium text-gray-700"
								>Landmark (Optional)</label>
							<input
								type="text"
								bind:value={address.landmark}
								placeholder="Near..."
								class="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none" />
						</div>
					</div>
				</div>

				<!-- Order Summary -->
				<div class="rounded-3xl bg-white p-6 shadow-lg">
					<h2 class="mb-4 flex items-center space-x-2 text-lg font-semibold text-gray-800">
						<Icon icon="ph:receipt" class="size-5" />
						<span>Order Summary</span>
					</h2>
					<div class="space-y-3">
						{#each cart.items as item}
							<div class="flex items-center justify-between border-b border-gray-100 pb-3">
								<div class="flex items-center space-x-3">
									<span class="rounded-lg bg-gray-100 px-2 py-1 text-sm font-medium"
										>{item.quantity}x</span>
									<span class="text-gray-700">{item.product.name}</span>
								</div>
								<span class="font-medium text-gray-800"
									>₹{(item.product.price * item.quantity).toFixed(2)}</span>
							</div>
						{/each}
						<div class="flex items-center justify-between pt-2">
							<span class="font-medium text-gray-600">Subtotal</span>
							<span class="font-medium text-gray-800">₹{cartTotal.toFixed(2)}</span>
						</div>
						<div class="flex items-center justify-between">
							<span class="font-medium text-gray-600">Delivery</span>
							<span class="font-medium text-green-600">Free</span>
						</div>
						<hr class="border-gray-200" />
						<div class="flex items-center justify-between text-lg">
							<span class="font-semibold text-gray-800">Total</span>
							<span class="font-bold text-amber-600">₹{cartTotal.toFixed(2)}</span>
						</div>
					</div>
				</div>

				<!-- Payment Method -->
				<div class="rounded-3xl bg-amber-50 p-6">
					<div class="flex items-center space-x-3">
						<Icon icon="ph:money" class="size-6 text-amber-600" />
						<div>
							<p class="font-semibold text-gray-800">Cash on Delivery</p>
							<p class="text-sm text-gray-600">Pay when your order arrives</p>
						</div>
					</div>
				</div>

				<!-- Place Order Button -->
				<button
					onclick={handlePlaceOrder}
					disabled={!isFormValid || isSubmitting}
					class="flex w-full items-center justify-center gap-2 rounded-full bg-amber-600 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-amber-700 active:scale-[0.99] disabled:bg-gray-400">
					{#if isSubmitting}
						<Icon icon="ph:spinner" class="size-6 animate-spin" />
						Placing Order...
					{:else}
						<Icon icon="ph:check-circle" class="size-6" />
						Place Order
					{/if}
				</button>
			</div>
		{/if}
	{/if}
</div>
