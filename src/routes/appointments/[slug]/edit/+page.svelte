<!-- routes/appointments/[slug]/edit/+page.svelte -->
<script>
	import { z } from 'zod';
	import { goto } from '$app/navigation';
	import { slide } from 'svelte/transition';
	import { toast, Toaster } from 'svelte-sonner';
	import { CalendarDate, parseDate, getLocalTimeZone } from '@internationalized/date';

	import { user } from '$lib/stores/auth.svelte';
	import { updateAppointment } from '$lib/tables/appointments';

	import Icon from '@iconify/svelte';
	import SlotSelector from '$lib/components/SlotSelector.svelte';
	import DateSelector from '$lib/components/DateSelector.svelte';
	import LocationSelector from '$lib/components/LocationSelector.svelte';

	let { data } = $props();
	const { appointment } = data;

	// Parse existing date to CalendarDate format
	function parseExistingDate(dateString) {
		if (!dateString) return undefined;
		try {
			const date = new Date(dateString);
			return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
		} catch {
			return undefined;
		}
	}

	let bookingForSelf = $state(!appointment.guardianName);
	let selectedLocation = $state(appointment.branch || '');
	let selectedSlot = $state(appointment.appointmentSlot || '');
	let selectedDateValue = $state(parseExistingDate(appointment.appointmentDatetime));
	let isSubmitting = $state(false);

	let selectedDate = $derived.by(() => {
		if (selectedDateValue) {
			return selectedDateValue.toDate(getLocalTimeZone());
		}
		return null;
	});

	let patient = $state({
		name: appointment.patientName || '',
		age: appointment.patientAge || '',
		gender: appointment.patientGender || '',
		phone: appointment.patientPhone || '',
		email: appointment.patientEmail || ''
	});

	let guardian = $state({
		name: appointment.guardianName || '',
		age: appointment.guardianAge || '',
		phone: appointment.guardianPhone || '',
		email: appointment.guardianEmail || '',
		relation: appointment.guardianRelation || '',
		otherRelation: ''
	});

	let errors = $state({});

	let buttonEnabled = $derived.by(() => {
		return (
			selectedLocation &&
			selectedSlot &&
			patient.name &&
			patient.age &&
			patient.gender &&
			!isSubmitting
		);
	});

	const locations = $state({
		OMR: ['2:00 PM - 3:00 PM'],
		Seliyur: ['2:30 PM - 4:30 PM'],
		'T Nagar': ['11:00 AM - 1:00 PM', '5:30 PM - 7:00 PM']
	});

	$effect(() => {
		if (selectedLocation && !locations[selectedLocation].includes(selectedSlot)) {
			selectedSlot = '';
		}
	});

	function getFirstError(obj) {
		if (obj._errors && obj._errors.length > 0) {
			return obj._errors[0];
		}
		for (const key in obj) {
			if (key !== '_errors' && typeof obj[key] === 'object') {
				const error = getFirstError(obj[key]);
				if (error) return error;
			}
		}
		return null;
	}

	const patientSchema = (bookingForSelf) =>
		z.object({
			name: z.string().min(1, 'Patient name is required'),
			age: z.number().min(1, 'Patient age is required'),
			gender: z.string().min(1, 'Patient gender is required'),
			phone: bookingForSelf
				? z.string().min(10, 'Patient phone must be at least 10 digits')
				: z.string(),
			email: bookingForSelf ? z.string().email('Patient email is invalid') : z.string()
		});

	const guardianSchema = z
		.object({
			name: z.string().min(1, 'Guardian name is required'),
			age: z.number().min(1, 'Guardian age is required'),
			phone: z.string().min(10, 'Guardian phone must be at least 10 digits'),
			email: z.string().email('Guardian email is invalid'),
			relation: z.string().min(1, 'Guardian relation is required'),
			otherRelation: z.string().optional()
		})
		.superRefine((data, ctx) => {
			if (data.relation === 'Other' && !data.otherRelation?.trim()) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					path: ['otherRelation'],
					message: 'Please specify the relation'
				});
			}
		});

	const bookingForSelfSchema = z.object({
		bookingForSelf: z.literal(true),
		selectedLocation: z.string().min(1, 'Please select a location'),
		selectedSlot: z.string().min(1, 'Please select a time slot'),
		selectedDate: z.date(),
		patient: patientSchema(true),
		guardian: z.object({}).passthrough().optional()
	});

	const bookingForOtherSchema = z.object({
		bookingForSelf: z.literal(false),
		selectedLocation: z.string().min(1, 'Please select a location'),
		selectedSlot: z.string().min(1, 'Please select a time slot'),
		selectedDate: z.date(),
		patient: patientSchema(false),
		guardian: guardianSchema
	});

	const bookingSchema = z.discriminatedUnion('bookingForSelf', [
		bookingForSelfSchema,
		bookingForOtherSchema
	]);

	async function handleSubmit(e) {
		e.preventDefault();
		isSubmitting = true;

		errors = {};
		const formData = {
			bookingForSelf,
			selectedLocation,
			selectedSlot,
			selectedDate,
			patient,
			guardian
		};

		const result = bookingSchema.safeParse(formData);
		if (!result.success) {
			const toastMessage =
				getFirstError(result.error.format()) || 'Please enter all required fields!';
			toast.error(toastMessage.trim());
			isSubmitting = false;
			return;
		}

		try {
			const updatedData = {
				appointmentSlot: selectedSlot,
				appointmentDatetime: selectedDate.toLocaleDateString('en-US'),
				branch: selectedLocation,
				patientName: patient.name,
				patientAge: patient.age,
				patientGender: patient.gender,
				patientPhone: patient.phone,
				patientEmail: patient.email,
				guardianName: bookingForSelf ? null : guardian.name,
				guardianAge: bookingForSelf ? null : guardian.age,
				guardianPhone: bookingForSelf ? null : guardian.phone,
				guardianEmail: bookingForSelf ? null : guardian.email,
				guardianRelation: bookingForSelf ? null : guardian.relation
			};

			const updated = await updateAppointment(appointment.$id, updatedData);

			if (updated) {
				toast.success('Appointment updated successfully!');
				goto(`/appointments/${appointment.$id}`);
			} else {
				toast.error('Failed to update appointment. Please try again.');
			}
		} catch (error) {
			console.error('Update Error:', error);
			toast.error(error.message || 'An error occurred while updating.');
		} finally {
			isSubmitting = false;
		}
	}
