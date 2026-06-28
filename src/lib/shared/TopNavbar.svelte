<script>
	import Icon from '@iconify/svelte';
	import { page } from '$app/state';
	import { fade, slide } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { Query, tablesDB } from '$lib/appwrite';
	import { user } from '$lib/stores/auth.svelte';
	import { getUserAppointments } from '$lib/tables/appointments';

	let { name = 'User', isAuth = false } = $props();

	// let notifications = $state([]);
	let appointmentCount = $state(0);
	let orderCount = $state(0);
	let menuOpen = $state(false);
	let hasCoupon = $state(false);
	let couponCode = $state('');
	// const hiddenPaths = ['/auth/login'];

	onMount(async () => {
		if (!isAuth) {
			return;
		}

		const appointments = await tablesDB.listRows({
			databaseId: 'metromale',
			tableId: 'appointments',
			queries: [
				Query.equal('status', ['pending', 'confirmed']),
				Query.equal('userId', user?.user.$id)
			]
		});

		appointmentCount = appointments.total;

		const orders = await tablesDB.listRows({
			databaseId: 'metromale',
			tableId: 'shop_orders',
			queries: [
				Query.equal('status', ['pending', 'shipped']),
				Query.equal('userId', user?.user.$id)
			]
		});

		orderCount = orders.total;

		// Check if user has a coupon (no appointments yet)
		try {
			const allAppointments = await getUserAppointments(user?.user?.$id);
			if (allAppointments && allAppointments.total === 0) {
				hasCoupon = true;
				couponCode = user?.user?.$id.slice(-5).toUpperCase();
			}
		} catch (e) {
			console.error('Error checking coupon eligibility:', e);
		}

		// notifications = [...appointments.rows, ...orders.rows];
	});

	async function handleLogin() {
		goto('/auth/login');
	}

	function openNotifications() {
		menuOpen = !menuOpen;
	}
</script>

<nav
	class="fixed {page.url.pathname === '/auth/login'
		? 'hidden'
		: ''} inset-x-0 top-0 z-50 flex items-center justify-between border-b border-gray-100 bg-white px-4">
	<!-- <h1 class="text-lg font-bold grow">Metromale</h1> -->
	<h1 class="grow text-2xl">Hi, <span class="font-medium">{name}</span>!</h1>

	<div class="mx-auto flex h-16 items-center justify-end">
		<button
			onclick={openNotifications}
			class="relative flex h-fit w-fit flex-1 flex-col items-center justify-center rounded-full bg-gray-100 p-3 text-center text-black transition-transform active:scale-95 active:opacity-80">
			<Icon icon="ph:bell-simple" class="h-6 w-6" />
			{#if hasCoupon || appointmentCount + orderCount > 0}
				<span class="absolute -top-0.5 -right-0.5 size-3 rounded-full bg-amber-500 ring-2 ring-white"></span>
			{/if}
		</button>

		{#if !isAuth}
			<button
				onclick={handleLogin}
				class="ml-4 inline-flex h-11 items-center justify-center rounded-full bg-primary px-4 text-sm font-semibold text-white shadow-sm transition-transform hover:bg-orange-400 active:scale-95 active:opacity-80">
				Login
				<Icon icon="ph:sign-in" class="ml-2 h-5 w-5" />
			</button>
		{/if}
	</div>
</nav>

<div class="h-16"></div>

{#if menuOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		transition:fade={{ duration: 200 }}
		class="fixed inset-0 z-50 bg-gray-900/30"
		onclick={() => (menuOpen = false)}>
	</div>
	<div
		transition:slide={{ duration: 300, axis: 'y' }}
		class="fixed inset-x-0 top-20 z-60 mx-4 max-w-7xl rounded-3xl bg-white p-6 shadow-lg sm:mx-6 lg:mx-8">
		{#if hasCoupon || appointmentCount + orderCount > 0}
			<div class="flex w-full flex-col items-center justify-start space-y-2">
				{#if hasCoupon}
					<a href="/profile" onclick={() => (menuOpen = false)}
						class="flex w-full items-center gap-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-4 transition-transform active:scale-[0.98]">
						<div class="rounded-xl bg-amber-100 p-2 text-amber-600">
							<Icon icon="ph:gift" class="size-5" />
						</div>
						<div class="flex-1">
							<p class="text-sm font-semibold text-amber-700">You have a 10% off coupon!</p>
							<p class="text-xs text-gray-500">Code: <span class="font-bold tracking-wider text-amber-600">{couponCode}</span> · Tap to view in profile</p>
						</div>
						<Icon icon="ph:caret-right" class="size-4 text-amber-400" />
					</a>
				{/if}
				{#if appointmentCount > 0}
					<p class="w-full rounded-xl bg-gray-50 py-4 text-center text-gray-600">
						You have {appointmentCount} upcoming appointment(s)
					</p>
				{/if}
				{#if orderCount > 0}
					<p class="w-full rounded-xl bg-gray-50 py-4 text-center text-gray-600">
						You have {orderCount} upcoming order(s)
					</p>
				{/if}
			</div>
		{:else}
			<div class="flex h-60 w-full flex-col items-center justify-center space-y-6">
				<Icon icon="ph:bell-simple-z" class="size-8 text-gray-400" />
				<h2 class="font-medium text-gray-700">No New Notifications</h2>
			</div>
		{/if}
	</div>
{/if}

