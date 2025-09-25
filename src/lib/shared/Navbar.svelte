<script>
	import Icon from '@iconify/svelte';
	import { page } from '$app/stores';

	const navItems = [
		{
			href: '/appointments',
			label: 'Appointments',
			icon: 'ph:calendar-blank-duotone',
			iconFilled: 'ph:calendar-blank-fill'
		},
		{
			href: '/shop',
			label: 'Shopping',
			icon: 'ph:shopping-cart-duotone',
			iconFilled: 'ph:shopping-cart-fill'
		},
		{
			href: '/',
			label: 'Dashboard',
			icon: 'ph:house-simple-duotone',
			iconFilled: 'ph:house-simple-fill'
		},
		{
			href: '/profile',
			label: 'Profile',
			icon: 'ph:user-circle-duotone',
			iconFilled: 'ph:user-circle-fill'
		},
		{ href: '/more', label: 'Others', icon: 'ph:list', iconFilled: 'ph:list-bold' }
	];

	let activeHref = $derived($page.url.pathname);
</script>

<!-- <nav class="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white"> -->
<nav class="fixed rounded-2xl mx-2 my-2 inset-x-0 bottom-0 z-50 border-gray-200 bg-white/80 backdrop-blur-xs shadow-2xl/5">
	<div class="mx-auto flex h-16 max-w-md">
		{#each navItems as item}
			<a href={item.href} class="flex flex-1 flex-col items-center justify-center text-center">
				<Icon
					icon={activeHref === item.href ? item.iconFilled : item.icon}
					class="h-6 w-6 {activeHref === item.href ? 'text-yellow-500' : 'text-gray-600'}"
				/>
				<!-- <span class="text-xs">{item.label}</span> -->
			</a>
		{/each}
	</div>

    
</nav>

<!-- <div class="h-10 inset-x-0 fixed bottom-0 bg-white"></div> -->

<div class="h-16"></div>
