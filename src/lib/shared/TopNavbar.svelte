<script>
	import Icon from '@iconify/svelte';
	import { page } from '$app/stores';
	import { fade, slide } from 'svelte/transition';
	import { kindeClient } from '$lib/stores/auth.svelte';
	import { Browser } from '@capacitor/browser';

	let { name = 'User', isAuth = false } = $props();

	let menuOpen = $state(false);

	async function handleLogin () {
		// const authUrl = await kindeClient.client.login();  // Or kinde.register() for sign-up
		// await Browser.open({ url: kindeClient.client. });  // Open in system browser
		// login();
	}

	function openNotifications() {
		menuOpen = !menuOpen;
	}
</script>

<nav
	class="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b bg-white border-gray-100 px-4"
>
	<!-- <h1 class="text-lg font-bold grow">Metromale</h1> -->
	<h1 class="grow text-2xl">Hi, <span class="font-medium">{name}</span>!</h1>

	<div class="mx-auto flex h-16 items-center justify-end">
		<button
			onclick={openNotifications}
			class="flex h-fit w-fit flex-1 flex-col items-center justify-center rounded-full bg-gray-100 p-3 text-center text-black"
		>
			<Icon icon="ph:bell-simple" class="h-6 w-6" />
		</button>

		{#if !isAuth}
			<button
				onclick={handleLogin}
				class="ml-4 inline-flex h-11 items-center justify-center rounded-full bg-yellow-400 px-4 text-sm font-semibold text-black shadow-sm hover:bg-yellow-300 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:outline-none"
			>
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
		onclick={() => (menuOpen = false)}
	></div>
	<div
		transition:slide={{ duration: 300, axis: 'y' }}
		class="fixed inset-x-0 top-20 z-60 mx-4 max-w-7xl rounded-3xl bg-white p-6 shadow-lg sm:mx-6 lg:mx-8"
	>
		<div class="flex h-60 w-full flex-col items-center justify-center space-y-6">
			<Icon icon="ph:bell-simple-z" class="size-8 text-gray-400" />
			<h2 class="font-medium text-gray-700">No New Notifications</h2>
		</div>
	</div>
{/if}
