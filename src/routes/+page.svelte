<script>
	import Icon from '@iconify/svelte';
    import { isAuthenticated } from '$lib/stores/auth.svelte';
</script>

<div class="space-y-4 p-4 md:p-6">
	<h1 class="text-lg font-medium text-center text-gray-700">Dashboard</h1>

	<div
		class="relative flex flex-col items-center justify-center rounded-3xl bg-white p-6 shadow-lg/1"
	>
		<div class="flex h-32 w-full flex-col items-center justify-center space-y-6">
			<Icon icon="ph:stethoscope" class="size-8 text-gray-400" />
			<h2 class="text-center font-medium text-gray-700">
                {isAuthenticated.isAuthenticated ? 'No Upcoming Appointments' : 'Login to view Appointments'}
            </h2>
		</div>

		<!-- <button class="mx-auto mt-auto text-sm items-center justify-center text-white inline-flex right-2 transform rounded-full bg-amber-900 p-1 shadow-lg">
            <span class="mx-3">Add Appointment</span>
            <Icon icon="ph:plus" class="size-6 rounded-full p-0.5 bg-amber-600" />
            <span class="sr-only">Add Appointment</span>
        </button> -->

	</div>

	<div class="flex space-x-4">
		<div class="w-full rounded-3xl bg-white p-6 shadow-lg/1">
			<div class="flex h-32 w-full flex-col items-center justify-center space-y-6">
				<Icon icon="ph:clipboard-text" class="size-8 text-gray-400" />
				<h2 class="text-center font-medium text-gray-700">No Orders</h2>
			</div>
		</div>

		<div class="w-full rounded-3xl bg-red-400 p-6 shadow-lg/1">
			<div class="flex h-32 w-full flex-col items-center justify-center space-y-6">
				<Icon icon="ph:asclepius" class="size-8 text-white" />
				<h2 class="text-center font-medium text-white">Book Appointment</h2>

				<!-- <button class="mx-auto mt-auto items-center justify-center text-white inline-flex rounded-full">
					<Icon icon="ph:plus" class="size-8 rounded-full p-0.5 bg-white/50" />
					<span class="sr-only">Add Appointment</span>
				</button> -->
				
			</div>
		</div>
	</div>
</div>

<!-- ─── Latest From Dr. Karthik ────────────────────────────────────────────── -->
<div class="space-y-4 p-4 md:p-6">
	<h2 class="text-lg font-medium text-center text-gray-700">Latest from Dr. Karthik Gunasekaran</h2>

	<a
		href="/podcasts/latest"
		class="block rounded-3xl bg-white p-6 shadow-lg/1 transition-transform hover:scale-[1.02]"
	>
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
		class="block rounded-3xl bg-white p-6 shadow-lg/1 transition-transform hover:scale-[1.02]"
	>
		<div class="flex items-center space-x-4">
			<Icon icon="ph:article" class="size-8 text-emerald-500" />
			<div class="flex flex-col">
				<h3 class="font-medium text-gray-700">Understanding Erectile Dysfunction</h3>
				<p class="text-xs text-gray-500">4-min read • Sep 25</p>
			</div>
		</div>
	</a>

</div>
