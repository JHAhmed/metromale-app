
<script>
	import '../app.css';
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { afterNavigate, goto } from '$app/navigation';
	import { isAuthenticated, loadAuth, user } from '$lib/stores/auth.svelte.js';
	import { Capacitor } from '@capacitor/core';
	import { StatusBar, Style } from '@capacitor/status-bar';
	import Modal from '$lib/shared/Modal.svelte';

	import Navbar from '$lib/shared/Navbar.svelte';
	import TopNavbar from '$lib/shared/TopNavbar.svelte';

	let { children, data } = $props();
	let name = $state('User');
	const publicRoutes = ['/auth/login', '/'];
	onMount(async () => {
		// if (Capacitor.isNativePlatform()) {
		// 	await StatusBar.setOverlaysWebView({ overlay: false });
		// 	await StatusBar.setBackgroundColor({ color: '#ffffff' });
		// 	await StatusBar.setStyle({ style: Style.Light });
		// }

		// await loadAuth();

		name = user.user.given_name;

		// if (!isAuthenticated.isAuthenticated) {
		// 	goto('/auth/login');
		// }

		// afterNavigate(async () => {
		// 	if (!isAuthenticated.isAuthenticated) {
		// 		goto('/auth/login');
		// 	}
		// });
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div
	class="no-scrollbar scrollbar-hidden h-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
>
	<TopNavbar {name} isAuth={isAuthenticated.isAuthenticated} />
	{#if !isAuthenticated.isAuthenticated && !publicRoutes.includes(page.url.pathname)}
		<!-- Show nothing or a loading spinner while checking authentication -->

	<Modal />
	{:else}
		<div class="body no-scrollbar scrollbar-hidden h-full w-full">{@render children?.()}</div>
	{/if}
	<Navbar />
</div>

<!-- {/if} -->

<style>
	.body {
		-ms-overflow-style: none; /* Internet Explorer 10+ */
		scrollbar-width: none; /* Firefox, Safari 18.2+, Chromium 121+ */
	}
	.body::-webkit-scrollbar {
		display: none; /* Older Safari and Chromium */
	}
</style>
