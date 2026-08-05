<script>
	import Icon from '@iconify/svelte';
	import { getFile } from '$lib/utils/getFile.js';

	let { post, onClose = () => {} } = $props();
	let thumbnailUrl = $state('');

	function openYoutube() {
		if (post?.youtubeUrl && typeof window !== 'undefined') {
			window.open(post.youtubeUrl, '_blank', 'noopener,noreferrer');
		}
	}

	$effect(() => {
		const thumbnailId = post?.thumbnail;
		let cancelled = false;

		thumbnailUrl = '';
		if (!thumbnailId) return;

		getFile(thumbnailId)
			.then((url) => {
				if (!cancelled) thumbnailUrl = url.toString();
			})
			.catch((error) => {
				if (!cancelled) console.error('Error loading alert thumbnail:', error);
			});

		return () => {
			cancelled = true;
		};
	});
</script>

{#if post}
	<div
		class="fixed inset-0 z-100 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
		role="presentation"
		onclick={(event) => event.target === event.currentTarget && onClose()}>
		<div
			class="relative max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-3xl bg-white shadow-2xl"
			role="dialog"
			aria-modal="true"
			aria-labelledby="alert-post-title">
			<button
				type="button"
				aria-label="Close alert"
				onclick={onClose}
				class="absolute top-4 right-4 z-10 rounded-full bg-white/90 p-2 text-gray-500 shadow-sm transition-colors hover:text-gray-900">
				<Icon icon="ph:x" class="size-5" />
			</button>

			{#if thumbnailUrl}
				<img
					src={thumbnailUrl}
					alt=""
					class="w-full object-cover"
					onerror={() => (thumbnailUrl = '')} />
			{/if}

			<!-- <div class="flex items-center gap-2 text-sm font-medium text-primary">
				<Icon icon="ph:megaphone-simple" class="size-5" />
				<span>Important update</span>
				</div> -->

			{#if post.title && post.description}
				<div class="space-y-2 p-6">
					<h2 id="alert-post-title" class="pr-8 text-2xl leading-tight font-bold text-gray-900">
						{post.title}
					</h2>

					{#if post.description}
						<p class="leading-relaxed whitespace-pre-line text-gray-600">{post.description}</p>
					{/if}

					{#if post.youtubeUrl}
						<button
							type="button"
							onclick={openYoutube}
							class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 font-semibold text-white transition-colors hover:bg-primary/90">
							<Icon icon="ph:youtube-logo" class="size-5" />
							Watch Now
						</button>
					{/if}
				</div>
			{/if}
		</div>
	</div>
{/if}
