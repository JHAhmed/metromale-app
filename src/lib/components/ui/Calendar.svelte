<script>
	import { Calendar } from 'bits-ui';
	import { today, getLocalTimeZone } from '@internationalized/date';
	import Icon from '@iconify/svelte';

	let { value = $bindable() } = $props();

	const todayDate = today(getLocalTimeZone());
	const minValue = todayDate;
	const maxValue = todayDate.add({ months: 2 });
</script>

<Calendar.Root
	bind:value
	type="single"
	{minValue}
	{maxValue}
	weekdayFormat="short"
	class="w-full rounded-3xl border border-gray-100 bg-white p-5 shadow-sm select-none"
>
	{#snippet children({ months, weekdays })}
		<Calendar.Header class="mb-4 flex items-center justify-between">
			<Calendar.PrevButton
				class="inline-flex size-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
			>
				<Icon icon="ph:caret-left" class="size-5" />
			</Calendar.PrevButton>
			<Calendar.Heading class="text-base font-semibold text-gray-800" />
			<Calendar.NextButton
				class="inline-flex size-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
			>
				<Icon icon="ph:caret-right" class="size-5" />
			</Calendar.NextButton>
		</Calendar.Header>

		{#each months as month}
			<Calendar.Grid class="w-full border-collapse">
				<Calendar.GridHead>
					<Calendar.GridRow class="mb-2 flex w-full">
						{#each weekdays as day}
							<Calendar.HeadCell
								class="flex-1 text-center text-xs font-semibold text-gray-400"
							>
								{day}
							</Calendar.HeadCell>
						{/each}
					</Calendar.GridRow>
				</Calendar.GridHead>
				<Calendar.GridBody class="space-y-1">
					{#each month.weeks as weekDates}
						<Calendar.GridRow class="flex w-full">
							{#each weekDates as date}
								<Calendar.Cell
									{date}
									month={month.value}
									class="flex-1 p-0 text-center"
								>
									<Calendar.Day
										class="mx-auto flex size-9 items-center justify-center rounded-xl text-sm font-medium transition-all
										hover:bg-orange-50 hover:text-primary
										active:scale-95
										data-[selected]:bg-primary data-[selected]:text-white data-[selected]:font-bold
										data-[today]:border-2 data-[today]:border-primary data-[today]:text-primary
										data-[disabled]:opacity-30 data-[disabled]:pointer-events-none
										data-[outside-visible-months]:text-gray-300"
									/>
								</Calendar.Cell>
							{/each}
						</Calendar.GridRow>
					{/each}
				</Calendar.GridBody>
			</Calendar.Grid>
		{/each}
	{/snippet}
</Calendar.Root>
