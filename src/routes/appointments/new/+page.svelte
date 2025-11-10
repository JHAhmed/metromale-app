<script>
	import { z } from 'zod';
	import { goto } from '$app/navigation';
	import { slide } from 'svelte/transition';
	import { toast, Toaster } from 'svelte-sonner';
	import { CalendarDate, parseDate, getLocalTimeZone } from '@internationalized/date';

	import { user } from '$lib/stores/auth.svelte';
	import { addAppointment } from '$lib/tables/appointments';
	import { addPatient } from '$lib/tables/patients';

	import Icon from '@iconify/svelte';
	import SlotSelector from '$lib/components/SlotSelector.svelte';
	import DateSelector from '$lib/components/DateSelector.svelte';
	import PatientDetails from '$lib/components/PatientDetails.svelte';
	import GuardianDetails from '$lib/components/GuardianDetails.svelte';
	import LocationSelector from '$lib/components/LocationSelector.svelte';

	let bookingForSelf = $state(true);
	let selectedLocation = $state('');
	let selectedSlot = $state('');
	let selectedDateValue = $state();
	let savePatientDetails = $state(false);

	// let selectedDate = $derived(selectedDateValue.toDate(getLocalTimeZone()));

	let selectedDate = $derived.by(() => {
		let date;
		if (selectedDateValue) {
			date = selectedDateValue.toDate(getLocalTimeZone());
			// const formatter = new Intl.DateTimeFormat('en-GB', {
			// 	day: '2-digit',
			// 	month: '2-digit',
			// 	year: 'numeric'
			// });
			// date = formatter.format(date);
		} else {
			date = null;
		}
		return date;
	});

	let patient = $state({
		name: '',
		age: '',
		gender: '',
		phone: '',
		email: ''
	});

	let guardian = $state({
		name: '',
		age: '',
		phone: '',
		email: '',
		relation: '',
		otherRelation: ''
	});

	let errors = $state({});

	let buttonEnabled = $derived.by(() => {
		return selectedLocation && selectedSlot && patient.name && patient.age && patient.gender;
	});

	const locations = $state({
		OMR: ['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM'],
		Porur: ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '3:00 PM', '4:00 PM'],
		'T Nagar': ['11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM']
	});

	$effect(() => {
		if (selectedLocation && !locations[selectedLocation].includes(selectedSlot)) {
			selectedSlot = '';
		}

		console.log('Selected Date:', selectedDate);
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
		selectedDate: z
			.date()
			.min(new Date(), 'Please select a date within the next 6 months')
			.max(
				new Date(new Date().setMonth(new Date().getMonth() + 6)),
				'Please select a date within the next 6 months'
			),
		patient: patientSchema(true), // Invoke with true for required phone/email
		guardian: z.object({}).passthrough().optional() // Guardian ignored when booking for self
	});

	const bookingForOtherSchema = z.object({
		bookingForSelf: z.literal(false),
		selectedLocation: z.string().min(1, 'Please select a location'),
		selectedSlot: z.string().min(1, 'Please select a time slot'),
		selectedDate: z
			.date()
			.min(new Date(), 'Please select a date within the next 6 months')
			.max(
				new Date(new Date().setMonth(new Date().getMonth() + 6)),
				'Please select a date within the next 6 months'
			),
		patient: patientSchema(false), // Invoke with false for optional phone/email
		guardian: guardianSchema // Guardian required here
	});

	const bookingSchema = z.discriminatedUnion('bookingForSelf', [
		bookingForSelfSchema,
		bookingForOtherSchema
	]);

	async function savePatient() {
		try {
			await addPatient({
				associatedUserId: user.user.$id,
				name: patient.name,
				age: patient.age,
				gender: patient.gender,
				phone: patient.phone,
				email: patient.email
			});
			toast.success('Patient details saved successfully!');
		} catch (error) {
			console.error('Error saving patient details:', error);
			toast.error('Failed to save patient details.');
		}
	}

	async function handleSubmit(e) {
		e.preventDefault();

		if (savePatientDetails) {
			await savePatient();
		}

		const formData = {
			bookingForSelf,
			selectedLocation,
			selectedSlot,
			selectedDate,
			patient,
			guardian
		};

		errors = {};

		const result = bookingSchema.safeParse(formData);
		let toastMessage = '';

		if (!result.success) {
			toastMessage = getFirstError(result.error.format()) || 'Please enter all required fields!';
			console.log('Validation errors:', result.error);
			toast.error(toastMessage.trim());
			return;
		}

		console.log('Validation successful!', result.data);

		try {
			const appointment = await addAppointment({
				userId: user.user.$id,
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
			});

			toast.success('Appointment booked successfully!');
			goto(`/appointments/${appointment.$id}`);
		} catch (error) {
			console.error(error);
			toast.error('An error occurred while booking the appointment.');
			return;
		}
	}
</script>

<Toaster richColors />

<div class="space-y-6 p-4 md:p-8">
	<h1 class="text-2xl font-semibold text-gray-800">Book New Appointment</h1>

	<form onsubmit={handleSubmit} class="space-y-6">
		<PatientDetails bind:patient {bookingForSelf} bind:savePatientDetails />

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
				<GuardianDetails bind:guardian />
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

		<button
			type="submit"
			onclick={handleSubmit}
			disabled={!buttonEnabled}
			class="w-full rounded-full bg-amber-600 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-amber-700 active:scale-[0.99] disabled:bg-gray-400">
			<Icon icon="ph:calendar-plus" class="mr-2 inline size-5" />
			Book Appointment
		</button>
	</form>
</div>
