<script>
	import '../app.css';
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { isAuthenticated, user } from '$lib/stores/auth.svelte.js';

	import Modal from '$lib/shared/Modal.svelte';
	import Navbar from '$lib/shared/Navbar.svelte';
	import TopNavbar from '$lib/shared/TopNavbar.svelte';
	import { App } from '@capacitor/app';

	let { children, data } = $props();
	let name = $state('User');
	const publicRoutes = ['/auth/login', '/'];



	// onMount(() => {
	// 	App.addListener('appUrlOpen', async ({ url }) => {
	// 		// Only handle the app’s scheme
	// 		if (!url?.startsWith('com.metromaleclinic.metromale://')) return;

	// 		name = user.user?.given_name || 'User';


	// 		// Move code & state into the WebView’s URL so the Kinde client can see them
	// 		const deep = new URL(url);
	// 		const current = new URL(window.location.href);
	// 		// Place all query params (code, state, etc.) onto the current URL
	// 		current.search = deep.search;
	// 		// Navigate so @kinde-oss/kinde-auth-pkce-js can detect and finish the flow
	// 		window.location.assign(current.toString());
	// 	});
	// });

</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div
	class="no-scrollbar scrollbar-hidden h-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
>
	<TopNavbar {name} isAuth={isAuthenticated.isAuthenticated} />
	{#if !isAuthenticated.isAuthenticated && !publicRoutes.includes(page.url.pathname)}
		<Modal />
	{:else}
		<div class="body no-scrollbar scrollbar-hidden h-full w-full">{@render children?.()}</div>
	{/if}
	<Navbar />
</div>

<style>
	.body {
		-ms-overflow-style: none; /* Internet Explorer 10+ */
		scrollbar-width: none; /* Firefox, Safari 18.2+, Chromium 121+ */
	}
	.body::-webkit-scrollbar {
		display: none; /* Older Safari and Chromium */
	}
</style>
