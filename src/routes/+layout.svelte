<script>
	import '../app.css';
	import { page } from '$app/state';
	import logo from '$lib/assets/logo.svg';
	import { onMount } from 'svelte';
	import { isAuthenticated, user } from '$lib/stores/auth.svelte.js';

	import Modal from '$lib/shared/Modal.svelte';
	import Navbar from '$lib/shared/Navbar.svelte';
	import TopNavbar from '$lib/shared/TopNavbar.svelte';

	import { account } from '$lib/appwrite';
	import { goto } from '$app/navigation';

	let { children, data } = $props();
	
	let name = $derived(user?.user?.name || 'User');
	const publicRoutes = ['/auth/login', '/'];

	onMount(() => {
		if (!isAuthenticated.isAuthenticated && !publicRoutes.includes(page.url.pathname)) {
			goto('/auth/login');			
		}
	});

	$effect(() => {

		if (!isAuthenticated.isAuthenticated && !publicRoutes.includes(page.url.pathname)) {
			goto('/auth/login');			
		}

	});

</script>

<svelte:head>
	<link rel="icon" href={logo} />
</svelte:head>

<div
	class="no-scrollbar scrollbar-hidden h-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
>
	{#key name}
		<TopNavbar {name} isAuth={isAuthenticated.isAuthenticated} />
	{/key}

	{#if !isAuthenticated.isAuthenticated && !publicRoutes.includes(page.url.pathname)}
		<Modal />
	{:else}
		<div class="body no-scrollbar scrollbar-hidden h-full w-full">{@render children?.()}</div>
	{/if}

	{#if page.url.pathname !== '/auth/login'}
		<Navbar />
	{/if}

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
