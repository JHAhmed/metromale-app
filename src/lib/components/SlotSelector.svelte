<!-- $lib/components/SlotSelector.svelte -->
<script>
	import Icon from '@iconify/svelte';

	let { selectedSlot = $bindable(), slots } = $props();
</script>

<div class="space-y-4">
	<div class="rounded-3xl bg-white p-6 shadow-lg/1">
		<h2 class="flex items-center space-x-2 text-lg font-semibold text-gray-800 mb-4">
			<Icon icon="ph:clock" class="size-5" />
			<span>Select Time Slot</span>
		</h2>
		<div class="grid grid-cols-2 md:grid-cols-3 gap-3">
			{#each slots as slot}
				<label class="flex items-center justify-center space-x-2 p-3 rounded-xl border-2 {selectedSlot === slot
					? 'border-amber-500 bg-amber-50'
					: 'border-gray-200 hover:border-gray-300'} cursor-pointer">
					<input
						type="radio"
						bind:group={selectedSlot}
						value={slot}
						class="sr-only"
						required
					/>
					<Icon icon="ph:radio-button" class="size-4 text-gray-400 {selectedSlot === slot
						? 'text-amber-500'
						: ''}" />
					<span class="text-sm font-medium text-gray-700">{slot}</span>
				</label>
			{/each}
		</div>
	</div>
</div>