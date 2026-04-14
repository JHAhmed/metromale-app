<script>
	import Icon from '@iconify/svelte';
	import { goto } from '$app/navigation';
	import { isAuthenticated, user } from '$lib/stores/auth.svelte';
	import Product from '$lib/components/Product.svelte';
	import { ViewTypes } from '$lib/enums';
	import { slide } from 'svelte/transition';
	import { cart } from '$lib/stores/cart.svelte';
	import { onMount } from 'svelte';
	import { getProducts } from '$lib/tables/products.js';
	import { getUserShopOrders } from '$lib/tables/shopOrders';

	// let { data } = $props();

	let showUpcomingOrders = $state(false);
	let view = $state(ViewTypes.LIST);
	// let numProducts = $state();

	onMount(() => {
		if (cart.items?.length > 0) {
			showUpcomingOrders = true;
		}
	});
</script>

<div class="space-y-4 p-4 md:p-8">
	<div class="flex w-full items-center justify-between">
		<h1 class="text-2xl font-semibold text-gray-800">Shop</h1>

		<button
			class="rounded-lg bg-white p-1 shadow-sm/5 hover:bg-gray-200 active:bg-gray-200"
			onclick={() => (showUpcomingOrders = !showUpcomingOrders)}
			aria-label="Show/Hide Upcoming Orders">
			<Icon
				icon={showUpcomingOrders ? 'ph:caret-up-bold' : 'ph:caret-down-bold'}
				class="size-6 text-gray-700" />
		</button>
	</div>

	{#if showUpcomingOrders}
		<div
			transition:slide
			class="relative flex flex-col items-center justify-center rounded-3xl bg-white p-6 shadow-lg/1">
			<div class="flex h-32 w-full flex-col items-center justify-center space-y-6">
				{#if cart.items.length === 0}
					<Icon icon="ph:shopping-cart" class="size-8 text-gray-400" />
					<h2 class="text-center font-medium text-gray-700">
						{isAuthenticated.isAuthenticated ? 'No Upcoming Orders' : 'Login to view orders'}
					</h2>
				{:else}
					<Icon icon="ph:package" class="size-8 text-gray-400" />
					<h2 class="text-center font-medium text-gray-700">
						You have {cart.items.length} item{cart.items.length === 1 ? '' : 's'} in your cart
					</h2>
				{/if}
			</div>

				<div class="flex w-full gap-2">
				<a
					href="/shop/cart"
					class="inline-flex flex-1 items-center justify-center rounded-xl bg-gray-50 p-4 text-center text-sm font-medium text-gray-700 shadow-md/5">
					Open Cart
					<Icon icon="ph:arrow-right" class="ml-2 size-5 " />
				</a>
				<a
					href="/shop/orders"
					class="inline-flex flex-1 items-center justify-center rounded-xl bg-gray-50 p-4 text-center text-sm font-medium text-gray-700 shadow-md/5">
					My Orders
					<Icon icon="ph:arrow-right" class="ml-2 size-5" />
				</a>
			</div>
		</div>
	{/if}

	<div class="flex w-full items-center justify-between">
		<h2 class="text-xl font-semibold text-gray-800">
			Products
			<!-- <span class="font-light text-gray-600">{numProducts}</span> -->
		</h2>
		<div class="flex items-center space-x-0.5 rounded-lg bg-gray-50">
			<!-- View Toggle Buttons -->
			<button
				class="rounded-lg p-2 hover:bg-gray-200 active:bg-gray-200 {view === ViewTypes.GRID
					? 'bg-white shadow-sm/5'
					: ''}"
				onclick={() => (view = ViewTypes.GRID)}
				aria-label="Grid View">
				<Icon icon="ph:grid-four" class="size-6 text-gray-700" />
			</button>
			<button
				class="rounded-lg p-2 hover:bg-gray-200 active:bg-gray-200 {view === ViewTypes.LIST
					? 'bg-white shadow-sm/5'
					: ''}"
				onclick={() => (view = ViewTypes.LIST)}
				aria-label="List View">
				<Icon icon="ph:list-bullets" class="size-6 text-gray-700" />
			</button>
		</div>
	</div>

	<div class="grid gap-4 {view === ViewTypes.GRID ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1'}">
		{#await getProducts()}
			<div
				class="rounded-xl border border-dashed border-gray-200 bg-white/50 p-8 text-center backdrop-blur-sm">
				<p class="text-gray-500">Please wait...</p>
			</div>
		{:then products}
			{#if products && products.total > 0}
				{#each products.rows as product (product.$id)}
					<Product {product} bind:view />
				{/each}
			{:else}
				<div
					class="rounded-xl border border-dashed border-gray-200 bg-white/50 p-8 text-center backdrop-blur-sm">
					<p class="text-gray-500">No products found.</p>
				</div>
			{/if}
		{:catch error}
			<div
				class="rounded-xl border border-dashed border-red-500 bg-white/50 p-8 text-center backdrop-blur-sm">
				<p class="text-gray-500">Something went wrong: {error.message}</p>
			</div>
		{/await}
	</div>

	<div class="flex w-full items-center justify-between">
		<h2 class="text-xl font-semibold text-gray-800">Orders</h2>
		<a href="/shop/orders" class="text-sm font-medium text-amber-600 hover:text-amber-700">View all</a>
	</div>

	{#await getUserShopOrders(user?.user?.$id)}
		<div class="rounded-xl border border-dashed border-gray-200 bg-white/50 p-8 text-center">
			<p class="text-gray-400">Loading orders...</p>
		</div>
	{:then orders}
		{#if orders && orders.total > 0}
			<div class="space-y-3">
				{#each orders.rows as order (order.$id)}
					<button
						onclick={() => goto(`/shop/orders/${order.$id}`)}
						class="flex h-20 w-full items-center justify-between rounded-3xl bg-white pl-4 pr-5 shadow-lg/1 transition-transform hover:scale-[1.01] active:scale-[0.99]">
						<!-- Left: icon + info -->
						<div class="flex items-center gap-3">
							<div class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-50">
								<Icon icon="ph:package" class="size-6 text-amber-500" />
							</div>
							<div class="text-left">
								<p class="text-sm font-semibold leading-tight text-gray-800">
									{order.itemCount} item{order.itemCount !== 1 ? 's' : ''} · ₹{order.totalAmount?.toLocaleString()}
								</p>
								<p class="mt-0.5 text-xs capitalize text-gray-400">{order.status}</p>
							</div>
						</div>
						<!-- Right: arrow -->
						<Icon icon="ph:arrow-right-bold" class="size-5 shrink-0 text-gray-400" />
					</button>
				{/each}
			</div>
		{:else}
			<div class="rounded-xl border border-dashed border-gray-200 bg-white/50 p-8 text-center">
				<p class="text-gray-400">No orders yet.</p>
			</div>
		{/if}
	{:catch}
		<div class="rounded-xl border border-dashed border-gray-200 bg-white/50 p-8 text-center">
			<p class="text-gray-400">Could not load orders.</p>
		</div>
	{/await}

</div>
