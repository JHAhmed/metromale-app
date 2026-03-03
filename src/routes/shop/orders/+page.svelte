<!-- routes/shop/orders/+page.svelte -->
<script>
	import Icon from '@iconify/svelte';
	import { getUserOrders } from '$lib/tables/orders';
	import { user } from '$lib/stores/auth.svelte';
	import { goto } from '$app/navigation';

	// Status color mapping
	function getStatusColor(status) {
		const colors = {
			pending: 'bg-yellow-100 text-yellow-700',
			processing: 'bg-blue-100 text-blue-700',
			shipped: 'bg-purple-100 text-purple-700',
			delivered: 'bg-green-100 text-green-700',
			cancelled: 'bg-red-100 text-red-700'
		};
		return colors[status] || 'bg-gray-100 text-gray-700';
	}

	// Payment status color mapping
	function getPaymentStatusColor(paymentStatus) {
		const colors = {
			paid: 'bg-green-100 text-green-700',
			unpaid: 'bg-amber-100 text-amber-700',
			refunded: 'bg-gray-100 text-gray-700'
		};
		return colors[paymentStatus] || 'bg-gray-100 text-gray-700';
	}

	function formatDate(dateString) {
		return new Intl.DateTimeFormat('en-IN', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		}).format(new Date(dateString));
	}
</script>

<svelte:head>
	<title>My Orders - Metromale Shop</title>
</svelte:head>

<section class="min-h-screen p-4 md:p-8">
	<div class="mx-auto max-w-3xl">
		{#await getUserOrders(user?.user?.$id)}
			<div class="py-12 text-center">
				<Icon icon="ph:package" class="mx-auto mb-4 size-12 animate-pulse text-gray-400" />
				<h2 class="mb-2 text-lg font-medium text-gray-700">Loading Orders...</h2>
				<p class="text-gray-600">Please wait...</p>
			</div>
		{:then ordersData}
			{#if ordersData.total === 0}
				<div class="py-12 text-center">
					<Icon icon="ph:package" class="mx-auto mb-4 size-12 text-gray-400" />
					<h2 class="mb-2 text-lg font-medium text-gray-700">No orders yet</h2>
					<p class="mb-6 text-gray-600">Start shopping to place your first order.</p>
					<a
						href="/shop"
						class="inline-flex items-center rounded-full bg-amber-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-amber-700 active:scale-[0.98]">
						<Icon icon="ph:storefront" class="mr-2 size-4" />
						Browse Shop
					</a>
				</div>
			{:else}
				<div class="mb-6 flex items-center justify-between">
					<h1 class="text-2xl font-semibold text-gray-800">My Orders</h1>
					<span class="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
						{ordersData.total}
						{ordersData.total === 1 ? 'order' : 'orders'}
					</span>
				</div>

				<div class="space-y-4">
					{#each ordersData.rows as order (order.$id)}
						<a
							href="/shop/orders/{order.$id}"
							class="block rounded-3xl bg-white p-5 shadow-lg transition-all hover:shadow-xl active:scale-[0.99]">
							<div class="flex items-start justify-between">
								<div class="flex-1">
									<div class="mb-2 flex items-center gap-2">
										<span class="font-mono text-sm text-gray-500"
											>#{order.orderId?.slice(-8) || order.$id.slice(-8)}</span>
										<span class="text-gray-300">•</span>
										<span class="text-sm text-gray-500">{formatDate(order.$createdAt)}</span>
									</div>
									<p class="mb-3 text-lg font-semibold text-gray-800">
										₹{order.totalAmount?.toFixed(2) || '0.00'}
									</p>
									<div class="flex flex-wrap items-center gap-2">
										<span
											class={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
											{order.status}
										</span>
										<span
											class={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${getPaymentStatusColor(order.paymentStatus)}`}>
											{order.paymentStatus}
										</span>
										<span class="text-xs text-gray-500">
											{order.itemCount}
											{order.itemCount === 1 ? 'item' : 'items'}
										</span>
									</div>
								</div>
								<Icon icon="ph:caret-right" class="size-5 text-gray-400" />
							</div>
						</a>
					{/each}
				</div>
			{/if}
		{:catch error}
			<div class="py-12 text-center">
				<Icon icon="ph:warning-circle" class="mx-auto mb-4 size-12 text-red-400" />
				<h2 class="mb-2 text-lg font-medium text-gray-700">Error loading orders</h2>
				<p class="mb-6 text-gray-600">{error.message}</p>
				<button
					onclick={() => window.location.reload()}
					class="inline-flex items-center rounded-full bg-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-300">
					<Icon icon="ph:arrow-clockwise" class="mr-2 size-4" />
					Retry
				</button>
			</div>
		{/await}
	</div>
</section>
