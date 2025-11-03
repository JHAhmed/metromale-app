<script>
	import Icon from '@iconify/svelte';

	let {
		value = $bindable(),
		placeholder = 'Select Gender',
		options = ['Male', 'Female', 'Other'],
		required = true,
        error = '',
		label,
		icon
	} = $props();
</script>

{#if label}
	<label
		for={label ? label.toLowerCase().replace(/\s+/g, '-') : 'input'}
		class="mb-1 block text-sm font-medium text-gray-700">
		{label}
		{#if required}
			<span class="text-red-500">*</span>
		{/if}
	</label>
{/if}

<select
	bind:value
	class="w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-primary focus:ring-none focus:outline-none appearance-none"
	{required}>
	<option class="rounded-lg bg-gray-50 {value === "" ? 'opacity-0' : ''}" value="">{placeholder}</option>
	{#each options as option}
		<option class="rounded-lg bg-gray-50" value={option.toLowerCase().replace(/\s+/g, '-')}
			>{option}</option>
	{/each}
</select>

{#if error}
    <p class="mt-1 text-xs text-red-500">{error}</p>
{/if}

<style>
	select {
		/* For standard browsers */
		appearance: none;
		/* For Safari, Chrome, and Opera */
		-webkit-appearance: none;
		/* For Firefox */
		-moz-appearance: none;
	}

	/* For Internet Explorer 10+ */
	select::-ms-expand {
		display: none;
	}
</style>
