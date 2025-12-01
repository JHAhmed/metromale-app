<script>
	import Icon from '@iconify/svelte';
	import { isAuthenticated, user } from '$lib/stores/auth.svelte';
	import { goto } from '$app/navigation';
	import { getPosts } from '$lib/tables/posts';
	import { iconMap } from '$lib';
	import { getLatestUserAppointment } from '$lib/tables/appointments';

	function formatDateTime(dateString, options) {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat('en-GB', options).format(date);
	}
</script>

<div class="space-y-4 p-4 md:p-8">
	<!-- <h1 class="text-lg font-medium text-center text-gray-700">Dashboard</h1> -->
	<h1 class="text-2xl font-semibold text-gray-800">Dashboard</h1>

	{#await getLatestUserAppointment(user?.user?.$id)}
		<div
			class="relative flex flex-col items-center justify-center rounded-3xl bg-white p-6 shadow-lg/1">
			<div class="flex h-32 w-full flex-col items-center justify-center space-y-6">
				<Icon icon="ph:stethoscope" class="size-8 text-gray-400" />
				<h2 class="text-center font-medium text-gray-700">
					{isAuthenticated.isAuthenticated
						? 'No Upcoming Appointments'
						: 'Login to view Appointments'}
				</h2>
			</div>
		</div>
	{:then appointment}
		<div
			class="relative flex flex-col items-center justify-center rounded-3xl bg-white p-6 shadow-lg/1">
			<div class="flex h-32 w-full flex-col items-center justify-center space-y-4">
				{#if appointment}
					<h2 class="text-center font-medium text-gray-700">Upcoming Appointment</h2>
					<div
						class="relative flex items-center justify-center bg-white p-2">
						<div class="flex items-start justify-between">
							<div>
								<p class="text-xl font-semibold text-gray-900">{appointment.patientName}</p>
								<p class="text-sm text-gray-600">{appointment.branch}</p>
							</div>
						</div>

						<div class="mx-4 h-[80%] w-px bg-gray-400"></div>

						<div class="">
							<div class="flex items-center gap-3 text-gray-700">
								<!-- <Icon icon="ph:calendar-blank" class="h-5 w-5 text-gray-500" /> -->
								<span class="font-medium">
									{formatDateTime(appointment.appointmentDatetime, { dateStyle: 'full' })}
								</span>
							</div>
						</div>
					</div>
				{:else}
					<Icon icon="ph:stethoscope" class="size-8 text-gray-400" />
					<h2 class="text-center font-medium text-gray-700">
						{isAuthenticated.isAuthenticated
							? 'No Upcoming Appointments'
							: 'Login to view Appointments'}
					</h2>
				{/if}
			</div>
		</div>
	{:catch error}
		<div
			class="relative flex flex-col items-center justify-center rounded-3xl bg-white p-6 shadow-lg/1">
			<div class="flex h-32 w-full flex-col items-center justify-center space-y-6">
				<Icon icon="ph:stethoscope" class="size-8 text-gray-400" />
				<h2 class="text-center font-medium text-gray-700">
					{isAuthenticated.isAuthenticated
						? 'No Upcoming Appointments'
						: 'Login to view Appointments'}
				</h2>
			</div>
		</div>
	{/await}

	<div class="flex space-x-4">
		<div class="w-full rounded-3xl bg-white p-6 shadow-lg/1">
			<div class="flex h-32 w-full flex-col items-center justify-center space-y-6">
				<Icon icon="ph:clipboard-text" class="size-8 text-gray-400" />
				<h2 class="text-center font-medium text-gray-700">No Orders</h2>
			</div>
		</div>

		<button
			onclick={() => goto('/appointments/new')}
			class="w-full rounded-3xl bg-red-400 p-6 shadow-lg/1 transition-transform active:scale-99 active:bg-red-500">
			<div class="flex h-32 w-full flex-col items-center justify-center space-y-6">
				<Icon icon="ph:asclepius" class="size-8 text-white" />
				<h2 class="text-center font-medium text-white">Book Appointment</h2>

				<!-- <button class="mx-auto mt-auto items-center justify-center text-white inline-flex rounded-full">
					<Icon icon="ph:plus" class="size-8 rounded-full p-0.5 bg-white/50" />
					<span class="sr-only">Add Appointment</span>
				</button> -->
			</div>
		</button>
	</div>
</div>

<!-- ─── Latest From Dr. Karthik ────────────────────────────────────────────── -->
<div class="space-y-4 p-4 md:p-8">
	<!-- <h2 class="text-lg font-medium text-center text-gray-700">Latest from Dr. Karthik Gunasekaran</h2> -->
	<h2 class="text-xl font-semibold text-gray-800">Latest from Dr. Karthik Gunasekaran</h2>

	{#await getPosts(2)}
		<div
			class="block animate-pulse rounded-3xl bg-white p-6 shadow-lg/1 transition-transform hover:scale-[1.02]">
			<div class="flex items-center space-x-4">
				<!-- <Icon icon="ph:headphones" class="size-8 text-amber-500" /> -->
				<div class="flex flex-col">
					<!-- <h3 class="font-medium text-gray-700">Podcast: Healthy Habits Q & A</h3>
					<p class="text-xs text-gray-500">18-min episode • New</p> -->
				</div>
			</div>
		</div>
	{:then products}
		{#each products.rows as post}
			<a
				href={post.type === 'video' ? post.youtubeUrl : `/content/${post.slug}`}
				class="block rounded-3xl bg-white p-6 shadow-lg/1 transition-transform hover:scale-[1.02]">
				<div class="flex items-center space-x-4">
					<Icon icon={iconMap[post.type].icon} class="size-8 shrink-0 {iconMap[post.type].color}" />
					<div class="flex flex-col">
						<h3 class="font-medium text-gray-700">{post.title}</h3>
						<p class="line-clamp-2 text-xs text-gray-500">{post.description}</p>
					</div>
				</div>
			</a>
		{/each}
	{:catch error}
		<div
			class="block animate-pulse rounded-3xl bg-white p-6 shadow-lg/1 transition-transform hover:scale-[1.02]">
			<div class="flex items-center space-x-4">
				<!-- <Icon icon="ph:headphones" class="size-8 text-amber-500" /> -->
				<div class="flex flex-col">
					<!-- <h3 class="font-medium text-gray-700">Podcast: Healthy Habits Q & A</h3>  -->
					<p class="text-xs text-red-700">Error loading content: {error.message}</p>
				</div>
			</div>
		</div>
	{/await}

	<!-- <a
		href="/podcasts/latest"
		class="block rounded-3xl bg-white p-6 shadow-lg/1 transition-transform hover:scale-[1.02]">
		<div class="flex items-center space-x-4">
			<Icon icon="ph:headphones" class="size-8 text-amber-500" />
			<div class="flex flex-col">
				<h3 class="font-medium text-gray-700">Podcast: Healthy Habits Q & A</h3>
				<p class="text-xs text-gray-500">18-min episode • New</p>
			</div>
		</div>
	</a>

	<a
		href="/podcasts/latest"
		class="block rounded-3xl bg-white p-6 shadow-lg/1 transition-transform hover:scale-[1.02]">
		<div class="flex items-center space-x-4">
			<Icon icon="ph:article" class="size-8 text-emerald-500" />
			<div class="flex flex-col">
				<h3 class="font-medium text-gray-700">Understanding Erectile Dysfunction</h3>
				<p class="text-xs text-gray-500">4-min read • Sep 25</p>
			</div>
		</div>
	</a> -->
</div>
