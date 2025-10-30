<script>
	import Icon from '@iconify/svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	const { product: slug } = page.params;

    let product = {
		title: 'Male Fertility Supplements',
		price: '1999',
		description:
			'Premium blend of vitamins, minerals, and herbal extracts designed to support male reproductive health. Clinically studied ingredients to improve sperm quality and motility.',
		imageUrl:
			'https://img.freepik.com/free-photo/medicines-healthcare-accessories-arranged-blue-surface_23-2148213988.jpg?semt=ais_hybrid&w=740&q=80',
		benefits: [
			'Boosts sperm count by up to 30%',
			'Enhances energy and vitality',
			'Supports hormonal balance'
		],
		ingredients: ['Zinc', 'Selenium', 'L-Carnitine', 'CoQ10', 'Folic Acid'],
		usage: 'Take 2 capsules daily with meals. Consult your doctor before starting.'
		// reviews: 4.8,
		// stockQuantity: 50
	};

	if (slug !== 'male-fertility-supplements') {
		console.warn('Product not found for slug:', slug);
	}
</script>

<div class="space-y-6 p-4 md:p-8">
	<!-- Back button -->
	<button
		class="mb-4 flex items-center space-x-2 text-gray-600 hover:text-gray-800"
		onclick={() => goto('/shop')}>
		<Icon icon="ph:arrow-left-bold" class="size-5" />
		<span class="text-sm font-medium">Back to Shop</span>
	</button>

	<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">


			<div class="rounded-3xl bg-gray-100">
				<img
					src={product.imageUrl}
					alt={product.title}
					class="aspect-square w-full rounded-2xl object-cover lg:aspect-[4/3]" />
			</div>

        <!-- <div class="space-y-4">
			<div class="rounded-3xl bg-gray-100 p-4">
				<img
					src={product.imageUrl}
					alt={product.title}
					class="aspect-square w-full rounded-2xl object-cover lg:aspect-[4/3]" />
			</div>
			{#if product.stockQuantity}
                {#if product.stockQuantity > 0}
				<div class="flex items-center space-x-2 text-sm text-emerald-600">
					<Icon icon="ph:check-circle-fill" class="size-4" />
					<span>In stockQuantity ({product.stockQuantity} available)</span>
				</div>
			    {:else}
				<div class="flex items-center space-x-2 text-sm text-red-600">
					<Icon icon="ph:x-circle-fill" class="size-4" />
					<span>Out of stock</span>
				</div>
                {/if}
			{/if}
		</div> -->

		<!-- Product Details -->
		<div class="space-y-6">
			<div>
				<h1 class="mb-2 text-3xl font-bold text-gray-800">{product.title}</h1>
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

			<!-- Ingredients -->
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

			<!-- Usage -->
			<div class="rounded-2xl bg-gray-50 p-4">
				<h3 class="mb-2 font-semibold text-gray-800">How to Use</h3>
				<p class="text-sm text-gray-600">{product.usage}</p>
			</div>

            <button
                class="w-full rounded-full bg-primary py-4 text-lg font-semibold text-white shadow-lg transition-colors hover:bg-primary/90 active:bg-primary/90 active:scale-[0.99]">
                <Icon icon="ph:shopping-cart-simple" class="mr-2 inline size-5" />
                Add to Cart
            </button>

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
