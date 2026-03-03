<!-- routes/shop/orders/[id]/+page.svelte -->
<script>
	import Icon from '@iconify/svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { getOrder } from '$lib/tables/orders';

	// Get order ID from URL params
	let orderId = $derived($page.params.id);

	// Status color mapping
	function getStatusColor(status) {
		const colors = {
			pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
			processing: 'bg-blue-100 text-blue-700 border-blue-200',
			shipped: 'bg-purple-100 text-purple-700 border-purple-200',
			completed: 'bg-green-100 text-green-700 border-green-200',
			cancelled: 'bg-red-100 text-red-700 border-red-200'
		};
		return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
	}

	// Status icon mapping
	function getStatusIcon(status) {
		const icons = {
			pending: 'ph:hourglass',
			processing: 'ph:gear',
			shipped: 'ph:truck',
			completed: 'ph:check-circle',
			cancelled: 'ph:x-circle'
		};
		return icons[status] || 'ph:package';
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
			month: 'long',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		}).format(new Date(dateString));
	}

	function parseItems(itemsString) {
		try {
			return JSON.parse(itemsString);
		} catch {
			return [];
		}
	}
</script>

<svelte:head>
	<title>Order Details - Metromale Shop</title>
</svelte:head>

<section class="min-h-screen p-4 md:p-8">
	<div class="mx-auto max-w-2xl">
		<!-- Back button -->
		<button
			class="mb-4 flex items-center space-x-2 text-gray-600 hover:text-gray-800"
			onclick={() => goto('/shop/orders')}>
			<Icon icon="ph:arrow-left-bold" class="size-5" />
			<span class="text-sm font-medium">Back to Orders</span>
		</button>

		{#await getOrder(orderId)}
			<div class="py-12 text-center">
				<Icon icon="ph:package" class="mx-auto mb-4 size-12 animate-pulse text-gray-400" />
				<h2 class="mb-2 text-lg font-medium text-gray-700">Loading Order Details...</h2>
				<p class="text-gray-600">Please wait...</p>
			</div>
		{:then order}
			{#if !order}
				<div class="py-12 text-center">
					<Icon icon="ph:warning-circle" class="mx-auto mb-4 size-12 text-red-400" />
					<h2 class="mb-2 text-lg font-medium text-gray-700">Order not found</h2>
					<p class="mb-6 text-gray-600">This order doesn't exist or you don't have access to it.</p>
					<a
						href="/shop/orders"
						class="inline-flex items-center rounded-full bg-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-300">
						<Icon icon="ph:arrow-left" class="mr-2 size-4" />
						View All Orders
					</a>
				</div>
			{:else}
				{@const items = parseItems(order.items)}

				<!-- Order Header -->
				<div class="mb-6 rounded-3xl bg-white p-6 shadow-lg">
					<div class="mb-4 flex items-start justify-between">
						<div>
							<p class="mb-1 font-mono text-sm text-gray-500">
								Order #{order.orderId?.slice(-8) || order.$id.slice(-8)}
							</p>
							<p class="text-sm text-gray-500">{formatDate(order.$createdAt)}</p>
						</div>
						<div
							class={`flex items-center gap-2 rounded-full border px-3 py-1.5 ${getStatusColor(order.status)}`}>
							<Icon icon={getStatusIcon(order.status)} class="size-4" />
							<span class="text-sm font-medium capitalize">{order.status}</span>
						</div>
					</div>

					<!-- Status Timeline -->
					<div class="mt-4 border-t border-gray-100 pt-4">
						<div class="flex items-center justify-between">
							{#each ['pending', 'processing', 'shipped', 'completed'] as status, i}
								{@const statusIndex = ['pending', 'processing', 'shipped', 'completed'].indexOf(
									order.status
								)}
								{@const isCompleted = i <= statusIndex && order.status !== 'cancelled'}
								{@const isCurrent = i === statusIndex && order.status !== 'cancelled'}
								<div class="flex flex-col items-center">
									<div
										class={`flex size-8 items-center justify-center rounded-full ${isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
										{#if isCompleted}
											<Icon icon="ph:check" class="size-4" />
										{:else}
											<span class="text-xs font-medium">{i + 1}</span>
										{/if}
									</div>
									<span
										class={`mt-1 text-xs capitalize ${isCurrent ? 'font-semibold text-gray-800' : 'text-gray-500'}`}
										>{status}</span>
								</div>
								{#if i < 3}
									<div
										class={`h-0.5 flex-1 ${i < statusIndex && order.status !== 'cancelled' ? 'bg-green-500' : 'bg-gray-200'}`}>
									</div>
								{/if}
							{/each}
						</div>
					</div>
				</div>

				<!-- Order Items -->
				<div class="mb-6 rounded-3xl bg-white p-6 shadow-lg">
					<h2 class="mb-4 flex items-center space-x-2 text-lg font-semibold text-gray-800">
						<Icon icon="ph:shopping-bag" class="size-5" />
						<span>Order Items</span>
					</h2>
					<div class="space-y-3">
						{#each items as item}
							<div
								class="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0">
								<div class="flex items-center space-x-3">
									<span class="rounded-lg bg-gray-100 px-2 py-1 text-sm font-medium"
										>{item.quantity}x</span>
									<div>
										<p class="font-medium text-gray-800">{item.productName}</p>
										<p class="text-sm text-gray-500">₹{item.price?.toFixed(2) || '0.00'} each</p>
									</div>
								</div>
								<span class="font-semibold text-gray-800"
									>₹{(item.price * item.quantity).toFixed(2)}</span>
							</div>
						{/each}
					</div>

					<!-- Order Total -->
					<div class="mt-4 border-t border-gray-200 pt-4">
						<div class="flex items-center justify-between">
							<span class="font-medium text-gray-600">Subtotal</span>
							<span class="font-medium text-gray-800"
								>₹{order.totalAmount?.toFixed(2) || '0.00'}</span>
						</div>
						<div class="mt-2 flex items-center justify-between">
							<span class="font-medium text-gray-600">Delivery</span>
							<span class="font-medium text-green-600">Free</span>
						</div>
						<hr class="my-3 border-gray-200" />
						<div class="flex items-center justify-between text-lg">
							<span class="font-semibold text-gray-800">Total</span>
							<span class="font-bold text-amber-600"
								>₹{order.totalAmount?.toFixed(2) || '0.00'}</span>
						</div>
					</div>
				</div>

				<!-- Delivery Address -->
				<div class="mb-6 rounded-3xl bg-white p-6 shadow-lg">
					<h2 class="mb-4 flex items-center space-x-2 text-lg font-semibold text-gray-800">
						<Icon icon="ph:map-pin" class="size-5" />
						<span>Delivery Address</span>
					</h2>
					<p class="text-gray-700">{order.shippingAddress}</p>
				</div>

				<!-- Customer Details -->
				<div class="mb-6 rounded-3xl bg-white p-6 shadow-lg">
					<h2 class="mb-4 flex items-center space-x-2 text-lg font-semibold text-gray-800">
						<Icon icon="ph:user" class="size-5" />
						<span>Customer Details</span>
					</h2>
					<div class="space-y-2 text-sm text-gray-600">
						<div class="flex items-center space-x-2">
							<Icon icon="ph:user-circle" class="size-4" />
							<span>{order.customerName || 'N/A'}</span>
						</div>
						<div class="flex items-center space-x-2">
							<Icon icon="ph:envelope" class="size-4" />
							<span>{order.customerEmail || 'N/A'}</span>
						</div>
						<div class="flex items-center space-x-2">
							<Icon icon="ph:phone" class="size-4" />
							<span>{order.customerPhone || 'N/A'}</span>
						</div>
					</div>
				</div>

				<!-- Payment Info -->
				<div class="rounded-3xl bg-amber-50 p-6">
					<div class="flex items-center justify-between">
						<div class="flex items-center space-x-3">
							<Icon icon="ph:wallet" class="size-6 text-amber-600" />
							<div>
								<p class="font-semibold text-gray-800">Cash on Delivery</p>
								<p class="text-sm text-gray-600">Payment at the time of delivery</p>
							</div>
						</div>
						<span
							class={`rounded-full px-3 py-1 text-sm font-medium capitalize ${getPaymentStatusColor(order.paymentStatus)}`}>
							{order.paymentStatus}
						</span>
					</div>
				</div>
			{/if}
		{:catch error}
			<div class="py-12 text-center">
				<Icon icon="ph:warning-circle" class="mx-auto mb-4 size-12 text-red-400" />
				<h2 class="mb-2 text-lg font-medium text-gray-700">Error loading order</h2>
				<p class="mb-6 text-gray-600">{error.message}</p>
				<a
					href="/shop/orders"
					class="inline-flex items-center rounded-full bg-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-300">
					<Icon icon="ph:arrow-left" class="mr-2 size-4" />
					Back to Orders
				</a>
			</div>
		{/await}
	</div>
</section>
