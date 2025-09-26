<script>
	import { goto } from '$app/navigation';
	import logo from '$lib/assets/logo.svg';
	import { account } from '$lib/appwrite';
	import Modal from '$lib/shared/Modal.svelte';
	import { isAuthenticated, user } from '$lib/stores/auth.svelte';
	import Icon from '@iconify/svelte';

	let loading = $state(false);
	let isRegistering = $state(false);
	let showOtpInput = $state(false); // New: Toggle OTP field visibility

	let name = $state(''); // Optional for "signup"
	let phone = $state(''); // e.g., '+919876543210'
	let otp = $state(''); // The 6-digit OTP from SMS
	let error = $state('');
	let tempUserId = $state(''); // Store userId from createPhoneToken

	async function handleSubmit(e) {
		e.preventDefault();
		loading = true;
		error = '';

		if (!showOtpInput) {
			// Step 1: Send OTP
			await sendOtp();
		} else {
			// Step 2: Verify OTP and create session
			await verifyOtp();
		}
	}

	async function sendOtp() {
		try {
			const token = await account.createPhoneToken('unique()', phone);
			console.log('OTP sent to phone:', phone, token);
			tempUserId = token.userId; // Store for verification
			showOtpInput = true; // Show OTP input
		} catch (e) {
			error = e.message;
			console.error('Error sending OTP:', e);
		} finally {
			loading = false;
		}
	}

	async function verifyOtp() {
		try {
			await account.createSession(tempUserId, otp);
			isAuthenticated.isAuthenticated = true;
			const userData = await account.get();

			// If registering, update name (optional)
			if (isRegistering && name) {
				await account.updateName(name);
				userData.name = name; // Update local user data
			}

			user.user = userData;
			goto('/');
		} catch (e) {
			error = e.message;
		} finally {
			loading = false;
			showOtpInput = false; // Reset for next time
		}
	}

	async function handleLogout() {
		try {
			await account.deleteSession('current');
			isAuthenticated.isAuthenticated = false;
			user.user = null;
			goto('/');
		} catch (error) {
			console.error('Logout failed:', error);
		}
	}
</script>

