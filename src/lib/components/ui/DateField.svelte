<script>
	import { DateField } from 'bits-ui';
	import { today, getLocalTimeZone } from '@internationalized/date';

	let { value = $bindable() } = $props();

	const todayDate = today(getLocalTimeZone());
	const minValue = todayDate.subtract({ days: 1 });
	const maxValue = todayDate.add({ months: 2 });

    let valid = $derived.by(() => {
        return value >= minValue && value <= maxValue;
    });

    // let invalid = $derived(!valid);
    // {invalid ? 'border-red-500' : (valid ? 'border-primary bg-amber-50' : 'border-gray-200 bg-white')}
</script>

<DateField.Root locale="en-GB" {minValue} {maxValue} bind:value>
	<div class="w-full">
		<DateField.Input
			class="relative flex w-full items-center rounded-xl border-2   p-4 {valid ? 'border-primary bg-amber-50' : 'border-gray-200 bg-white'} text-black transition-all duration-300 ease-in-out select-none placeholder:text-primary/80 {valid ? 'focus-within:bg-amber-50/50' : 'focus-within:bg-gray-50/50'}">
			{#snippet children({ segments })}
				{#each segments as { part, value }, i (part + i)}
					<div class="inline-block select-none">
						<DateField.Segment
							{part}
							class="rounded px-2 py-1 invalid:text-red-500 hover:bg-black/5 focus:bg-black/5 focus:text-black focus-visible:ring-0! focus-visible:ring-offset-0!  aria-[valuetext=Empty]:text-black/50">
							{value}
						</DateField.Segment>
					</div>
				{/each}
			{/snippet}
		</DateField.Input>
	</div>
</DateField.Root>
