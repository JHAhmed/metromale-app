<!-- src/routes/posts/+page.svelte -->
<script>
	import Icon from '@iconify/svelte';

	let { data } = $props();
</script>

<div class="space-y-6 p-4 md:p-8">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-semibold text-gray-800">Content Hub</h1>
	</div>

	{#if data.posts.length === 0}
		<div class="py-12 text-center">
			<Icon icon="ph:article" class="mx-auto mb-4 size-12 text-gray-400" />
			<p class="text-gray-600">No content available yet.</p>
		</div>
	{:else}
		<div class="grid gap-4 md:grid-cols-2">
			{#each data.posts as post (post.$id)}
				<a
					href={`/content/${post.slug}`}
					class="block rounded-3xl bg-white p-6 shadow-lg/1 transition-transform hover:scale-[1.02] focus:ring-2 focus:ring-primary focus:outline-none">
					<div class="flex items-start space-x-4">
						<Icon
							icon={post.type === 'blog' ? 'ph:article' : 'ph:headphones'}
							class="size-8 {post.type === 'blog'
								? 'text-emerald-500'
								: 'text-primary'} mt-1 flex-shrink-0" />
						<div class="min-w-0 flex-1">
							<h2 class="mb-1 truncate font-semibold text-gray-800">{post.title}</h2>
							<p class="mb-2 text-sm text-gray-600">{post.description}</p>
							<p class="text-xs text-gray-500">Type: {post.type}</p>
						</div>
					</div>
				</a>
			{/each}
		</div>
	{/if}
</div>
