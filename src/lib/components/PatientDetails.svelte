<script>
	import Icon from '@iconify/svelte';
	import Input from './ui/Input.svelte';
	import Dropdown from './ui/Dropdown.svelte';
	import { onMount } from 'svelte';
	import { getUserPatients } from '$lib/tables/patients';
	import { user } from '$lib/stores/auth.svelte';
	import { slide } from 'svelte/transition';

	let {
		bookingForSelf,
		patient = $bindable({}),
		errors = $bindable({}),
		savePatientDetails = $bindable(false)
	} = $props();

	let userPatients = $state([]);
	let dropdownValue = $state('');

	onMount(async () => {
		const res = await getUserPatients(user?.user?.$id);
		userPatients = res.rows;
		// console.log('Fetched user patients:', userPatients);
	});

	$effect(() => {

		console.log('Dropdown value changed to:', dropdownValue);

		if (dropdownValue) {
			const selectedPatient = userPatients.find(
				(p) => p.$id === dropdownValue
			);
			if (selectedPatient) {
				patient.name = selectedPatient.name;
				patient.age = selectedPatient.age;
				patient.gender = selectedPatient.gender;
				patient.phone = selectedPatient.phone;	
				patient.email = selectedPatient.email;
			}
		} else {
			patient.name = '';
			patient.age = '';
			patient.gender = '';
			patient.phone = '';
			patient.email = '';
		}
	});
</script>

<div class="space-y-4">
	<div class="rounded-3xl bg-white p-6 shadow-lg/1">
		<h2 class="mb-4 flex items-center space-x-2 text-lg font-semibold text-gray-800">
			<Icon icon="ph:user" class="size-5" />
			<span>Patient Details</span>
		</h2>

		{#if userPatients.length > 0}
			<div class="mb-4">
				<Dropdown
					bind:value={dropdownValue}
					error={errors.id}
					placeholder="Select Existing Patient"
					options={
						userPatients.map(
							(p) => ({ value: `${p.$id}`, label: `${p.name} (Age: ${p.age})` })
						)
					}
					label="Existing Patients" />
			</div>
		{/if}

		{#if !dropdownValue}
			<div transition:slide class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div>
					<Input
						type="text"
						error={errors.name}
						bind:value={patient.name}
						placeholder="Enter full name"
						label="Full Name"
						required={true} />
				</div>
				<div>
					<Input
						type="number"
						error={errors.age}
						bind:value={patient.age}
						placeholder="Enter age"
						label="Age"
						required={true} />
				</div>
				<div>
					<Dropdown
						bind:value={patient.gender}
						error={errors.gender}
						placeholder="Select Gender"
						label="Gender"
						required={true} />
				</div>
				<div>
					<Input
						type="tel"
						error={errors.phone}
						bind:value={patient.phone}
						placeholder="e.g., +91 12345 67890"
						label="Phone"
						required={bookingForSelf || savePatientDetails} />
				</div>
				<div class="md:col-span-2">
					<Input
						type="email"
						error={errors.email}
						bind:value={patient.email}
						placeholder="e.g., patient@example.com"
						label="Email"
						required={bookingForSelf || savePatientDetails} />
				</div>
			</div>
		{/if}

		{#if !dropdownValue}
			<div transition:slide class="rounded-3xl bg-white p-2 pt-6">
				<label class="flex cursor-pointer items-center space-x-3">
					<input
						type="checkbox"
						bind:checked={savePatientDetails}
						class="rounded border-gray-300 text-amber-600 focus:ring-amber-500" />
					<span class="text-sm font-medium text-gray-700">Save Patient Details</span>
				</label>
			</div>
		{/if}
	</div>
</div>
