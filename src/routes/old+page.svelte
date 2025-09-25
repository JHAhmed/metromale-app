<script>
	import Icon from '@iconify/svelte';

	const items = [
		{
			text: 'Appointments',
			icon: 'ph:calendar-blank-duotone',
			href: '/appointments',
			description: 'View and manage your appointments'
		},
		{
			text: 'Shopping',
			icon: 'ph:shopping-cart-duotone',
			href: '/shop',
			description: 'Browse and purchase products'
		},
		{
			text: 'Profile',
			icon: 'ph:user-circle-duotone',
			href: '/profile',
			description: 'View and edit your profile information'
		},
		{
			text: 'More',
			icon: 'ph:list',
			href: '/more',
			description: 'Explore additional features and settings'
		}
	];
</script>

<div class="flex min-h-[80vh] flex-col items-center justify-center space-y-6 px-2">

	{#each items as item}
		<div class="flex w-full max-w-md overflow-hidden rounded-xl bg-white p-1 shadow-lg/5">

			<div class="flex size-20 flex-shrink-0 items-center justify-center rounded-xl bg-amber-100">
				<Icon icon={item.icon} class="h-8 w-8 text-yellow-600" />
			</div>

			<div class="flex flex-grow flex-col items-start justify-center px-4">
				<h2 class="text-lg font-bold text-gray-800 mb-1">{item.text}</h2>
				<p class="text-sm text-gray-600">{item.description}</p>
			</div>

			<a
				href={item.href}
				class="group inline-flex size-20 items-center justify-center rounded-xl bg-gray-100 font-semibold text-black transition-all duration-100 hover:bg-sky-200"
			>
				<Icon icon="mdi:chevron-right" class="size-8 text-gray-600 group-hover:text-sky-400" />
			</a>
		</div>
	{/each}
</div>
