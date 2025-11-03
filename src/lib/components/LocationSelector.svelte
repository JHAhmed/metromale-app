<!-- $lib/components/LocationSelector.svelte -->
<script>
	import Icon from '@iconify/svelte';

	let { selectedLocation = $bindable(), locations } = $props();

	const locationOptions = Object.keys(locations);
</script>

<div class="space-y-4">
	<div class="rounded-3xl bg-white p-6 shadow-lg/1">
		<h2 class="flex items-center space-x-2 text-lg font-semibold text-gray-800 mb-4">
			<Icon icon="ph:map-pin" class="size-5" />
			<span>Select Location</span>
		</h2>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-3">
			{#each locationOptions as loc}
				<label class="flex items-center space-x-3 p-3 rounded-xl border-2 {selectedLocation === loc
					? 'border-amber-500 bg-amber-50'
					: 'border-gray-200 hover:border-gray-300'} cursor-pointer">
					<input
						type="radio"
						bind:group={selectedLocation}
						value={loc}
						class="sr-only"
						required
					/>
					<Icon icon="ph:radio-button" class="size-5 text-gray-400 {selectedLocation === loc
						? 'text-amber-500'
						: ''}" />
					<span class="font-medium text-gray-700">{loc}</span>
				</label>
			{/each}
		</div>
	</div>
</div>