</script>

<Toaster richColors />

<div class="space-y-6 p-4 md:p-8">
	<!-- Back button -->
	<button
		class="mb-2 flex items-center space-x-2 text-gray-600 hover:text-gray-800"
		onclick={() => goto(`/appointments/${appointment.$id}`)}>
		<Icon icon="ph:arrow-left-bold" class="size-5" />
		<span class="text-sm font-medium">Back to Appointment</span>
	</button>

	<h1 class="text-2xl font-semibold text-gray-800">Edit Appointment</h1>

	<form onsubmit={handleSubmit} class="space-y-6">
		<!-- Patient Details (Simplified for edit) -->
		<div class="space-y-4">
			<div class="rounded-3xl bg-white p-6 shadow-lg/1">
				<h2 class="mb-4 flex items-center space-x-2 text-lg font-semibold text-gray-800">
					<Icon icon="ph:user" class="size-5" />
					<span>Patient Details</span>
				</h2>

				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div>
						<label class="mb-1 block text-sm font-medium text-gray-700">Full Name *</label>
						<input
							type="text"
							bind:value={patient.name}
							placeholder="Enter full name"
							class="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none" />
					</div>
					<div>
						<label class="mb-1 block text-sm font-medium text-gray-700">Age *</label>
						<input
							type="number"
							bind:value={patient.age}
							placeholder="Enter age"
							class="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none" />
					</div>
					<div>
						<label class="mb-1 block text-sm font-medium text-gray-700">Gender *</label>
						<select
							bind:value={patient.gender}
							class="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none">
							<option value="">Select Gender</option>
							<option value="Male">Male</option>
							<option value="Female">Female</option>
							<option value="Other">Other</option>
						</select>
					</div>
					<div>
						<label class="mb-1 block text-sm font-medium text-gray-700"
							>Phone {bookingForSelf ? '*' : ''}</label>
						<input
							type="tel"
							bind:value={patient.phone}
							placeholder="e.g., +91 12345 67890"
							class="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none" />
					</div>
					<div class="md:col-span-2">
						<label class="mb-1 block text-sm font-medium text-gray-700"
							>Email {bookingForSelf ? '*' : ''}</label>
						<input
							type="email"
							bind:value={patient.email}
							placeholder="e.g., patient@example.com"
							class="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none" />
					</div>
				</div>
			</div>
		</div>

		<div class="rounded-3xl bg-white p-6 shadow-lg/1">
			<label class="flex cursor-pointer items-center space-x-3">
				<input
					type="checkbox"
					bind:checked={bookingForSelf}
					class="rounded border-gray-300 text-amber-600 focus:ring-amber-500" />
				<span class="text-sm font-medium text-gray-700">Booking for myself</span>
			</label>
		</div>

		{#if !bookingForSelf}
			<div transition:slide>
				<div class="space-y-4">
					<div class="rounded-3xl bg-white p-6 shadow-lg/1">
						<h2 class="mb-4 flex items-center space-x-2 text-lg font-semibold text-gray-800">
							<Icon icon="ph:users" class="size-5" />
							<span>Guardian Details</span>
						</h2>

						<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div>
								<label class="mb-1 block text-sm font-medium text-gray-700">Guardian Name *</label>
								<input
									type="text"
									bind:value={guardian.name}
									placeholder="Enter guardian name"
									class="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none" />
							</div>
							<div>
								<label class="mb-1 block text-sm font-medium text-gray-700">Guardian Age *</label>
								<input
									type="number"
									bind:value={guardian.age}
									placeholder="Enter age"
									class="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none" />
							</div>
							<div>
								<label class="mb-1 block text-sm font-medium text-gray-700">Relation *</label>
								<select
									bind:value={guardian.relation}
									class="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none">
									<option value="">Select Relation</option>
									<option value="Parent">Parent</option>
									<option value="Spouse">Spouse</option>
									<option value="Sibling">Sibling</option>
									<option value="Child">Child</option>
									<option value="Other">Other</option>
								</select>
							</div>
							{#if guardian.relation === 'Other'}
								<div transition:slide>
									<label class="mb-1 block text-sm font-medium text-gray-700"
										>Specify Relation *</label>
									<input
										type="text"
										bind:value={guardian.otherRelation}
										placeholder="Specify relation"
										class="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none" />
								</div>
							{/if}
							<div>
								<label class="mb-1 block text-sm font-medium text-gray-700">Phone *</label>
								<input
									type="tel"
									bind:value={guardian.phone}
									placeholder="e.g., +91 12345 67890"
									class="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none" />
							</div>
							<div class="md:col-span-2">
								<label class="mb-1 block text-sm font-medium text-gray-700">Email *</label>
								<input
									type="email"
									bind:value={guardian.email}
									placeholder="e.g., guardian@example.com"
									class="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none" />
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}

		<LocationSelector bind:selectedLocation {locations} />

		{#if selectedLocation}
			<DateSelector bind:selectedDateValue />
			<SlotSelector bind:selectedSlot slots={locations[selectedLocation]} />
		{:else}
			<div class="rounded-3xl bg-gray-50 p-6 text-center">
				<Icon icon="ph:calendar" class="mx-auto mb-2 size-8 text-gray-400" />
				<p class="text-gray-600">Select a location to view available slots</p>
			</div>
		{/if}

		<div class="flex gap-3">
			<button
				type="button"
				onclick={() => goto(`/appointments/${appointment.$id}`)}
				class="w-full rounded-full bg-gray-200 py-4 text-lg font-semibold text-gray-700 shadow-lg transition-all hover:bg-gray-300 active:scale-[0.99]">
				Cancel
			</button>
			<button
				type="submit"
				disabled={!buttonEnabled}
				class="w-full rounded-full bg-amber-600 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-amber-700 active:scale-[0.99] disabled:bg-gray-400">
				{#if isSubmitting}
					<Icon icon="ph:spinner" class="mr-2 inline size-5 animate-spin" />
					Saving...
				{:else}
					<Icon icon="ph:check" class="mr-2 inline size-5" />
					Save Changes
				{/if}
			</button>
		</div>
	</form>
</div>
