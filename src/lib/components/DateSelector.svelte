<script>
	import Icon from '@iconify/svelte';
	import DateField from './ui/DateField.svelte';

	let { selectedDateValue = $bindable() } = $props();
</script>

<div class="space-y-4">
	<div class="rounded-3xl bg-white p-6 shadow-lg/1">
		<h2 class="flex items-center space-x-2 text-lg font-semibold text-gray-800 mb-4">
			<Icon icon="ph:calendar" class="size-5" />
			<span>Select Date</span>
		</h2>

        <DateField bind:value={selectedDateValue} />

		<!-- <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
			{#each slots as slot}
				<label class="flex items-center justify-center space-x-2 p-3 rounded-xl border-2 {selectedDate === slot
					? 'border-amber-500 bg-amber-50'
					: 'border-gray-200 hover:border-gray-300'} cursor-pointer">
					<input
						type="radio"
						bind:group={selectedDate}
						value={slot}
						class="sr-only"
						required
					/>
					<Icon icon="ph:radio-button" class="size-4 text-gray-400 {selectedDate === slot
						? 'text-amber-500'
						: ''}" />
					<span class="text-sm font-medium text-gray-700">{slot}</span>
				</label>
			{/each}
		</div> -->
	</div>
</div>