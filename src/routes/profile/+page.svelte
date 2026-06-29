<script>
	import Icon from '@iconify/svelte';
	import { resolve } from '$app/paths';
	import { getUserAppointments } from '$lib/tables/appointments';
	import { getUserShopOrders } from '$lib/tables/shopOrders';
	import { user } from '$lib/stores/auth.svelte.js';
	import { account } from '$lib/appwrite';
	import { toast, Toaster } from 'svelte-sonner';
	import Popup from '$lib/components/ui/Popup.svelte';
	import Input from '$lib/components/ui/Input.svelte';

	const quickLinks = [
		{
			href: '/appointments',
			label: 'Appointments',
			description: 'Check upcoming visits',
			icon: 'ph:calendar-check'
		},
		{
			href: '/shop/orders',
			label: 'Orders',
			description: 'Track your purchases',
			icon: 'ph:package'
		},
		{
			href: '/more',
			label: 'More',
			description: 'Open app settings',
			icon: 'ph:dots-three-outline'
		}
	];

	let password = $state('');
	let showPasswordPopup = $state(false);
	let passwordExists = $derived(user?.user?.passwordUpdate ? true : false);

	function getInitials(name = '') {
		return name
			.split(' ')
			.filter(Boolean)
			.slice(0, 2)
			.map((part) => part[0]?.toUpperCase())
			.join('');
	}

	function formatDate(dateString) {
		if (!dateString) return 'Not available';

		return new Date(dateString).toLocaleDateString('en-IN', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
	}

	function getJoinedLabel(dateString) {
		return dateString ? `Joined ${formatDate(dateString)}` : 'Recently joined';
	}

	// Phone editing state
	let isEditingPhone = $state(false);
	let phoneInput = $state('');
	let phoneSaving = $state(false);

	function startEditPhone() {
		phoneInput = user?.user?.phone?.replace('+91', '') || '';
		isEditingPhone = true;
	}

	function cancelEditPhone() {
		isEditingPhone = false;
		phoneInput = '';
	}

	async function savePhone() {
		if (!phoneInput.trim()) {
			toast.error('Please enter a phone number');
			return;
		}

		if (!passwordExists) {
			await account.updatePassword(password);
		}

		phoneSaving = true;
		try {
			let phone = phoneInput.trim();
			if (!phone.startsWith('+')) {
				if (/^\d{10}$/.test(phone)) {
					phone = `+91${phone}`;
				} else {
					phone = `+${phone}`;
				}
			}
			await account.updatePhone(phone, password);
			user.user = await account.get();
			isEditingPhone = false;
			toast.success('Phone number updated');
		} catch (e) {
			console.error('Failed to update phone:', e);
			toast.error(e.message || 'Failed to update phone number');
		} finally {
			phoneSaving = false;
			showPasswordPopup = false;
		}
	}

	// Developer info toggle
	let showDevInfo = $state(false);
</script>

<Toaster richColors />

<svelte:head>
	<title>Profile - Metromale</title>
</svelte:head>

{#if showPasswordPopup}
	<Popup>
		<div class="mb-4 flex flex-col items-start gap-2">
			<p class="text-sm text-gray-600">
				{passwordExists ? "Enter" : "Create"} password to update details
			</p>
			<Input
				type="password"
				bind:value={password}
				placeholder="Enter your password"
				label="Password"
				class="w-full" />
		</div>
		<button
			onclick={() => (savePhone())}
			class="w-1/2 rounded-full bg-amber-600 py-3 text-sm font-medium text-white shadow-md transition hover:bg-amber-700 active:scale-95">
			Save
		</button>
	</Popup>
{/if}

<div class="space-y-6 p-4 md:p-8">
	<div
		class="overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary via-orange-400 to-amber-300 p-[1px] shadow-xl/5">
		<div class="rounded-[calc(2rem-1px)] bg-white/95 p-6">
			<div class="flex items-start gap-4">
				<div
					class="flex size-18 shrink-0 items-center justify-center rounded-[1.5rem] bg-primary/10 text-2xl font-semibold text-primary">
					{getInitials(user?.user?.name || 'User')}
				</div>

				<div class="min-w-0 flex-1">
					<p class="text-sm font-medium tracking-[0.2em] text-primary/80 uppercase">Profile</p>
					<h1 class="mt-2 text-2xl font-semibold text-gray-900">
						{user?.user?.name || 'Metromale Member'}
					</h1>
					<p class="mt-1 text-sm break-all text-gray-500">
						{user?.user?.email || 'No email address available'}
					</p>

					<div class="mt-4 flex flex-wrap gap-2">
						<span
							class="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
							<span class="size-2 rounded-full bg-emerald-500"></span>
							{user?.user?.emailVerification ? 'Verified account' : 'Account active'}
						</span>
						<span
							class="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
							{getJoinedLabel(user?.user?.$createdAt)}
						</span>
					</div>
				</div>
			</div>

			<div class="mt-5 grid gap-3 sm:grid-cols-1">
				<div class="rounded-2xl bg-orange-50 px-4 py-3">
					<p class="text-xs font-medium tracking-[0.15em] text-orange-500 uppercase">Phone</p>
					<p class="mt-1 text-sm font-medium text-gray-800">
						{user?.user?.phone || 'Not added yet'}
					</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Coupon Code Section - Prominent Banner -->
	{#await getUserAppointments(user?.user?.$id) then appointments}
		{#if appointments.total === 0}
			<div
				class="overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-primary p-[1px] shadow-lg">
				<div class="rounded-[calc(1.5rem-1px)] bg-gradient-to-r from-amber-50 to-orange-50 p-5">
					<div class="flex items-start gap-4">
						<div class="rounded-2xl bg-amber-100 p-3 text-amber-600">
							<Icon icon="ph:gift" class="size-6" />
						</div>
						<div class="min-w-0 flex-1">
							<p class="text-xs font-bold tracking-[0.2em] text-amber-600 uppercase">Your Coupon</p>
							<p class="mt-1 text-sm text-gray-600">
								Show this code at the clinic to get <span class="font-bold text-amber-700"
									>10% off</span> your first appointment!
							</p>
							<div
								class="mt-3 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 shadow-sm">
								<Icon icon="ph:ticket" class="size-5 text-amber-500" />
								<span class="text-xl font-bold tracking-[0.2em] text-amber-700"
									>{user?.user?.$id.slice(-5).toUpperCase()}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}
	{/await}

	<div class="grid gap-4 sm:grid-cols-2">
		<div class="rounded-3xl bg-white p-5 shadow-lg/1">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-gray-500">Appointments</p>
					<h2 class="text-lg font-semibold text-gray-900">Your care journey</h2>
				</div>
				<div class="rounded-2xl bg-red-50 p-3 text-red-400">
					<Icon icon="ph:calendar-check" class="size-6" />
				</div>
			</div>

			{#await getUserAppointments(user?.user?.$id)}
				<div class="mt-5 animate-pulse">
					<div class="h-8 w-16 rounded-full bg-gray-100"></div>
					<div class="mt-3 h-4 w-40 rounded-full bg-gray-100"></div>
				</div>
			{:then appointments}
				<p class="mt-5 text-3xl font-semibold text-gray-900">{appointments.total}</p>
				<p class="mt-2 text-sm text-gray-500">
					{appointments.total === 1 ? 'appointment booked' : 'appointments booked'}
				</p>
				<p class="mt-4 text-sm text-gray-600">
					{#if appointments.total > 0}
						Last updated from your appointment history.
					{:else}
						Book your first appointment whenever you are ready.
						<br />
						Use coupon
						<span class="font-bold text-orange-600">{user?.user?.$id.slice(-5).toUpperCase()}</span>
						at the clinic to get 10% off.
					{/if}
				</p>
			{:catch}
				<p class="mt-5 text-sm text-gray-500">Appointment details are unavailable right now.</p>
			{/await}
		</div>

		<div class="rounded-3xl bg-white p-5 shadow-lg/1">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-gray-500">Orders</p>
					<h2 class="text-lg font-semibold text-gray-900">Shop activity</h2>
				</div>
				<div class="rounded-2xl bg-amber-50 p-3 text-amber-500">
					<Icon icon="ph:package" class="size-6" />
				</div>
			</div>

			{#await getUserShopOrders(user?.user?.$id)}
				<div class="mt-5 animate-pulse">
					<div class="h-8 w-16 rounded-full bg-gray-100"></div>
					<div class="mt-3 h-4 w-40 rounded-full bg-gray-100"></div>
				</div>
			{:then orders}
				<p class="mt-5 text-3xl font-semibold text-gray-900">{orders.total}</p>
				<p class="mt-2 text-sm text-gray-500">
					{orders.total === 1 ? 'order placed' : 'orders placed'}
				</p>
				<p class="mt-4 text-sm text-gray-600">
					{#if orders.total > 0}
						Track your latest purchases from the orders page.
					{:else}
						Your shop purchases will appear here after checkout.
					{/if}
				</p>
			{:catch}
				<p class="mt-5 text-sm text-gray-500">Order details are unavailable right now.</p>
			{/await}
		</div>
	</div>

	<div class="rounded-3xl bg-white p-5 shadow-lg/1">
		<div class="flex items-center gap-3">
			<div class="rounded-2xl bg-gray-100 p-3 text-gray-600">
				<Icon icon="ph:identification-card" class="size-6" />
			</div>
			<div>
				<h2 class="text-lg font-semibold text-gray-900">Account details</h2>
				<p class="text-sm text-gray-500">A simple view of your information on file.</p>
			</div>
		</div>

		<div class="mt-5 space-y-4">
			<div class="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
				<div>
					<p class="text-sm font-medium text-gray-500">Full name</p>
					<p class="mt-1 text-base font-medium text-gray-900">
						{user?.user?.name || 'Not available'}
					</p>
				</div>
				<Icon icon="ph:user-circle" class="size-5 shrink-0 text-gray-300" />
			</div>

			<div class="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
				<div>
					<p class="text-sm font-medium text-gray-500">Email</p>
					<p class="mt-1 text-base font-medium break-all text-gray-900">
						{user?.user?.email || 'Not available'}
					</p>
				</div>
				<Icon icon="ph:envelope-simple" class="size-5 shrink-0 text-gray-300" />
			</div>

			<div class="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
				<div class="min-w-0 flex-1">
					<p class="text-sm font-medium text-gray-500">Phone number</p>
					{#if isEditingPhone}
						<div class="mt-2 flex items-center gap-2">
							<div class="relative flex-1">
								<span
									class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-gray-400"
									>+91</span>
								<input
									type="tel"
									bind:value={phoneInput}
									placeholder="10-digit number"
									maxlength="10"
									class="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pr-3 pl-12 text-sm text-gray-700 transition focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-200 focus:outline-none" />
							</div>
							<button
								onclick={showPasswordPopup = true}
								disabled={phoneSaving}
								class="rounded-xl bg-primary px-3 py-2 text-sm font-medium text-white transition-transform hover:bg-orange-500 active:scale-95 disabled:opacity-50">
								{phoneSaving ? '...' : 'Save'}
							</button>
							<button
								onclick={cancelEditPhone}
								disabled={phoneSaving}
								class="rounded-xl bg-gray-100 px-3 py-2 text-sm font-medium text-gray-600 transition-transform hover:bg-gray-200 active:scale-95 disabled:opacity-50">
								Cancel
							</button>
						</div>
					{:else}
						<div class="mt-1 flex items-center gap-2">
							<p class="text-base font-medium text-gray-900">
								{user?.user?.phone || 'Not available'}
							</p>
							<button
								onclick={startEditPhone}
								class="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-primary"
								title="Edit phone number">
								<Icon icon="ph:pencil-simple" class="size-4" />
							</button>
						</div>
					{/if}
				</div>
				<Icon icon="ph:phone" class="size-5 shrink-0 text-gray-300" />
			</div>

			<div class="flex items-start justify-between gap-4">
				<div>
					<p class="text-sm font-medium text-gray-500">Member since</p>
					<p class="mt-1 text-base font-medium text-gray-900">
						{formatDate(user?.user?.$createdAt)}
					</p>
				</div>
				<Icon icon="ph:clock-counter-clockwise" class="size-5 shrink-0 text-gray-300" />
			</div>
		</div>
	</div>

	<div class="grid gap-3 sm:grid-cols-3">
		{#each quickLinks as item (item.href)}
			<a
				href={resolve(item.href)}
				class="group rounded-3xl bg-white p-5 shadow-lg/1 transition-transform active:scale-[0.98]">
				<div class="flex items-start justify-between gap-4">
					<div>
						<h2 class="text-base font-semibold text-gray-900">{item.label}</h2>
						<p class="mt-2 text-sm text-gray-500">{item.description}</p>
					</div>
					<div
						class="rounded-2xl bg-gray-100 p-3 text-gray-500 transition-colors group-hover:bg-primary/10 group-hover:text-primary">
						<Icon icon={item.icon} class="size-5" />
					</div>
				</div>
			</a>
		{/each}
	</div>

	<!-- Developer Info - Collapsed by default -->
	<div class="rounded-3xl bg-white shadow-lg/1">
		<button
			onclick={() => (showDevInfo = !showDevInfo)}
			class="flex w-full items-center justify-between rounded-3xl p-5 text-left transition-colors hover:bg-gray-50">
			<div class="flex items-center gap-3">
				<div class="rounded-2xl bg-gray-100 p-3 text-gray-400">
					<Icon icon="ph:code" class="size-5" />
				</div>
				<div>
					<h2 class="text-sm font-medium text-gray-500">Developer Info</h2>
					<p class="text-xs text-gray-400">Technical details for debugging</p>
				</div>
			</div>
			<Icon
				icon="ph:caret-down"
				class="size-4 text-gray-400 transition-transform {showDevInfo ? 'rotate-180' : ''}" />
		</button>

		{#if showDevInfo}
			<div class="border-t border-gray-100 px-5 pt-4 pb-5">
				<div class="rounded-2xl bg-gray-50 px-4 py-3">
					<p class="text-xs font-medium tracking-[0.15em] text-gray-400 uppercase">Account ID</p>
					<p class="mt-1 truncate font-mono text-sm text-gray-500">
						{user?.user?.$id || 'Unavailable'}
					</p>
				</div>
			</div>
		{/if}
	</div>
</div>
