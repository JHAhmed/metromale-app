<script>
	import Icon from '@iconify/svelte';

	let {
		value = $bindable(),
		type = 'text',
		placeholder = 'Text',
		min = 0,
		max = 100,
		maxlength = 50,
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

<div class="relative rounded-md">
	<input
		bind:value
		{placeholder}
		{type}
		{min}
		{max}
		{maxlength}
		{required}
		name={label ? label.toLowerCase().replace(/\s+/g, '-') : 'input'}
		class="w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-primary focus:ring-0 focus:outline-none" />

	{#if icon}
		<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
			<Icon {icon} class="h-5 w-fit text-gray-400" />
		</div>
	{/if}

	{#if error}
		<p class="mt-1 text-xs text-red-500">{error}</p>
	{/if}
</div>

<style>
	input[type='number']::-webkit-inner-spin-button,
	input[type='number']::-webkit-outer-spin-button {
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		margin: 0;
	}
</style>
