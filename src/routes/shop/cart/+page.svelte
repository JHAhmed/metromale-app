<script>
	import Icon from '@iconify/svelte';
	import { isAuthenticated } from '$lib/stores/auth.svelte';
	import { goto } from '$app/navigation';
	import { slide } from 'svelte/transition';
	import { cart } from '$lib/stores/cart.svelte';
	import { storageAdapter } from '$lib/utils/storageAdapter';
	import { products } from '$lib/stores/products.svelte';
	import { getFile } from '$lib/utils/getFile';

	let cartItems = $derived.by(() => {
		let items = [];
		let missingItem = {
			id: null,
			product: {
				name: 'Product Not Found',
				price: 0,
				imageUrls: []
			},
			quantity: 0
		};

		for (let item of cart.items) {
			let product = products.items.find((p) => p.$id === item.product.$id);
			if (product) {
				items.push({
					...item,
					product
				});
			} else {
				items.push({
					...item,
					product: missingItem.product
				});
			}
		}
		return items;
	});

	let addQuantity = (id) => {
		// Since cartItems is a derived store, we just need to update items in cart store
		const item = cartItems.find((item) => item.product.$id == id);

		if (item) {
			item.quantity += 1;
			cart.items = cart.items.map((i) => (i.product.$id === id ? item : i));

			storageAdapter.setObject('cart', cart);
		}
	};

	let removeQuantity = (id) => {
		// Since cartItems is a derived store, we just need to update items in cart store
		const item = cartItems.find((item) => item.product.$id == id);

		if (item && item.quantity > 1) {
			item.quantity -= 1;
			cart.items = cart.items.map((i) => (i.product.$id === id ? item : i));

			storageAdapter.setObject('cart', cart);
		} else if (item && item.quantity === 1) {
			removeItem(id);
		}

		storageAdapter.setObject('cart', cart);
	};

	let removeItem = (id) => {
		cart.items = cart.items.filter((item) => item.product.$id !== id);
	};

	let subtotal = $derived(
		cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
	);
	let tax = $derived(subtotal * 0.18); // Assuming 18% GST
	let total = $derived(subtotal + tax);

	let clearCart = () => {
		cart.items = [];
		storageAdapter.setObject('cart', cart);
	};
</script>

<div class="space-y-6 p-4 md:p-8">
	<div class="flex w-full items-center justify-between">
		<h1 class="text-2xl font-semibold text-gray-800">Shopping Cart</h1>
		{#if cartItems.length > 0}
			<button
				class="flex items-center space-x-1 rounded-lg bg-gray-100 p-1 px-2 text-sm font-medium text-red-600 hover:text-red-800"
				onclick={clearCart}>
				<span>Clear Cart</span>
				<!-- <Icon icon="ph:trash-simple-bold" class="size-4" /> -->
			</button>
		{/if}
	</div>

	{#if cartItems.length === 0}
		<div
			class="relative flex flex-col items-center justify-center rounded-3xl bg-white p-8 text-center shadow-lg/1"
			transition:slide>
			<Icon icon="ph:shopping-cart" class="mb-4 size-12 text-gray-400" />
			<h2 class="mb-2 text-lg font-medium text-gray-700">Your cart is empty</h2>
			<p class="mb-6 text-sm text-gray-500">Add some products to get started.</p>
			<button
				class="rounded-full bg-amber-600 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-700"
				onclick={() => goto('/shop')}>
				Continue Shopping
			</button>
		</div>
	{:else}
		<div class="space-y-4">
			{#each cartItems as item (item.product.$id)}
				<div
					class="flex items-center justify-between rounded-2xl bg-white p-3 shadow-lg/1"
					transition:slide>
					<div class="flex flex-1 items-center space-x-4">
						<div
							class="hidden aspect-square h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-200 xs:block">
							{#await getFile(item.product.imageUrls[0]) then imageUrl}
								<img
									src={imageUrl}
									alt={item.product.name}
									class="aspect-square h-full w-full shrink-0 object-cover" />
							{/await}
						</div>
						<div class="">
							<h3 class="line-clamp-2 text-sm font-semibold text-gray-700">{item.product.name}</h3>
							<p class="text-xs text-gray-500">₹{item.product.price}</p>
						</div>
					</div>

					<div class="flex items-center space-x-4">
						<!-- Quantity stepper -->
						<div class="flex items-center space-x-2 rounded-full bg-gray-100 px-3 py-1">
							<button
								class="text-gray-600 hover:text-gray-800"
								onclick={() => removeQuantity(item.product.$id)}>
								<Icon icon="ph:minus" class="size-4" />
							</button>
							<span class="min-w-2 text-center font-medium text-gray-700">{item.quantity}</span>
							<button
								class="text-gray-600 hover:text-gray-800"
								onclick={() => addQuantity(item.product.$id)}>
								<Icon icon="ph:plus" class="size-4" />
							</button>
						</div>

						<p class="font-semibold text-gray-800">
							₹{(item.product.price * item.quantity).toLocaleString()}
						</p>
					</div>
				</div>
			{/each}
		</div>

		<!-- Summary -->
		<div class="lg:ml-auto lg:w-1/3">
			<div class="rounded-3xl bg-white p-6 shadow-lg/1">
				<h2 class="mb-4 text-lg font-semibold text-gray-800">Order Summary</h2>
				<div class="mb-4 space-y-3">
					<div class="flex justify-between text-sm text-gray-600">
						<span>Subtotal</span>
						<span>₹{subtotal.toLocaleString()}</span>
					</div>
					<div class="flex justify-between text-sm text-gray-600">
						<span>GST (18%)</span>
						<span>₹{tax.toLocaleString()}</span>
					</div>
				</div>
				<div class="mb-6 border-t border-gray-400 pt-4">
					<div class="flex justify-between text-xl font-bold text-gray-800">
						<span>Total</span>
						<span>₹{total.toLocaleString()}</span>
					</div>
				</div>
				{#if isAuthenticated.isAuthenticated}
					<button
						class="inline-flex w-full items-center justify-center rounded-full bg-amber-600 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-amber-700 active:scale-[0.99]"
						onclick={() => goto('/checkout')}>
						Proceed to Checkout
						<Icon icon="ph:arrow-right-bold" class="ml-2 size-5" />
					</button>
				{:else}
					<button
						class="w-full cursor-not-allowed rounded-full bg-gray-400 py-4 text-lg font-semibold text-white shadow-lg"
						disabled>
						Login to Checkout
					</button>
					<p class="mt-2 text-center text-sm text-gray-500">
						<a href="/login" class="text-amber-600 hover:underline">Sign in</a> to continue
					</p>
				{/if}
			</div>
		</div>
	{/if}
</div>
