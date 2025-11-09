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
	import { fade } from 'svelte/transition';
	import { storageAdapter } from '$lib/utils/storageAdapter';
	import { cart } from '$lib/stores/cart.svelte';

	let { children, data } = $props();

	let name = $derived(user?.user?.name || 'User');
	const publicRoutes = ['/auth/login', '/'];

	onMount(async () => {
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
	<title>Metromale - Male Fertility Clinic</title>
</svelte:head>

<div
	class="no-scrollbar scrollbar-hidden h-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 md:mx-auto md:max-w-3xl">
	{#key name}
		<TopNavbar {name} isAuth={isAuthenticated.isAuthenticated} />
	{/key}

	{#if !isAuthenticated.isAuthenticated && !publicRoutes.includes(page.url.pathname)}
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
