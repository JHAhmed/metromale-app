<!-- src/routes/posts/[slug]/+page.svelte -->
<script>
	import Icon from '@iconify/svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	let { data } = $props();

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

	let mardkdownContent = $state('');

	onMount(async () => {
		const { marked } = await import('marked');
		mardkdownContent = marked.parse(data.post.content);
	});
</script>

<svelte:head>
	<title>{data.post.title}</title>
</svelte:head>

<div class="space-y-6 p-4 md:p-8">
	<!-- Back button -->
	<button
		class="mb-6 flex items-center space-x-2 text-gray-600 hover:text-gray-800"
		onclick={() => goto('/content')}>
		<Icon icon="ph:arrow-left-bold" class="size-5" />
		<span class="text-sm font-medium">Back to Content</span>
	</button>

	<article class="prose prose-sm max-w-none">
		<header class="space-y-4 my-8 bg-gray-200 p-4 px-6 rounded-2xl">
			<h1 class="text-2xl font-bold text-gray-800">{data.post.title}</h1>
			<p class="text-gray-600 text-sm">{data.post.description}</p>
			<div class="flex items-center space-x-4 text-sm text-gray-500">
				<Icon icon={iconMap[data.post.type].icon} class="size-4 {iconMap[data.post.type].color}" />
				<span>{data.post.type} • {new Date(data.post.$createdAt).toLocaleDateString('en-GB')}</span>
			</div>
		</header>

		{#if data.post.type === 'blog'}
			<div class="prose prose-sm px-2 prose-gray max-w-none prose-headings:text-primary prose-headings:leading-0">
				{@html mardkdownContent}
			</div>
		{:else if data.post.type === 'podcast' && data.post.youtubeUrl}
			<div class="rounded-2xl bg-white p-6 shadow-lg/1">
				<iframe
					title={data.post.title}
					src={data.post.youtubeUrl}
					width="100%"
					height="450"
					frameborder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowfullscreen
					class="rounded-xl"></iframe>
			</div>
		{:else}
			<div class="rounded-2xl bg-white p-6 text-center text-gray-600 shadow-lg/1">
				<Icon icon="ph:x-circle" class="mx-auto mb-4 size-12 text-gray-400" />
				<p>Content not available.</p>
			</div>
		{/if}
	</article>
</div>
