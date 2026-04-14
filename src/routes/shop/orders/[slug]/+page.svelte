<!-- routes/shop/orders/[slug]/+page.svelte -->
<script>
	import { goto } from '$app/navigation';
	import { toast, Toaster } from 'svelte-sonner';
	import Icon from '@iconify/svelte';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { getShopOrder } from '$lib/tables/shopOrders';

	const orderId = $derived(page.params.slug);

	let order = $state(null);
	let loading = $state(true);
	let items = $derived(parseItems(order?.items));

	onMount(async () => {
		try {
			order = await getShopOrder(orderId);
			if (!order) {
				toast.error('Order not found.');
				goto('/shop/orders');
			}
		} catch (error) {
			console.error('Failed to load order:', error);
			toast.error('Failed to load order details.');
			goto('/shop/orders');
		} finally {
			loading = false;
		}
	});

	function formatDate(dateStr) {
		return new Date(dateStr).toLocaleDateString('en-IN', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function parseItems(itemsStr) {
		if (!itemsStr) return [];
		try {
			return JSON.parse(itemsStr);
		} catch {
			return [];
		}
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
</script>

<Toaster richColors />

<svelte:head>
	<title>Order Details - Metromale Shop</title>
</svelte:head>

<div class="space-y-6 p-4 md:p-8">
	<!-- Back button -->
	<button
		class="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
		onclick={() => goto('/shop/orders')}
	>
		<Icon icon="ph:arrow-left-bold" class="size-5" />
		<span class="text-sm font-medium">Back to Orders</span>
	</button>

	{#if loading}
		<div class="flex flex-col items-center justify-center rounded-3xl bg-white p-12 shadow-lg/1">
			<Icon icon="ph:spinner" class="mb-4 size-10 animate-spin text-amber-600" />
			<p class="text-gray-500">Loading order details...</p>
		</div>
	{:else if order}
		<div class="mx-auto max-w-lg space-y-4">
			<!-- Order Status Header -->
			<div class="rounded-3xl bg-white p-6 shadow-lg/1">
				<div class="mb-4 flex items-center justify-between">
					<h1 class="text-xl font-bold text-gray-800">Order Details</h1>
					<div class="flex gap-2">
						<span class="rounded-full px-3 py-1 text-xs font-medium capitalize {getStatusColor(order.status)}">
							{order.status}
						</span>
						<span class="rounded-full px-3 py-1 text-xs font-medium capitalize {getPaymentColor(order.paymentStatus)}">
							{order.paymentStatus}
						</span>
					</div>
				</div>
				<p class="text-sm text-gray-500">
					Placed on {formatDate(order.$createdAt)}
				</p>
				{#if order.orderId}
					<p class="mt-1 text-xs text-gray-400">
						Order ID: {order.orderId}
					</p>
				{/if}
			</div>

			<!-- Items -->
			<div class="rounded-3xl bg-white p-6 shadow-lg/1">
				<h2 class="mb-4 text-lg font-semibold text-gray-800">
					<Icon icon="ph:package" class="mr-1 inline size-5" />
					Items ({order.itemCount})
				</h2>
				<div class="space-y-3">
					{#each items as item}
						<div class="flex items-center justify-between rounded-xl bg-gray-50 p-3">
							<div>
								<p class="text-sm font-medium text-gray-800">{item.name}</p>
								<p class="text-xs text-gray-500">
									₹{item.price?.toLocaleString()} × {item.quantity}
								</p>
							</div>
							<span class="text-sm font-semibold text-gray-800">
								₹{(item.price * item.quantity).toLocaleString()}
							</span>
						</div>
					{/each}
				</div>

				<!-- Total -->
				<div class="mt-4 border-t border-gray-100 pt-4">
					<div class="flex items-center justify-between text-lg">
						<span class="font-semibold text-gray-800">Total</span>
						<span class="font-bold text-amber-600">₹{order.totalAmount?.toLocaleString()}</span>
					</div>
				</div>
			</div>

			<!-- Shipping -->
			<div class="rounded-3xl bg-white p-6 shadow-lg/1">
				<h2 class="mb-4 text-lg font-semibold text-gray-800">
					<Icon icon="ph:map-pin" class="mr-1 inline size-5" />
					Shipping Details
				</h2>
				<div class="space-y-2 text-sm">
					<div class="flex justify-between">
						<span class="text-gray-500">Name</span>
						<span class="font-medium text-gray-800">{order.customerName}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-500">Email</span>
						<span class="font-medium text-gray-800">{order.customerEmail}</span>
					</div>
					{#if order.customerPhone}
						<div class="flex justify-between">
							<span class="text-gray-500">Phone</span>
							<span class="font-medium text-gray-800">{order.customerPhone}</span>
						</div>
					{/if}
					<div class="flex justify-between gap-4">
						<span class="shrink-0 text-gray-500">Address</span>
						<span class="text-right font-medium text-gray-800">{order.shippingAddress}</span>
					</div>
				</div>
			</div>

			<!-- Help -->
			<div class="text-center">
				<p class="text-sm text-gray-500">
					Need help with this order?
					<a href="/contact" class="font-medium text-amber-600 hover:text-amber-700">Contact Support</a>
				</p>
			</div>
		</div>
	{/if}
</div>
