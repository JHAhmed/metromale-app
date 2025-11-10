<script>
	import { ContentTypes } from '$lib/enums.js';
	import Icon from '@iconify/svelte';

	let { data } = $props();
	let contentType = $state('all');
	const iconMap = {
		blog: {
			icon: 'ph:article',
			color: 'text-emerald-500'
		},
		podcast: {
			icon: 'ph:headphones',
			color: 'text-primary'
		},
		video: {
			icon: 'ph:video-camera',
			color: 'text-red-500'
		}
	};

	let filteredPosts = $derived.by(() => {
		if (contentType === ContentTypes.ALL) {
			return data.posts;
		}
		return data.posts.filter((post) => post.type === contentType);
	});
</script>

<div class="space-y-6 p-4 md:p-8">
	<!-- <div class="flex items-center justify-between">
		<h1 class="text-2xl font-semibold text-gray-800">Content Hub</h1>
	</div> -->

	<div class="flex w-full items-center justify-between">

		<h1 class="text-2xl font-semibold text-gray-800">Content</h1>

		<div class="flex items-center space-x-1 rounded-lg bg-gray-50">
			<!-- View Toggle Buttons -->
			<button
				class="rounded-lg p-2 hover:bg-gray-200 active:bg-gray-200 {contentType === ContentTypes.ALL
					? 'bg-white shadow-sm/5'
					: ''}"
				onclick={() => (contentType = ContentTypes.ALL)}
				aria-label="Show All Content">
				<Icon icon="ph:list" class="size-5 text-gray-700" />
			</button>
			<button
				class="rounded-lg p-2 hover:bg-gray-200 active:bg-gray-200 {contentType === ContentTypes.VIDEO
					? 'bg-white shadow-sm/5'
					: ''}"
				onclick={() => (contentType = ContentTypes.VIDEO)}
				aria-label="Filter Videos">
				<Icon icon="ph:video-camera" class="size-5 text-gray-700" />
			</button>
			<button
				class="rounded-lg p-2 hover:bg-gray-200 active:bg-gray-200 {contentType === ContentTypes.BLOG	
					? 'bg-white shadow-sm/5'
					: ''}"
				onclick={() => (contentType = ContentTypes.BLOG)}
				aria-label="Filter Blogs">
				<Icon icon="ph:article" class="size-5 text-gray-700" />
			</button>
			<button
				class="rounded-lg p-2 hover:bg-gray-200 active:bg-gray-200 {contentType === ContentTypes.PODCAST	
					? 'bg-white shadow-sm/5'
					: ''}"
				onclick={() => (contentType = ContentTypes.PODCAST)}
				aria-label="Filter Podcasts">
				<Icon icon="ph:headphones" class="size-5 text-gray-700" />
			</button>
		</div>

		<!-- <button
			class="rounded-lg bg-white p-1 shadow-sm/5 hover:bg-gray-200 active:bg-gray-200"
			onclick={() => (showUpcomingOrders = !showUpcomingOrders)}
			aria-label="Show/Hide Upcoming Orders">
			<Icon
				icon={showUpcomingOrders ? 'ph:caret-up-bold' : 'ph:caret-down-bold'}
				class="size-6 text-gray-700" />
		</button> -->
	</div>

	{#if filteredPosts.length === 0}
		<div class="py-12 text-center">
			<Icon icon="ph:article" class="mx-auto mb-4 size-12 text-gray-400" />
			<p class="text-gray-600">No content available yet.</p>
		</div>
	{:else}
		<div class="grid gap-4 md:grid-cols-2">

			{#each filteredPosts as post (post.$id)}
				<a
					href={post.type === 'video' ? post.youtubeUrl : `/content/${post.slug}`}
					class="block rounded-3xl bg-white p-6 shadow-lg/1 transition-transform hover:scale-[1.02] focus:ring-2 focus:ring-primary focus:outline-none">
					<div class="flex items-start justify-center space-x-4">
						<Icon icon={iconMap[post.type].icon} class="size-8 {iconMap[post.type].color}" />
						<div class="my-auto min-w-0 flex-1">
							<h2 class="mb-1 font-semibold text-gray-800">{post.title}</h2>
							{#if post.description}
								<p class="mb-2 text-sm text-gray-600">{post.description}</p>
							{/if}
						</div>
					</div>
				</a>
			{/each}
		</div>
	{/if}
</div>
