<script>
	import { goto } from '$app/navigation';
	import { ViewTypes } from '$lib/enums';
	import Icon from '@iconify/svelte';
	let { view = $bindable() } = $props();

	let product = {
		title: 'Male Fertility Supplements',
		price: '₹1999',
		slug: 'male-fertility-supplements',
		imageUrl:
			'https://img.freepik.com/free-photo/medicines-healthcare-accessories-arranged-blue-surface_23-2148213988.jpg?semt=ais_hybrid&w=740&q=80'
	};
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
{#if view === ViewTypes.LIST}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		onclick={() => goto(`/shop/${product.slug}`)}
		class="flex h-32 items-center justify-start rounded-3xl bg-white text-left shadow-lg/1 transition-transform hover:scale-[1.01] active:scale-[0.99]">
		<div class="mr-4 h-full rounded-xl bg-gray-200">
			<img
				src={product.imageUrl}
				class="aspect-square h-full w-full rounded-xl object-cover"
				alt="" />
		</div>

		<div class="flex flex-col items-start space-y-2 p-2">
			<h3 class="leading-tight font-semibold text-gray-700">{product.title}</h3>
			<p class="text-sm font-medium text-gray-500">{product.price}</p>
		</div>

		<div class="mr-4 ml-auto">
			<button
				class="bg-primary-600 flex items-center rounded-full bg-primary p-2 text-white transition-colors">
				<span class="mr-1 hidden">View</span>
				<Icon icon="ph:arrow-right-bold" class="size-6" />
			</button>
		</div>
	</div>
{:else if view === ViewTypes.GRID}
	<!-- svelte-ignore a11y_click_events_have_key_events -->

	<div
		onclick={() => goto(`/shop/${product.slug}`)}
		class="flex flex-col rounded-3xl bg-white text-left shadow-lg/1 transition-transform hover:scale-[1.01] active:scale-[0.99]">
		<div class="h-48 w-full rounded-t-3xl bg-gray-200">
			<img src={product.imageUrl} class="h-full w-full rounded-t-3xl object-cover" alt="" />
		</div>

		<div class="flex flex-col items-start space-y-2 p-4">
			<h3 class="leading-tight font-semibold text-gray-700">{product.title}</h3>
			<p class="text-sm font-medium text-gray-500">{product.price}</p>
		</div>

		<div class="flex w-full items-center justify-center p-2 pt-0">
			<button
				class="bg-primary-600 flex w-full items-center justify-between rounded-full bg-primary p-2 px-4 text-white transition-colors">
				<span class="mr-1">View</span>
				<Icon icon="ph:arrow-right-bold" class="size-6" />
			</button>
		</div>
	</div>
{/if}
