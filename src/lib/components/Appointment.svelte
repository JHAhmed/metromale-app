<script>
	import Icon from '@iconify/svelte';

	let { appointment } = $props();

	const formatDate = (datetime) => {
		return new Intl.DateTimeFormat('en-IN', {
			weekday: 'short',
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric'
		}).format(new Date(datetime));
	};

	const statusColors = {
		pending: 'bg-yellow-100 text-yellow-800',
		confirmed: 'bg-green-100 text-green-800',
		cancelled: 'bg-red-100 text-red-800',
		completed: 'bg-blue-100 text-blue-800'
	};
</script>

<a
	href={`/appointments/${appointment.$id}`}
	class="block rounded-3xl bg-white p-6 shadow-lg/1 transition-transform hover:scale-[1.01] active:scale-99 active:shadow-lg/2">
	<div class="flex items-start justify-between">
		<div class="flex-1 space-y-3">

			<div class="flex items-center space-x-3">
				<Icon icon="ph:user" class="size-5 text-gray-500" />
				<span class="text-gray-800 font-semibold">{appointment.patientName}</span>
			</div>

			<div class="flex items-center space-x-3">
				<Icon icon="ph:calendar" class="size-5 text-gray-500" />
				<span class=" text-gray-700"
					>{formatDate(appointment.appointmentDatetime)}</span>
			</div>
			<div class="flex items-center space-x-3">
				<Icon icon="ph:map-pin" class="size-5 text-gray-500" />
				<span class="text-gray-700">{appointment.branch}</span>
			</div>

			{#if appointment.notes}
				<p class="text-sm text-gray-600 italic">
					{appointment.notes.slice(0, 100)}{appointment.notes.length > 100 ? '...' : ''}
				</p>
			{/if}
		</div>
		<div class="ml-4 flex flex-col items-end space-y-2">
			<span
				class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {statusColors[
					appointment.status
				]}">
				{appointment.status}
			</span>
			<Icon icon="ph:arrow-right" class="size-5 text-gray-400" />
		</div>
	</div>
</a>
