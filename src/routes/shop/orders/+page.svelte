<!-- routes/shop/orders/+page.svelte -->
<script>
	import { goto } from '$app/navigation';
	import { toast, Toaster } from 'svelte-sonner';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import { user } from '$lib/stores/auth.svelte.js';
	import { getUserShopOrders } from '$lib/tables/shopOrders';

	let orders = $state([]);
	let loading = $state(true);

	onMount(async () => {
		if (!user.user) {
			toast.error('Please log in to view your orders.');
			goto('/login');
			return;
		}

		try {
			const result = await getUserShopOrders(user.user.$id);
			orders = result.rows || [];
		} catch (error) {
			console.error('Failed to load orders:', error);
			toast.error('Failed to load your orders.');
		} finally {
			loading = false;
		}
	});

	function formatDate(dateStr) {
		return new Date(dateStr).toLocaleDateString('en-IN', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
	}

	function getStatusColor(status) {
		const colors = {
			confirmed: 'bg-green-100 text-green-800',
			pending: 'bg-yellow-100 text-yellow-800',
			shipped: 'bg-blue-100 text-blue-800',
			delivered: 'bg-emerald-100 text-emerald-800',
			cancelled: 'bg-red-100 text-red-800'
		};
		return colors[status] || 'bg-gray-100 text-gray-800';
	}

	function getPaymentColor(status) {
		const colors = {
			paid: 'bg-green-100 text-green-800',
			unpaid: 'bg-red-100 text-red-800',
			refunded: 'bg-yellow-100 text-yellow-800'
		};
		return colors[status] || 'bg-gray-100 text-gray-800';
	}

	function parseItems(itemsStr) {
		try {
			return JSON.parse(itemsStr);
		} catch {
			return [];
		}
	}
</script>

<Toaster richColors />

<svelte:head>
	<title>My Orders - Metromale Shop</title>
</svelte:head>

<div class="space-y-6 p-4 md:p-8">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-3">
			<button
				class="flex items-center text-gray-600 hover:text-gray-800"
				onclick={() => goto('/shop')}
			>
				<Icon icon="ph:arrow-left-bold" class="size-5" />
			</button>
			<h1 class="text-2xl font-semibold text-gray-800">My Orders</h1>
		</div>
	</div>

	{#if loading}
		<div class="flex flex-col items-center justify-center rounded-3xl bg-white p-12 shadow-lg/1">
			<Icon icon="ph:spinner" class="mb-4 size-10 animate-spin text-amber-600" />
			<p class="text-gray-500">Loading your orders...</p>
		</div>
	{:else if orders.length === 0}
		<div class="flex flex-col items-center justify-center rounded-3xl bg-white p-12 text-center shadow-lg/1">
			<Icon icon="ph:package" class="mb-4 size-12 text-gray-400" />
			<h2 class="mb-2 text-lg font-medium text-gray-700">No orders yet</h2>
			<p class="mb-6 text-sm text-gray-500">Start shopping to see your orders here.</p>
			<button
				class="rounded-full bg-amber-600 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-700"
				onclick={() => goto('/shop')}
			>
				Browse Shop
			</button>
		</div>
	{:else}
		<div class="space-y-4">
			{#each orders as order (order.$id)}
				{@const items = parseItems(order.items)}
				<button
					class="w-full rounded-2xl bg-white p-5 text-left shadow-lg/1 transition-transform hover:scale-[1.005] active:scale-[0.995]"
					onclick={() => goto(`/shop/orders/${order.$id}`)}
				>
					<!-- Order header -->
					<div class="mb-3 flex items-start justify-between gap-2">
						<div>
							<p class="text-xs text-gray-500">
								{formatDate(order.$createdAt)}
							</p>
							<p class="mt-0.5 text-sm font-semibold text-gray-800">
								{order.itemCount} item{order.itemCount !== 1 ? 's' : ''} · ₹{order.totalAmount?.toLocaleString()}
							</p>
						</div>
						<div class="flex gap-2">
							<span class="rounded-full px-2.5 py-0.5 text-xs font-medium capitalize {getStatusColor(order.status)}">
								{order.status}
							</span>
							<span class="rounded-full px-2.5 py-0.5 text-xs font-medium capitalize {getPaymentColor(order.paymentStatus)}">
								{order.paymentStatus}
							</span>
						</div>
					</div>

					<!-- Item names preview -->
					{#if items.length > 0}
						<div class="space-y-1">
							{#each items.slice(0, 3) as item}
								<p class="text-sm text-gray-600">
									{item.name} <span class="text-gray-400">×{item.quantity}</span>
								</p>
							{/each}
							{#if items.length > 3}
								<p class="text-xs text-gray-400">+{items.length - 3} more item{items.length - 3 !== 1 ? 's' : ''}</p>
							{/if}
						</div>
					{/if}

					<!-- Shipping address preview -->
					<div class="mt-3 flex items-center gap-2 text-xs text-gray-400">
						<Icon icon="ph:map-pin" class="size-3.5" />
						<span class="line-clamp-1">{order.shippingAddress}</span>
					</div>
				</button>
			{/each}
		</div>
	{/if}
</div>
