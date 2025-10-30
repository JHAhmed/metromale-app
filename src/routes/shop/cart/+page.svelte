<script>
	import Icon from '@iconify/svelte';
	import { isAuthenticated } from '$lib/stores/auth.svelte';
	import { goto } from '$app/navigation';
	import { slide } from 'svelte/transition';

	let cartItems = $state([
		{
			id: 1,
			title: 'Male Fertility Supplements',
			price: 1999,
			quantity: 2,
			imageUrl: 'https://img.freepik.com/free-photo/medicines-healthcare-accessories-arranged-blue-surface_23-2148213988.jpg?semt=ais_hybrid&w=740&q=80'
		},
		{
			id: 2,
			title: 'Vitamin D3 Boost',
			price: 799,
			quantity: 1,
			imageUrl: 'https://img.freepik.com/free-photo/vitamins-supplements-arranged-white-surface_23-2148213987.jpg?semt=ais_hybrid&w=740&q=80'
		}
	]);

	let addQuantity = (id) => {
		const item = cartItems.find(item => item.id === id);
		if (item) {
			item.quantity = Math.max(1, item.quantity + 1);
		}
	};
    
	let removeQuantity = (id) => {
		const item = cartItems.find(item => item.id === id);
		if (item) {
			item.quantity = Math.max(0, item.quantity - 1);
            if (item.quantity === 0) {
                removeItem(id);
            }
		}
	};

	let removeItem = (id) => {
		cartItems = cartItems.filter(item => item.id !== id);
	};

	let subtotal = $derived(cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0));
	let tax = $derived(subtotal * 0.18); // Assuming 18% GST
	let total = $derived(subtotal + tax);

	let clearCart = () => {
		cartItems = [];
	};
</script>

<div class="space-y-6 p-4 md:p-8">
	<div class="flex w-full items-center justify-between">
		<h1 class="text-2xl font-semibold text-gray-800">Shopping Cart</h1>
		{#if cartItems.length > 0}
			<button
				class="flex items-center font-medium space-x-1 text-sm text-red-600 hover:text-red-800 bg-gray-100 p-1 px-2 rounded-lg"
				onclick={clearCart}
			>
            <span>Clear Cart</span>
            <!-- <Icon icon="ph:trash-simple-bold" class="size-4" /> -->
			</button>
		{/if}
	</div>

	{#if cartItems.length === 0}
		<div
			class="relative flex flex-col items-center justify-center rounded-3xl bg-white p-8 shadow-lg/1 text-center"
			transition:slide
		>
			<Icon icon="ph:shopping-cart" class="size-12 text-gray-400 mb-4" />
			<h2 class="text-lg font-medium text-gray-700 mb-2">Your cart is empty</h2>
			<p class="text-sm text-gray-500 mb-6">Add some products to get started.</p>
			<button
				class="rounded-full bg-amber-600 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-700"
				onclick={() => goto('/shop')}
			>
				Continue Shopping
			</button>
		</div>
	{:else}
		<div class="space-y-4">
			{#each cartItems as item (item.id)}
				<div
					class="flex items-center justify-between rounded-2xl bg-white p-3 shadow-lg/1"
					transition:slide
				>
					<div class="flex items-center space-x-4 flex-1">
						<div class="h-14 w-14 aspect-square shrink-0 rounded-xl bg-gray-200 overflow-hidden hidden xs:block">
							<img
								src={item.imageUrl}
								alt={item.title}
								class="h-full w-full object-cover aspect-square shrink-0"
							/>
						</div>
						<div class="">
							<h3 class="font-semibold text-sm text-gray-700 line-clamp-2">{item.title}</h3>
							<p class="text-xs text-gray-500">₹{item.price}</p>
						</div>
					</div>

					<div class="flex items-center space-x-4">
						<!-- Quantity stepper -->
						<div class="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1">
							<button
								class="text-gray-600 hover:text-gray-800"
								onclick={() => removeQuantity(item.id)}
							>
								<Icon icon="ph:minus" class="size-4" />
							</button>
							<span class="font-medium text-gray-700 min-w-2 text-center">{item.quantity}</span>
							<button
								class="text-gray-600 hover:text-gray-800"
								onclick={() => addQuantity(item.id)}
							>
								<Icon icon="ph:plus" class="size-4" />
							</button>
						</div>

						<p class="font-semibold text-gray-800">₹{(item.price * item.quantity).toLocaleString()}</p>

						<!-- <button
							class="text-red-600 hover:text-red-800"
							onclick={() => removeItem(item.id)}
						>
							<Icon icon="ph:x" class="size-5" />
						</button> -->
					</div>
				</div>
			{/each}
		</div>

		<!-- Summary -->
		<div class="lg:w-1/3 lg:ml-auto">
			<div class="rounded-3xl bg-white p-6 shadow-lg/1">
				<h2 class="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>
				<div class="space-y-3 mb-4">
					<div class="flex justify-between text-sm text-gray-600">
						<span>Subtotal</span>
						<span>₹{subtotal.toLocaleString()}</span>
					</div>
					<div class="flex justify-between text-sm text-gray-600">
						<span>GST (18%)</span>
						<span>₹{tax.toLocaleString()}</span>
					</div>
				</div>
				<div class="border-t border-gray-400 pt-4 mb-6">
					<div class="flex justify-between text-xl font-bold text-gray-800">
						<span>Total</span>
						<span>₹{total.toLocaleString()}</span>
					</div>
				</div>
				{#if isAuthenticated.isAuthenticated}
					<button
						class="w-full rounded-full bg-amber-600 py-4 text-lg font-semibold text-white shadow-lg hover:bg-amber-700 active:scale-[0.99] transition-all"
						onclick={() => goto('/checkout')}
					>
						<Icon icon="ph:arrow-right" class="inline mr-2 size-5" />
						Proceed to Checkout
					</button>
				{:else}
					<button
						class="w-full rounded-full bg-gray-400 py-4 text-lg font-semibold text-white shadow-lg cursor-not-allowed"
						disabled
					>
						Login to Checkout
					</button>
					<p class="text-center text-sm text-gray-500 mt-2">
						<a href="/login" class="text-amber-600 hover:underline">Sign in</a> to continue
					</p>
				{/if}
			</div>
		</div>
	{/if}
</div>