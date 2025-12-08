<!-- routes/appointments/[slug]/+page.svelte -->
<script>
	import Icon from '@iconify/svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let { data } = $props();

	const { appointment } = data;

	const statusColors = {
		pending: 'bg-yellow-100 text-yellow-800',
		confirmed: 'bg-green-100 text-green-800',
		cancelled: 'bg-red-100 text-red-800',
		completed: 'bg-blue-100 text-blue-800'
	};

	const typeIcons = {
		consultation: 'ph:stethoscope'
	};

	const formatDateTime = (datetime) => {
		return new Intl.DateTimeFormat('en-IN', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		}).format(new Date(datetime));
	};
</script>

<svelte:head>
	<title>Appointment #{appointment.id}</title>
</svelte:head>

<div class="space-y-6 p-4 md:p-8">
	<!-- Back button -->
	<button
		class="mb-6 flex items-center space-x-2 text-gray-600 hover:text-gray-800"
		onclick={() => goto('/appointments')}>
		<Icon icon="ph:arrow-left-bold" class="size-5" />
		<span class="text-sm font-medium">Back to Appointments</span>
	</button>

	<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
		<!-- Payment Status -->
		{#if appointment.status === 'pending'}
			<div
				class="flex w-full items-center justify-between rounded-xl border border-dashed border-gray-300 bg-gray-100 p-4">
				<div class="flex w-full items-center space-x-3">
					<!-- <Icon icon="ph:clock" class="size-5 text-yellow-600" /> -->
					<span class="font-medium text-gray-800 capitalize"
						>Please pay to confirm your appointment!</span>

					{#if appointment.status === 'pending'}
						<div class="ml-auto flex gap-2">
							<a class="" href="https://api.wurks.studio/metromale?amount=20000">
								<button
									class="hover:bg-primary-dark focus:ring-none ml-2 rounded-lg bg-primary px-5 py-3 text-white focus:outline-none active:scale-99 active:opacity-95">
									Pay Now
								</button>
							</a>

							<button
								class="hover:bg-primary-dark focus:ring-none ml-2 rounded-lg bg-primary px-5 py-3 text-white focus:outline-none active:scale-99 active:opacity-95">
								Refresh
							</button>
						</div>
					{/if}
				</div>
			</div>
		{/if}

		<!-- Main Details -->
		<div class="space-y-4">
			<div class="rounded-3xl bg-white p-6 shadow-lg/1">
				<h1 class="mb-4 text-2xl font-bold text-gray-800">Appointment Details</h1>
				<div class="space-y-3">
					<div class="flex items-center space-x-3">
						<Icon icon="ph:calendar" class="size-5 text-gray-500" />
						<span class="text-sm text-gray-600"
							>{formatDateTime(appointment.appointmentDatetime)}</span>
					</div>
					<div class="flex items-center space-x-3">
						<Icon icon="ph:clock" class="size-5 text-gray-500" />
						<span class="text-sm text-gray-600">{appointment.appointmentSlot}</span>
					</div>
					<div class="flex items-center space-x-3">
						<Icon
							icon={typeIcons[appointment.appointmentType] || 'ph:question'}
							class="size-5 text-gray-500" />
						<span class="text-sm text-gray-600 capitalize">{appointment.appointmentType}</span>
					</div>
					<div class="flex items-center space-x-3">
						<Icon icon="ph:map-pin" class="size-5 text-gray-500" />
						<span class="text-sm text-gray-600">{appointment.branch}</span>
					</div>
					<div class="flex items-center space-x-3">
						<Icon icon="ph:info" class="size-5 text-gray-500" />
						<span class="text-sm font-medium text-gray-800">Status:</span>
						<span
							class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {statusColors[
								appointment.status
							]}">
							{appointment.status}
						</span>
					</div>
				</div>
			</div>

			{#if appointment.notes}
				<div class="rounded-3xl bg-white p-6 shadow-lg/1">
					<h2 class="mb-3 text-lg font-semibold text-gray-800">Notes</h2>
					<p class="whitespace-pre-wrap text-gray-600">{appointment.notes}</p>
				</div>
			{/if}
		</div>

		<!-- Patient Details -->
		<div class="space-y-4">
			<div class="rounded-3xl bg-white p-6 shadow-lg/1">
				<h2 class="mb-4 text-lg font-semibold text-gray-800">Patient Information</h2>
				<div class="space-y-2 text-sm">
					<div><span class="font-medium text-gray-700">Name:</span> {appointment.patientName}</div>
					<div>
						<span class="font-medium text-gray-700">Age:</span>
						{appointment.patientAge} years
					</div>
					<div>
						<span class="font-medium text-gray-700">Gender:</span>
						{appointment.patientGender}
					</div>
					{#if appointment.patientPhone}
						<div>
							<span class="font-medium text-gray-700">Phone:</span>
							{appointment.patientPhone}
						</div>
					{/if}
					{#if appointment.patientEmail}
						<div>
							<span class="font-medium text-gray-700">Email:</span>
							{appointment.patientEmail}
						</div>
					{/if}
				</div>
			</div>

			<!-- Guardian Details (if present) -->
			{#if appointment.guardianName}
				<div class="rounded-3xl bg-white p-6 shadow-lg/1">
					<h2 class="mb-4 text-lg font-semibold text-gray-800">Guardian Information</h2>
					<div class="space-y-2 text-sm">
						<div>
							<span class="font-medium text-gray-700">Name:</span>
							{appointment.guardianName}
						</div>
						{#if appointment.guardianAge}
							<div>
								<span class="font-medium text-gray-700">Age:</span>
								{appointment.guardianAge} years
							</div>
						{/if}
						{#if appointment.guardianRelation}
							<div>
								<span class="font-medium text-gray-700">Relation:</span>
								{appointment.guardianRelation}
							</div>
						{/if}
						{#if appointment.guardianPhone}
							<div>
								<span class="font-medium text-gray-700">Phone:</span>
								{appointment.guardianPhone}
							</div>
						{/if}
						{#if appointment.guardianEmail}
							<div>
								<span class="font-medium text-gray-700">Email:</span>
								{appointment.guardianEmail}
							</div>
						{/if}
					</div>
				</div>
			{/if}

			<div class="flex space-x-2">
				<button
					class="hover:bg-primary-dark focus:ring-none w-full rounded-lg bg-primary px-5 py-3 text-white focus:outline-none active:scale-99 active:opacity-95"
					onclick={() => goto(`/appointments/${appointment.$id}/edit`)}>
					Edit Appointment
				</button>

				<button
					class="hover:bg-primary-dark focus:ring-none w-full rounded-lg bg-gray-300 px-5 py-3 text-black focus:outline-none active:scale-99 active:opacity-95"
					onclick={() => goto(`/appointments/${appointment.$id}/edit`)}>
					Reschedule
				</button>
			</div>
		</div>
	</div>
</div>
