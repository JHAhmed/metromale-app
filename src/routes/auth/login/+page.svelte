<!-- Remember to change label & placeholder to "Email or Phone Number once Twilio is integrated" -->
<script>
	import { goto } from '$app/navigation';

	import logo from '$lib/assets/logo.svg';
	import { account, ID, functions } from '$lib/appwrite';
	import { ExecutionMethod } from 'appwrite';
	import { env } from '$env/dynamic/public';
	import Modal from '$lib/shared/Modal.svelte';
	import { isAuthenticated, user } from '$lib/stores/auth.svelte';
	import { clearAuth, initAuth } from '$lib/auth/bootstrap.js';
	import { toast, Toaster } from 'svelte-sonner';
	import Icon from '@iconify/svelte';

	const PHONE_OTP_FUNCTION_ID = '6a42213400132646bc69';

	let loading = $state(false);
	let isRegistering = $state(false);
	let loginMethod = $state('password'); // 'otp' or 'password'

	let isOtpSent = $state(false);
	let isPhoneOtp = $state(false);
	let phoneForOtp = $state('');
	let userId = $state('');
	let otp = $state('');

	let name = $state('');
	let identifier = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let error = $state('');

	async function handleSubmit(e) {
		e.preventDefault();

		loading = true;
		error = '';

		if (loginMethod === 'otp') {
			if (!isOtpSent) {
				await sendOtp();
			} else {
				await verifyOtp();
			}
		} else {
			if (isRegistering) {
				await signupWithPassword();
			} else {
				await loginWithPassword();
			}
		}

		loading = false;
	}

	async function sendOtp() {
		try {
			const isEmail = identifier.includes('@');

			if (isEmail) {
				// Email OTP — use Appwrite's built-in email token
				const token = await account.createEmailToken(ID.unique(), identifier);
				userId = token.userId;
				isPhoneOtp = false;
			} else {
				// Phone OTP — use our custom Twilio function
				let phone = identifier;
				if (!phone.startsWith('+')) {
					if (/^\d{10}$/.test(phone)) {
						phone = `+91${phone}`;
					} else {
						phone = `+${phone}`;
					}
				}

				const execution = await functions.createExecution(
					PHONE_OTP_FUNCTION_ID,
					JSON.stringify({ action: 'send-otp', phone, isRegistering }),
					false,
					'/',
					ExecutionMethod.POST
				);

				const result = JSON.parse(execution.responseBody);

				if (execution.responseStatusCode === 429) {
					throw new Error(result.error || 'Too many requests. Please wait before trying again.');
				}

				if (execution.responseStatusCode !== 200 || !result.success) {
					throw new Error(result.error || 'Failed to send OTP');
				}

				phoneForOtp = phone;
				isPhoneOtp = true;
			}

			isOtpSent = true;
			toast.success('OTP sent successfully');
		} catch (e) {
			console.error('OTP SEND FAILED:', e);
			error = e.message;
			toast.error(`Failed to send OTP: ${error}`);
		}
	}

	async function verifyOtp() {
		try {
			if (isPhoneOtp) {
				// Phone OTP — verify through our custom function
				const execution = await functions.createExecution(
					PHONE_OTP_FUNCTION_ID,
					JSON.stringify({
						action: 'verify-otp',
						phone: phoneForOtp,
						code: otp,
						name: isRegistering ? name : undefined,
						isRegistering
					}),
					false,
					'/',
					ExecutionMethod.POST
				);

				const result = JSON.parse(execution.responseBody);

				if (execution.responseStatusCode !== 200 || !result.success) {
					throw new Error(result.error || 'Verification failed');
				}

				// Create Appwrite session using the token from our function
				await account.createSession(result.userId, result.secret);
			} else {
				// Email OTP — use Appwrite's built-in session creation
				await account.createSession(userId, otp);

				if (isRegistering && name) {
					try {
						await account.updateName(name);
					} catch (nameError) {
						console.error('Failed to update name:', nameError);
					}
				}
			}

			await initAuth({ force: true });
			goto('/');
		} catch (e) {
			console.error('OTP VERIFICATION FAILED:', e);
			error = e.message;
			toast.error(`Verification failed: ${error}`);
		}
	}

	async function signupWithPassword() {
		if (password !== confirmPassword) {
			error = 'Passwords do not match';
			toast.error(error);
			return;
		}
		try {
			const loginEmail = identifier.includes('@') ? identifier : `${identifier}@metromale.local`;
			await account.create('unique()', loginEmail, password, name);
			await loginWithPassword();
		} catch (e) {
			console.error('SIGNUP FAILED:', e);
			error = e.message;
			toast.error(`Signup failed: ${error}`);
		}
	}

	async function loginWithPassword() {
		try {
			const loginEmail = identifier.includes('@') ? identifier : `${identifier}@metromale.local`;
			await account.createEmailPasswordSession(loginEmail, password);
			await initAuth({ force: true });
			goto('/');
		} catch (e) {
			console.error('LOGIN FAILED:', e);
			error = e.message;
			toast.error(`Login failed: ${error}`);
		}
	}

	async function handleLogout() {
		try {
			await account.deleteSession('current');
			clearAuth();
			goto('/');
		} catch (error) {
			console.error('Logout failed:', error);
			toast.error(`Logout failed: ${error}`);
		}
	}
