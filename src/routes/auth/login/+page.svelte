<script>
	import { onMount } from 'svelte';
	import { initKinde } from '$lib/auth';
	import { loadAuth } from '$lib/stores/auth.svelte.js';
	import { goto } from '$app/navigation';

	onMount(async () => {
		await loadAuth();
		// Handle redirect callback if coming back from Kinde
		const url = new URL(window.location.href);
		if (url.searchParams.has('code')) {
			const client = await initKinde();
			await client.handleRedirectCallback(); // Processes auth code and gets tokens [3]
			await loadAuth();
			goto('/dashboard'); // Redirect after auth
		}
	});

	async function login() {
		const client = await initKinde();
		await client.login(); // Redirects to Kinde login [3]
	}

	async function register() {
		const client = await initKinde();
		await client.register(); // Redirects to Kinde register [3]
	}
</script>

<div class="flex flex-col space-y-4 items-center justify-center min-h-[50vh]">
    <button class="px-4 py-2 rounded-lg bg-amber-100 w-fit" on:click={login}>Login</button>
    <button class="px-4 py-2 rounded-lg bg-amber-100 w-fit" on:click={register}>Register</button>
</div>
