<script>
	import Icon from '@iconify/svelte';
	import Input from './ui/Input.svelte';
	import Dropdown from './ui/Dropdown.svelte';

	let { bookingForSelf, patient = $bindable({}), errors = $bindable({}) } = $props();
</script>

<div class="space-y-4">
	<div class="rounded-3xl bg-white p-6 shadow-lg/1">
		<h2 class="mb-4 flex items-center space-x-2 text-lg font-semibold text-gray-800">
			<Icon icon="ph:user" class="size-5" />
			<span>Patient Details</span>
		</h2>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
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
					options={['Male', 'Female', 'Other']}
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
					required={bookingForSelf} />
			</div>
			<div class="md:col-span-2">
				<Input
					type="email"
					error={errors.email}
					bind:value={patient.email}
					placeholder="e.g., patient@example.com"
					label="Email"
					required={bookingForSelf} />
			</div>
		</div>
	</div>
</div>
