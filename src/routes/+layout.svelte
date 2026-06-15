<script>
	import '../app.css';
	import { page } from '$app/state';
	import logo from '$lib/assets/logo.svg';
	import { onMount } from 'svelte';
	import { isAuthenticated, isLoading, user } from '$lib/stores/auth.svelte.js';
	import { initAuth } from '$lib/auth/bootstrap.js';
	import { PushNotifications } from '@capacitor/push-notifications';
	import { Capacitor } from '@capacitor/core'; // Added Capacitor core

	import Modal from '$lib/shared/Modal.svelte';
	import Navbar from '$lib/shared/Navbar.svelte';
	import TopNavbar from '$lib/shared/TopNavbar.svelte';

	// Make sure to import ID from Appwrite!
	import { account, ID, messaging } from '$lib/appwrite';
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import Popup from '$lib/components/ui/Popup.svelte';
	import { getUserAppointments } from '$lib/tables/appointments';
	let { children, data } = $props();

	let name = $derived(user.user?.name || 'User');
	let showDiscountPopup = $state(false);
	let couponCode = $state('');
	let pushInitialized = false;
	let discountCheckedForUserId = null;

	async function checkNewUserDiscount(userId) {
		const storageKey = `hasSeenDiscountPopup:${userId}`;
		if (typeof localStorage !== 'undefined') {
			if (localStorage.getItem(storageKey)) return;
		}

		try {
			const appointments = await getUserAppointments(userId);
			if (appointments && appointments.total === 0) {
				couponCode = userId.slice(-5).toUpperCase();
				showDiscountPopup = true;
			}
			if (typeof localStorage !== 'undefined') {
				localStorage.setItem(storageKey, 'true');
			}
		} catch (e) {
			console.error('Error checking discount eligibility', e);
		}
	}
	const publicRoutes = ['/auth/login', '/'];
	const publicPrefixes = ['/shop', '/content', '/more/about'];

	// Define your Provider IDs here (ideally from environment variables)
	const FCM_PROVIDER_ID = '6a2ce8b90031b8fc38c0';
	const APNS_PROVIDER_ID = '6a2cef90002b22f92775';
	let isPublicRoute = $derived(
		publicRoutes.includes(page.url.pathname) ||
			publicPrefixes.some((p) => page.url.pathname.startsWith(p))
	);

	async function initPush() {
		if (pushInitialized) return;
		pushInitialized = true;

		try {
			const platform = Capacitor.getPlatform();

			// 1. Web Guard: Exit early if running in a standard browser
			if (platform === 'web') return;

			// Check/request permissions
			let permStatus = await PushNotifications.checkPermissions();
			if (permStatus.receive === 'prompt') {
				permStatus = await PushNotifications.requestPermissions();
			}
			if (permStatus.receive !== 'granted') {
				console.error('Permissions denied');
				return;
			}

			// Register
			await PushNotifications.register();

			// Listen for token
			PushNotifications.addListener('registration', async (token) => {
				try {
					console.log(`Token registered for ${platform}:`, token.value);

					// 2. Route to the correct Appwrite Provider
					const providerId = platform === 'ios' ? APNS_PROVIDER_ID : FCM_PROVIDER_ID;

					// 3. Multi-device fix: Use ID.unique() instead of user.$id
					const pushTargetId = ID.unique();
					await account.createPushTarget(pushTargetId, token.value, providerId);

					await messaging.createSubscriber('all-users', ID.unique(), pushTargetId);

					console.log('Successfully saved target to Appwrite!');
				} catch (error) {
					// Appwrite safely throws 409 if this exact token is already saved
					if (error?.code !== 409) {
						console.error('Token registration failed:', error);
					}
				}
			});

			// Handle incoming notifications (optional, for foreground)
			PushNotifications.addListener('pushNotificationReceived', (notification) => {
				console.log('Received:', notification);
				// e.g., show in-app alert for friend request
			});

			// Handle taps
			PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
				console.log('Action:', action);
				// Navigate to friend requests page
			});

			// Create default channel (Android only, iOS ignores this gracefully)
			if (platform === 'android') {
				await PushNotifications.createChannel({
					id: 'fcm_default_channel',
					name: 'Messages',
					description: 'General notifications',
					importance: 4
				});
			}
		} catch (error) {
			console.error('Push initialization failed:', error);
		}
	}

	onMount(async () => {
		void initAuth();
	});

	$effect(() => {
		if (isLoading.isLoading) return;

		if (!isAuthenticated.isAuthenticated && !isPublicRoute) {
			void goto('/auth/login');
		}
	});

	$effect(() => {
		const userId = user.user?.$id;
		if (!isAuthenticated.isAuthenticated || !userId) return;

		void initPush();

		if (discountCheckedForUserId !== userId) {
			discountCheckedForUserId = userId;
			void checkNewUserDiscount(userId);
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={logo} />
	<title>Metromale - Male Fertility Clinic</title>
</svelte:head>

<div
	class="no-scrollbar scrollbar-hidden h-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 md:mx-auto md:max-w-3xl">
	{#key name}
		<TopNavbar {name} isAuth={isAuthenticated.isAuthenticated} />
	{/key}

	{#if isLoading.isLoading && !isPublicRoute}
		<Modal text="Loading your account..." description="" />
	{:else if !isAuthenticated.isAuthenticated && !isPublicRoute}
		<Modal />
	{:else}
		{#key page.url.pathname}
			<div
				in:fade={{ duration: 150, delay: 150 }}
				out:fade={{ duration: 150 }}
				class="body no-scrollbar scrollbar-hidden h-full w-full">
				{@render children?.()}
			</div>
		{/key}
	{/if}

	{#if page.url.pathname !== '/auth/login'}
		<Navbar />
	{/if}

	{#if showDiscountPopup}
		<Popup closeDialog={() => (showDiscountPopup = false)}>
			<div class="p-4 text-center">
				<h2 class="mb-3 text-2xl font-bold text-amber-600">Welcome!</h2>
				<p class="mb-4 text-gray-600">
					Get 10% off your first appointment. Show this code at the clinic when you visit:
				</p>
				<div
					class="mb-6 rounded-xl bg-amber-50 py-4 text-3xl font-bold tracking-widest text-amber-700 shadow-inner">
					{couponCode}
				</div>
				<p class="mb-4 text-gray-600">
					You can find this code again in your profile under <a
						href="/profile"
						class="text-amber-600 hover:underline">Coupons</a>
				</p>
				<button
					onclick={() => (showDiscountPopup = false)}
					class="w-full rounded-full bg-amber-600 py-3 font-semibold text-white shadow-md transition hover:bg-amber-700 active:scale-95">
					Got it!
				</button>
			</div>
		</Popup>
	{/if}
</div>

<style>
	.body {
		-ms-overflow-style: none; /* Internet Explorer 10+ */
		scrollbar-width: none; /* Firefox, Safari 18.2+, Chromium 121+ */
		scrollbar-gutter: stable;
	}

	.body::-webkit-scrollbar {
		display: none; /* Older Safari and Chromium */
	}
</style>