<!-- <form onsubmit={handleSubmit}>
	{#if isRegistering}
		<input type="text" bind:value={name} placeholder="Name" />
	{/if}
	<input type="tel" bind:value={phone} placeholder="Phone Number (e.g., +919876543210)" />

	{#if showOtpInput}
		<input type="text" bind:value={otp} placeholder="Enter OTP" maxlength="6" />
	{/if}

	<button type="submit" disabled={loading}>
		{loading ? 'Loading...' : showOtpInput ? 'Verify OTP' : isRegistering ? 'Register' : 'Login'}
	</button>
	{#if error}
		<p>{error}</p>
	{/if}
</form>

<button onclick={() => (isRegistering = !isRegistering)}>
	{isRegistering ? 'Switch to Login' : 'Switch to Register'}
</button> -->

{#if loading}
	<Modal text="Logging in..." />
{/if}

<div class="flex min-h-[80vh] flex-col items-center justify-center p-6 space-y-8">

	<div class="">
		<img src={logo} class="size-12 rounded-full" alt="" />
	</div>

	{#if !isAuthenticated.isAuthenticated}
		<div class="w-full max-w-md space-y-6 rounded-3xl bg-white p-6 shadow-lg/1 md:p-8">
			<!-- Header Section -->
			<div class="text-center">
				<h1 class="text-2xl font-bold text-gray-800">
					{#if isRegistering}
						Create an Account
					{:else}
						Welcome Back
					{/if}
				</h1>
				<p class="mt-1 text-sm text-gray-500">
					{#if isRegistering}
						Please fill in the details to get started.
					{:else}
						Sign in to continue to your dashboard.
					{/if}
				</p>
			</div>

			<!-- Form Element -->
			<form onsubmit={handleSubmit} class="space-y-4">
				<!-- Name Field (Conditional) -->
				{#if isRegistering}
					<div>
						<label for="name" class="sr-only block text-sm font-medium text-gray-700">Name</label>
						<div class="relative">
							<span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
								<Icon icon="ph:user" class="size-5 text-gray-400" />
							</span>
							<input
								type="text"
								id="name"
								bind:value={name}
								requiorange
								placeholder="Full Name"
								class="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 pl-10 text-sm text-gray-700 transition focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-200 focus:outline-none"
							/>
						</div>
					</div>
				{/if}

				<!-- Phone Field -->
				<div>
					<label for="phone" class="sr-only block text-sm font-medium text-gray-700">Phone</label>
					<div class="relative">
						<span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
							<Icon icon="ph:phone" class="size-5 text-gray-400" />
						</span>
						<input
							type="tel"
							id="phone"
							bind:value={phone}
							required
							placeholder="Phone Number (e.g., +919876543210)"
							class="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 pl-10 text-sm text-gray-700 transition focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-200 focus:outline-none"
						/>
					</div>
				</div>

				{#if showOtpInput}


				<div>
					<label for="otp" class="sr-only block text-sm font-medium text-gray-700">OTP</label>
					<div class="relative">
						<span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
							<Icon icon="ph:lock" class="size-5 text-gray-400" />
						</span>
						<input
							type="tel"
							id="otp"
							bind:value={otp}
							required
							maxlength={6}
							placeholder="Enter OTP"
							class="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 pl-10 text-sm text-gray-700 transition focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-200 focus:outline-none"
						/>
					</div>
				</div>

					<!-- <input class="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 pl-10 text-sm text-gray-700 transition focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-200 focus:outline-none" type="text" bind:value={otp} placeholder="Enter OTP" maxlength="6" /> -->
				{/if}

				<!-- Password Field -->
				<!-- <div>
					<label for="password" class="sr-only block text-sm font-medium text-gray-700"
						>Password</label
					>
					<div class="relative">
						<span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
							<Icon icon="ph:lock" class="size-5 text-gray-400" />
						</span>
						<input
							type="password"
							id="password"
							bind:value={password}
							required
							placeholder="Password"
							class="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 pl-10 text-sm text-gray-700 transition focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-200 focus:outline-none"
						/>
					</div>
				</div> -->

				<!-- Submit Button -->
				<button
					type="submit"
					class="w-full rounded-xl bg-primary px-5 py-3 text-sm font-medium text-white shadow-sm transition-transform hover:scale-[1.02] hover:bg-orange-500 focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:outline-none"
				>
				{loading ? 'Loading...' : showOtpInput ? 'Verify OTP' : isRegistering ? 'Register' : 'Login'}
				<!-- {#if isRegistering}
						Create Account
					{:else}
						Sign In
					{/if} -->
				</button>
			</form>

			<!-- Toggle between Login/Register -->
			<p class="text-center text-sm text-gray-600">
				{#if isRegistering}
					Already have an account?
					<button
						onclick={() => (isRegistering = !isRegistering)}
						class="font-medium text-orange-400 transition hover:text-orange-500 hover:underline"
					>
						Sign In
					</button>
				{:else}
					Don't have an account?
					<button
						onclick={() => (isRegistering = !isRegistering)}
						class="font-medium text-orange-400 transition hover:text-orange-500 hover:underline"
					>
						Register
					</button>
				{/if}
			</p>
		</div>
	{:else}
		<div class="space-y-4 text-center">
			<h2 class="text-2xl font-bold text-gray-800">You are already logged in!</h2>
			<button
				onclick={handleLogout}
				class="w-full rounded-xl bg-orange-400 px-5 py-3 text-sm font-medium text-white shadow-sm transition-transform hover:scale-[1.02] hover:bg-orange-500 focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:outline-none"
			>
				Logout
			</button>
			<p class="mt-2 text-gray-600">
				Go to the <a href="/" class="text-orange-400 hover:underline">home page</a>.
			</p>
		</div>
	{/if}
</div>
