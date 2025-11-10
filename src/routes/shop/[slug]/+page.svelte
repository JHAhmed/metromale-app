<script>
	import Icon from '@iconify/svelte';
	import { goto } from '$app/navigation';
	import Carousel from '$lib/components/ui/Carousel.svelte';
	import { onMount } from 'svelte';
	import { getFile } from '$lib/utils/getFile.js';
	import { cart } from '$lib/stores/cart.svelte';
	import { storageAdapter } from '$lib/utils/storageAdapter.js';

	let { data } = $props();
	let product = data.product;
	let images = $state([]);

	let addedToCart = $state(false);

	onMount(async () => {
		// For each url in product.imageUrls, fetch the actual file URL and store in images array as {imageUrl: url, alt: product.name}
		images = await Promise.all(
			product.imageUrls.map((url) =>
				getFile(url).then((imageUrl) => ({ imageUrl, alt: product.name }))
			)
		);
	});

	async function addToCart() {
		// let storedCard = await storageAdapter.getObject('cart');

		// Here's what cart.items looks like:

		// [
		// 	product: {
		// 		id: 'prod_123',
		// 		name: 'Product Name',
		// 		price: 100
		// 		// other product details
		// 	},
		// 	quantity: 2
		// }
		// ];

		// check if product already exists in cart
		let existingItem = cart.items.find((item) => item.product.$id === product.$id);
		// if items exits, increase item.quantity by 1
		if (existingItem) {
			existingItem.quantity += 1;
		} else {
			// else add new item to cart
			cart.items = [...cart.items, { product: product, quantity: 1 }];
		}

		addedToCart = true;
		await storageAdapter.setObject('cart', cart);
	}

	// // Sample product data for testing
	// let product = {
	// 	name: product.name,
	// 	price: product.price,
	// 	description:
	// 		'Premium blend of vitamins, minerals, and herbal extracts designed to support male reproductive health. Clinically studied ingredients to improve sperm quality and motility.',
	// 	imageUrl:
	// 		'https://img.freepik.com/free-photo/medicines-healthcare-accessories-arranged-blue-surface_23-2148213988.jpg?semt=ais_hybrid&w=740&q=80',
	// 	benefits: [
	// 		'Boosts sperm count by up to 30%',
	// 		'Enhances energy and vitality',
	// 		'Supports hormonal balance'
	// 	],
	// 	ingredients: ['Zinc', 'Selenium', 'L-Carnitine', 'CoQ10', 'Folic Acid'],
	// 	usage: 'Take 2 capsules daily with meals. Consult your doctor before starting.'
	// 	// reviews: 4.8,
	// 	// stockQuantity: 50
	// };
</script>

<div class="space-y-6 p-4 md:p-8">
	<!-- Back button -->
	<button
		class="mb-4 flex items-center space-x-2 text-gray-600 hover:text-gray-800"
		onclick={() => goto('/shop')}>
		<Icon icon="ph:arrow-left-bold" class="size-5" />
		<span class="text-sm font-medium">Back to Shop</span>
	</button>

	<div class="flex h-full flex-col gap-8">
		<div class="rounded-3xl bg-gray-100">
			<Carousel items={images} />
		</div>

		<!-- Product Details -->
		<div class="space-y-6">
			<!-- Product Name & Price -->
			<div>
				<h1 class="mb-2 text-3xl font-bold text-gray-800">{product.name}</h1>
				{#if product.reviews}
					<div class="mb-4 flex items-center space-x-2">
						<div class="flex space-x-0.5 text-amber-500">
							{#each Array(5) as _, i}
								<Icon
									icon={i < Math.floor(product.reviews) ? 'ph:star-fill' : 'ph:star'}
									class="size-4" />
							{/each}
						</div>
						<span class="text-sm text-gray-600">({product.reviews} rating)</span>
					</div>
				{/if}
				<p class="text-3xl font-semibold text-gray-800">₹{product.price}</p>
			</div>

			<p class="leading-relaxed text-gray-600">{product.description}</p>

			{#if product.benefits?.length > 0}
				<!-- Benefits -->
				<div>
					<h3 class="mb-3 text-lg font-semibold text-gray-800">Key Benefits</h3>
					<ul class="space-y-2">
						{#each product.benefits as benefit}
							<li class="flex items-start space-x-2 text-gray-700">
								<Icon icon="ph:check" class="mt-0.5 size-4 flex-shrink-0 text-emerald-500" />
								<span>{benefit}</span>
							</li>
						{/each}
					</ul>
				</div>
			{/if}

			<!-- Ingredients -->
			{#if product.ingredients?.length > 0}
				<div>
					<h3 class="mb-3 text-lg font-semibold text-gray-800">Ingredients</h3>
					<div class="flex flex-wrap gap-2">
						{#each product.ingredients as ingredient}
							<span class="rounded-full bg-gray-200 px-3 py-1 text-sm text-gray-700">
								{ingredient}
							</span>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Usage -->
			{#if product.usage}
				<div class="rounded-2xl bg-gray-50 p-4">
					<h3 class="mb-2 font-semibold text-gray-800">How to Use</h3>
					<p class="text-sm text-gray-600">{product.usage}</p>
				</div>
			{/if}

			{#if !addedToCart}
				<button
					onclick={addToCart}
					class="inline-flex w-full grow items-center justify-center rounded-full bg-primary py-4 text-lg font-semibold text-white shadow-lg transition-colors hover:bg-primary/90 active:scale-[0.99] active:bg-primary/90">
					Add to Cart
					<Icon icon="ph:shopping-cart-simple-bold" class="ml-2 size-5" />
				</button>
			{:else}
				<button
					onclick={() => goto('/shop/cart')}
					class="inline-flex w-full grow items-center justify-center rounded-full bg-emerald-600 py-4 text-lg font-semibold text-white shadow-lg transition-colors hover:bg-emerald-700 active:scale-[0.99] active:bg-emerald-800">
					Added to Cart - View Cart
					<Icon icon="ph:check-bold" class="ml-2 size-5" />
				</button>
			{/if}

			<!-- {#if product.stockQuantity > 0}
                <button
                    class="w-full rounded-full bg-amber-600 py-4 text-lg font-semibold text-white shadow-lg transition-colors hover:bg-amber-700 active:bg-amber-800">
                    <Icon icon="ph:shopping-cart-simple" class="mr-2 inline size-5" />
                    Add to Cart
                </button>
			{:else}
				<button
					disabled
					class="w-full cursor-not-allowed rounded-full bg-gray-400 py-4 text-lg font-semibold text-white shadow-lg">
					Out of Stock
				</button>
			{/if} -->
		</div>
	</div>
</div>
