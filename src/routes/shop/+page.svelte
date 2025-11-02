<script>
	import Icon from '@iconify/svelte';
	import { isAuthenticated } from '$lib/stores/auth.svelte';
	import Product from '$lib/components/Product.svelte';
	import { ViewTypes } from '$lib/enums';
	import { slide } from 'svelte/transition';
	import { cart } from '$lib/stores/cart.svelte';

	let { data } = $props();

	let showUpcomingOrders = $state(true);
	let view = $state(ViewTypes.LIST);
	let numProducts = $state(4);

	console.log(cart.items);
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
			<div class="flex h-32 w-full flex-col items-center justify-center space-y-6 ">

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

			<a
				href="/shop/cart"
				class="inline-flex w-full items-center justify-center rounded-xl bg-gray-50 p-4 text-center text-sm font-medium text-gray-700 shadow-md/5">
				Open Cart
				<Icon icon="ph:arrow-right" class="ml-2 size-5 " />
			</a>
		</div>
	{/if}
	<div class="flex w-full items-center justify-between">
		<h2 class="text-xl font-semibold text-gray-800">
			Products <span class="font-light text-gray-600">{numProducts}</span>
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
		{#each data.products as product (product.$id)}
			<Product {product} bind:view />
		{/each}
	</div>
</div>