</script>

<Toaster richColors />

{#if loading}
	<Modal
		text={loginMethod === 'otp'
			? isOtpSent
				? 'Verifying...'
				: 'Sending OTP...'
			: 'Logging in...'} />
{/if}

<div class="flex min-h-[80vh] flex-col items-center justify-center space-y-8 p-6">
	<div class="flex flex-col items-center space-y-4">
		<img src={logo} class="size-12 rounded-full" alt="" />
		<h1 class="text-center text-2xl font-medium tracking-tight text-gray-900">
			Metromale Clinic & Fertility Center
		</h1>
	</div>

	{#if !isAuthenticated.isAuthenticated}
		<div class="w-full max-w-md space-y-6 rounded-3xl bg-white p-6 shadow-lg/1 md:p-8">
			<!-- Header Section -->
			<div class="text-center">
				<h1 class="text-2xl font-bold text-gray-800">
					{#if loginMethod === 'otp' && isOtpSent}
						Verify OTP
					{:else if isRegistering}
						Create an Account
					{:else}
						Hello
					{/if}
				</h1>
				<p class="mt-1 text-sm text-gray-500">
					{#if loginMethod === 'otp' && isOtpSent}
						Enter the 6-digit code sent to your {identifier.includes('@') ? 'email' : 'phone'}.
					{:else if isRegistering}
						Please fill in the details to get started.
					{:else}
						Sign in to continue to your app.
					{/if}
				</p>
			</div>

			<!-- Tabs for Login Method -->
			<!-- {#if !(loginMethod === 'otp' && isOtpSent)}
				<div class="mb-6 flex space-x-2 rounded-xl bg-gray-100 p-1">
					<button
						type="button"
						class="w-1/2 rounded-lg py-2 text-sm font-medium transition-colors {loginMethod ===
						'otp'
							? 'bg-white text-gray-900 shadow-sm'
							: 'text-gray-500 hover:text-gray-700'}"
						onclick={() => {
							loginMethod = 'otp';
							error = '';
						}}>
						OTP
					</button>
					<button
						type="button"
						class="w-1/2 rounded-lg py-2 text-sm font-medium transition-colors {loginMethod ===
						'password'
							? 'bg-white text-gray-900 shadow-sm'
							: 'text-gray-500 hover:text-gray-700'}"
						onclick={() => {
							loginMethod = 'password';
							error = '';
						}}>
						Password
					</button>
				</div>
			{/if} -->

			<!-- Form Element -->
			<form onsubmit={handleSubmit} class="space-y-4">
				{#if !(loginMethod === 'otp' && isOtpSent)}
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
									required
									placeholder="Full Name"
									class="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 pl-10 text-sm text-gray-700 transition focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-200 focus:outline-none" />
							</div>
						</div>
					{/if}

					<!-- Email/Phone Field -->
					<div>
						<label for="identifier" class="sr-only block text-sm font-medium text-gray-700"
							>Email</label>
						<div class="relative">
							<span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
								<Icon icon="ph:user" class="size-5 text-gray-400" />
							</span>
							<input
								type="text"
								id="identifier"
								bind:value={identifier}
								required
								placeholder="Email"
								class="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 pl-10 text-sm text-gray-700 transition focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-200 focus:outline-none" />
						</div>
					</div>

					<!-- Password Fields -->
					{#if loginMethod === 'password'}
						<div>
							<label for="password" class="sr-only block text-sm font-medium text-gray-700"
								>Password</label>
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
									class="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 pl-10 text-sm text-gray-700 transition focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-200 focus:outline-none" />
							</div>
						</div>

						<!-- Confirm Password Field -->
						{#if isRegistering}
							<div>
								<label for="confirmPassword" class="sr-only block text-sm font-medium text-gray-700"
									>Confirm Password</label>
								<div class="relative">
									<span
										class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
										<Icon icon="ph:lock" class="size-5 text-gray-400" />
									</span>
									<input
										type="password"
										id="confirmPassword"
										bind:value={confirmPassword}
										required
										placeholder="Confirm Password"
										class="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 pl-10 text-sm text-gray-700 transition focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-200 focus:outline-none" />
								</div>
							</div>
						{/if}
					{/if}
				{:else}
					<!-- OTP Field -->
					<div>
						<label for="otp" class="sr-only block text-sm font-medium text-gray-700">OTP</label>
						<div class="relative">
							<span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
								<Icon icon="ph:lock" class="size-5 text-gray-400" />
							</span>
							<input
								type="text"
								id="otp"
								bind:value={otp}
								required
								placeholder="Enter 6-digit OTP"
								class="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 pl-10 text-sm tracking-widest text-gray-700 transition focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-200 focus:outline-none" />
						</div>
					</div>
				{/if}

				<!-- Submit Button -->
				<button
					type="submit"
					class="w-full rounded-xl bg-primary px-5 py-3 text-sm font-medium text-white shadow-sm transition-transform hover:scale-[1.02] hover:bg-orange-500 focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:outline-none">
					{#if loginMethod === 'password'}
						{#if isRegistering}
							Create Account
						{:else}
							Sign In
						{/if}
					{:else if isOtpSent}
						Verify OTP
					{:else}
						Send OTP
					{/if}
				</button>

				{#if loginMethod === 'otp' && isOtpSent}
					<button
						type="button"
						onclick={() => {
							isOtpSent = false;
							isPhoneOtp = false;
							phoneForOtp = '';
							otp = '';
						}}
						class="mt-3 w-full rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-sm transition-transform hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 focus:outline-none">
						Change Email / Phone
					</button>
				{/if}
			</form>

			<!-- Toggle between Login/Register -->
			{#if !(loginMethod === 'otp' && isOtpSent)}
				<div class="mb-2 flex items-center justify-center text-center text-sm text-gray-600">
					{#if isRegistering}
						<p>Already have an account?</p>
						<button
							onclick={() => (isRegistering = !isRegistering)}
							class="ml-1 font-medium text-orange-400 transition hover:text-orange-500 hover:underline">
							Sign In
						</button>
					{:else}
						<p>Don't have an account?</p>
						<button
							onclick={() => (isRegistering = !isRegistering)}
							class="ml-1 font-medium text-orange-400 transition hover:text-orange-500 hover:underline">
							Register
						</button>
					{/if}
				</div>
			{/if}
			<p class="text-center text-sm text-gray-600">
				Go to the <a href="/" class="text-orange-400 hover:underline">home page</a>.
			</p>
		</div>
	{:else}
		<div class="space-y-4 text-center">
			<h2 class="text-2xl font-bold text-gray-800">You are already logged in!</h2>
			<button
				onclick={handleLogout}
				class="w-full rounded-xl bg-orange-400 px-5 py-3 text-sm font-medium text-white shadow-sm transition-transform hover:scale-[1.02] hover:bg-orange-500 focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:outline-none">
				Logout
			</button>
			<p class="mt-2 text-gray-600">
				Go to the <a href="/" class="text-orange-400 hover:underline">home page</a>.
			</p>
		</div>
	{/if}
</div>
