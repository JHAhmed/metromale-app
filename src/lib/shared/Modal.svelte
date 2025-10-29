<script>
	let {
		text = 'Redirecting you to login page...',
		description = 'Please do not close or refresh the page'
	} = $props();
</script>

<dialog class="fixed inset-0 z-100 flex items-center justify-center bg-black/20 backdrop-blur-sm">
	<div
		class="mx-8 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-black bg-white p-6 lg:w-1/4"
	>
		<div
			class="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"
		></div>

		<p class="mt-4 text-center text-sm font-medium md:text-base">{text}</p>

		{#if description}
			<p class="text-center text-xs text-gray-600 md:text-sm">
				{description}
			</p>
		{/if}
	</div>
</dialog>
