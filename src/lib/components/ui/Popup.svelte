<script>
	import { scale } from 'svelte/transition';
	let { closeDialog = () => {}, children } = $props();
</script>

<dialog
	onclick={closeDialog}
	class="fixed inset-0 z-100 flex h-screen w-screen items-center justify-center bg-black/40 backdrop-blur-sm">
	<div
		transition:scale={{ duration: 200, start: 0.5 }}
		class="relative mx-8 flex w-full max-w-md flex-col items-center justify-center gap-2 rounded-2xl border-4 border-black bg-white p-6">
		{@render children?.()}
	</div>
</dialog>