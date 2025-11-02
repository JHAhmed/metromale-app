<script>
	import Icon from '@iconify/svelte';
	import { blur, fade, slide } from 'svelte/transition';

	let {
		items = [],
		autoPlay = false,
		interval = 3000,
		showIndicators = true,
		showNav = true
	} = $props();

	let currentIndex = $state(0);
	let timer;

	$effect(() => {
		if (autoPlay && items.length > 1) {
			clearTimeout(timer);
			timer = setTimeout(() => {
				currentIndex = (currentIndex + 1) % items.length;
			}, interval);
		}

		return () => clearTimeout(timer);
	});

	$effect(() => {
		if (items.length === 0) {
			currentIndex = 0;
		}
	});

	function next() {
		currentIndex = (currentIndex + 1) % items.length;
	}

	function prev() {
		currentIndex = (currentIndex - 1 + items.length) % items.length;
	}

	function goTo(index) {
		currentIndex = index;
	}
</script>

<div class="relative w-full overflow-hidden rounded-2xl">
	{#if items.length > 0}
		<div class="relative h-64 md:h-80">
			{#each items as item, i}
				{#if i === currentIndex}
					<div
						class="absolute inset-0 h-full w-full"
						transition:blur|local={{ duration: 300, axis: 'X' }}>
						<img src={item.imageUrl} alt={item.alt || ''} class="h-full w-full object-cover" />
						{#if item.caption}
							<div class="absolute right-4 bottom-4 left-4 rounded-lg bg-black/50 p-2 text-white">
								<p class="text-sm">{item.caption}</p>
							</div>
						{/if}
					</div>
				{/if}
			{/each}
		</div>

		{#if showNav && items.length > 1}
			<button
				class="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg transition-all hover:bg-white"
				onclick={prev}
				aria-label="Previous">
				<Icon icon="ph:arrow-left" class="size-5 text-gray-700" />
			</button>
			<button
				class="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg transition-all hover:bg-white"
				onclick={next}
				aria-label="Next">
				<Icon icon="ph:arrow-right" class="size-5 text-gray-700" />
			</button>
		{/if}

		{#if showIndicators && items.length > 1}
			<div class="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2">
				{#each items as _, i}
					<button
						class="h-2 w-2 rounded-full {i === currentIndex
							? 'bg-white'
							: 'bg-white/50'} transition-colors hover:bg-white"
						onclick={() => goTo(i)}
						aria-label={`Go to slide ${i + 1}`} />
				{/each}
			</div>
		{/if}
	{:else}
		<div class="flex h-64 items-center justify-center rounded-2xl bg-gray-200 md:h-80">
			<p class="text-gray-500">No images to display</p>
		</div>
	{/if}
</div>
