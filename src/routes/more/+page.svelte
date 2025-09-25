<script>
	import { logout } from '$lib/auth';
	import { isAuthenticated, user } from '$lib/stores/auth.svelte';
	import Icon from '@iconify/svelte';

	async function handleLogout() {
		try {
			await logout();
		} catch (error) {
			console.error('Logout failed:', error);
		}
	}

	// Example user data
	// const user = {
	//     name: "John Smith",
	//     email: "johnsmith@email.com",
	//     initials: "JS"
	// };

	// Menu options
	const menu = [
		{ icon: 'mdi:credit-card-outline', label: 'Payment Management' },
		{ icon: 'mdi:headphones', label: 'Help and Support' },
		{ icon: 'mdi:shield-check-outline', label: 'Safety' },
		{ icon: 'mdi:share-variant', label: 'Refer and Invite' },
		{ icon: 'mdi:information-outline', label: 'About Us' },
		{ icon: 'mdi:translate', label: 'App Language' }
		// { icon: "mdi:logout", label: "Logout", color: "text-red-500" }
	];
</script>

<div class="p-0 pt-10">
	<div class="mx-auto max-w-md px-4">
		<!-- Profile Card -->
		<div
			class="relative mb-8 flex flex-col items-center rounded-2xl bg-white/75 p-6 shadow-xl/2 backdrop-blur-lg"
		>
			<div class="flex flex-col items-center gap-2">
				<!-- <div class="w-16 h-16 rounded-full bg-gradient-to-br from-sky-200 to-emerald-100 flex items-center justify-center text-3xl font-bold text-gray-600 shadow-md">
                    {user.initials}
                </div> -->
				<div class="mt-2 text-lg font-semibold text-gray-900">{user.user.given_name}</div>
				<div class="h-px w-full bg-gray-200"></div>
				<div class="text-sm text-gray-500">{user.user.email}</div>
			</div>
		</div>

		<!-- Menu Card -->
		<div class="rounded-2xl bg-white/60 p-1 shadow backdrop-blur-lg">
			<ul class="space-y-1">
				{#each menu as item (item.label)}
					<li>
						<a
							href="#"
							class="group flex items-center rounded-xl px-5 py-4 transition-all hover:bg-sky-50"
						>
							<Icon
								icon={item.icon}
								class={'mr-4 size-5 text-gray-400 group-hover:text-sky-500 ' +
									(item.color ? item.color : '')}
							/>
							<span
								class={'flex-1 text-base font-medium ' +
									(item.color ? item.color : 'text-gray-900')}>{item.label}</span
							>
							<Icon
								icon="mdi:chevron-right"
								class="h-5 w-5 text-gray-300 group-hover:text-sky-400"
							/>
						</a>
					</li>
				{/each}
				<li>
					<button
						on:click={handleLogout}
						class="group w-full flex justify-start items-center text-left rounded-xl bg-red-200 px-5 py-4 transition-all hover:bg-red-300"
					>
						<Icon icon="mdi:logout" class={'mr-4 size-5 text-red-400 group-hover:text-red-500 '} />
						<span class="flex-1 text-base font-medium text-gray-900">Logout</span>
						<Icon icon="mdi:chevron-right" class="size-5 text-red-300 group-hover:text-red-400" />
					</button>
				</li>
			</ul>
		</div>

		<!-- Bottom Space -->
		<div class="h-14"></div>
	</div>
</div>
