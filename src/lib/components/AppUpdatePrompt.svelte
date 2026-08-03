<script>
	let { update, onUpdate, onDismiss } = $props();
	let isOpening = $state(false);

	async function openStore() {
		if (!update?.storeUrl || isOpening) return;

		isOpening = true;
		try {
			await onUpdate(update.storeUrl);
		} finally {
			isOpening = false;
		}
	}
</script>

{#if update}
	<div class="fixed inset-x-4 bottom-24 z-50 mx-auto max-w-md rounded-2xl bg-white p-5 shadow-2xl ring-1 ring-gray-200" role="dialog" aria-modal="true" aria-labelledby="app-update-title">
		<h2 id="app-update-title" class="text-lg font-semibold text-gray-900">
			{update.required ? 'Update required' : 'A new version is available'}
		</h2>
		<p class="mt-2 text-sm leading-6 text-gray-600">
			Please update Metromale to continue using the latest improvements.
			{#if update.notes}
				{update.notes}
			{/if}
		</p>
		<div class="mt-4 flex gap-3">
			{#if update.storeUrl}
				<button
					type="button"
					onclick={openStore}
					disabled={isOpening}
					class="flex-1 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white disabled:opacity-60">
					{isOpening ? 'Opening store…' : 'Update now'}
				</button>
			{:else}
				<p class="flex-1 rounded-xl bg-amber-50 p-3 text-xs text-amber-800">
					The store link has not been configured yet.
				</p>
			{/if}
			{#if !update.required}
				<button
					type="button"
					onclick={onDismiss}
					class="rounded-full px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-100">
					Later
				</button>
			{/if}
		</div>
	</div>
{/if}
