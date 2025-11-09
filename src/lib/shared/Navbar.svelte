<script>
	import Icon, { loadIcon } from '@iconify/svelte';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { cart } from '$lib/stores/cart.svelte';

	onMount(async () => {
		const icons = [
			'ph:calendar-check-duotone',
			'ph:calendar-check-fill',
			'ph:shopping-cart-duotone',
			'ph:shopping-cart-fill',
			'ph:house-simple-duotone',
			'ph:house-simple-fill',
			'ph:article',
			'ph:article-fill',
		];

		await Promise.all(icons.map((i) => loadIcon(i)));
	});

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
			href: '/content',
			label: 'Content',
			icon: 'ph:article',
			iconFilled: 'ph:article-fill'
		},
		{ href: '/more', label: 'Others', icon: 'ph:list', iconFilled: 'ph:list-bold' }
	];

	let activeHrefRoot = $derived(page.url.pathname.split('/')[1] ? `/${page.url.pathname.split('/')[1]}` : '/');
	let itemCount = $derived(cart.items.reduce((sum, item) => sum + item.quantity, 0));
</script>

<!-- <nav class="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white"> -->
<nav class="fixed rounded-2xl mx-2 my-2 inset-x-0 bottom-0 z-10 border-gray-200 bg-white/80 backdrop-blur-xs shadow-2xl/5">
	<div class="mx-auto flex h-16 max-w-md">
		{#each navItems as item}
			<a href={item.href} class="flex flex-1 flex-col items-center justify-center text-center active:scale-95 active:opacity-80 transition-transform py-2">
				<Icon
					icon={activeHrefRoot === item.href ? item.iconFilled : item.icon}
					class="h-6 w-6 {activeHrefRoot === item.href ? 'text-primary' : 'text-gray-600'}"
				/>
				<!-- <span class="text-xs">{item.label}</span> -->
			</a>
		{/each}
	</div>

    
</nav>

<!-- <div class="h-10 inset-x-0 fixed bottom-0 bg-white"></div> -->

<div class="h-16"></div>
