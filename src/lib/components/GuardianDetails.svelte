<script>
	import Icon from '@iconify/svelte';
	import Input from './ui/Input.svelte';
	import Dropdown from './ui/Dropdown.svelte';
	import { slide } from 'svelte/transition';

	let { guardian = $bindable() } = $props();

</script>

<div class="space-y-4">
	<div class="rounded-3xl bg-white p-6 shadow-lg/1">
		<h2 class="mb-4 flex items-center space-x-2 text-lg font-semibold text-gray-800">
			<Icon icon="ph:user-circle" class="size-5" />
			<span>Guardian Details</span>
		</h2>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			<div>
				<Input
					type="text"
					bind:value={guardian.name}
					placeholder="Enter full name"
					label="Full Name"
					required={true} />
			</div>
			<div>
				<Input
					type="number"
					bind:value={guardian.age}
					placeholder="e.g., 45"
					label="Age"
					required={true} />
			</div>
			<div>
				<Dropdown
					label="Relation to Patient"
					bind:value={guardian.relation}
					placeholder="Select relation"
					options={['Parent', 'Spouse', 'Sibling', 'Other']}
					required={true} />
			</div>
			{#if guardian.relation === 'other'}
				<div transition:slide>
					<Input
						type="text"
						bind:value={guardian.otherRelation}
						placeholder="Specify relation"
						label="Specify Relation"
						required={true} />
				</div>
			{/if}
			<div>
				<Input
					label="Phone"
					type="tel"
					bind:value={guardian.phone}
					placeholder="e.g., +91 12345 67890"
					required={true} />
			</div>
			<div>
				<Input
					label="Email"
					type="email"
					bind:value={guardian.email}
					placeholder="e.g., guardian@example.com"
					required={true} />
			</div>
		</div>
	</div>
</div>
