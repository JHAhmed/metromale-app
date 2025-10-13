<script>
    import Icon from '@iconify/svelte';
    import { isAuthenticated } from '$lib/stores/auth.svelte';

    const dummyAppointments = [
        {
            id: 1,
            doctorName: 'Dr. Arjun Sharma',
            specialty: 'Andrology',
            date: '2025-09-23T11:00:00',
            type: 'Virtual Consultation'
        },
        {
            id: 2,
            doctorName: 'Dr. Vikram Singh',
            specialty: 'Urology',
            date: '2025-10-05T14:30:00',
            type: 'In-Person Visit'
        },
        {
            id: 3,
            doctorName: 'Dr. Arjun Sharma',
            specialty: 'Andrology',
            date: '2025-10-28T09:00:00',
            type: 'Follow-up'
        },
    ];

    // Separate the next appointment from the rest
    let nextAppointment = null;
    let upcomingAppointments = [];

    if (isAuthenticated.isAuthenticated) {
        nextAppointment = dummyAppointments[0];
        upcomingAppointments = dummyAppointments.slice(1);
    }

    // Helper function to format dates and times
    function formatDateTime(dateString, options) {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-IN', options).format(date);
    }
</script>

<div class="space-y-4 p-4 md:p-6">
    <h1 class="text-lg font-medium text-center text-gray-700">Appointments</h1>

    {#if isAuthenticated.isAuthenticated}
        {#if nextAppointment}
            <div class="relative flex flex-col items-center justify-center rounded-3xl bg-white p-6 shadow-lg/1">
                <div class="flex h-32 w-full flex-col items-center justify-center space-y-6">
                    <Icon icon="ph:stethoscope" class="size-8 text-gray-400" />
                    <h2 class="text-center font-medium text-gray-700">Next Appointment</h2>
                </div>

                <div class="w-full mt-4">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="font-medium text-gray-700">{nextAppointment.doctorName}</p>
                            <p class="text-sm text-gray-500">{nextAppointment.specialty} • {nextAppointment.type}</p>
                        </div>
                    </div>
                    <div class="mt-2 flex items-center gap-3 text-gray-700">
                        <Icon icon="ph:calendar-blank" class="size-5 text-gray-500" />
                        <span>{formatDateTime(nextAppointment.date, { dateStyle: 'full' })}</span>
                    </div>
                    <div class="mt-1 flex items-center gap-3 text-gray-700">
                        <Icon icon="ph:clock" class="size-5 text-gray-500" />
                        <span>{formatDateTime(nextAppointment.date, { timeStyle: 'short' })}</span>
                    </div>
                    <a href="/appointments/{nextAppointment.id}" class="mt-4 block w-full rounded-full bg-primary py-2 text-center text-sm font-medium text-white transition-all hover:bg-primary/90">
                        View Details
                    </a>
                </div>
            </div>
        {:else}
            <div class="relative flex flex-col items-center justify-center rounded-3xl bg-white p-6 shadow-lg/1">
                <div class="flex h-32 w-full flex-col items-center justify-center space-y-6">
                    <Icon icon="ph:stethoscope" class="size-8 text-gray-400" />
                    <h2 class="text-center font-medium text-gray-700">No Upcoming Appointments</h2>
                </div>
            </div>
        {/if}

        <h2 class="text-lg font-medium text-center text-gray-700">Upcoming Appointments</h2>

        {#if upcomingAppointments.length > 0}
            {#each upcomingAppointments as appt}
                <a
                    href="/appointments/{appt.id}"
                    class="block rounded-3xl bg-white p-6 shadow-lg/1 transition-transform hover:scale-[1.02]"
                >
                    <div class="flex items-center space-x-4">
                        <Icon icon="ph:calendar-blank" class="size-8 text-gray-400" />
                        <div class="flex flex-col">
                            <h3 class="font-medium text-gray-700">{appt.doctorName}</h3>
                            <p class="text-xs text-gray-500">{appt.specialty} • {formatDateTime(appt.date, { dateStyle: 'medium', timeStyle: 'short' })}</p>
                        </div>
                    </div>
                </a>
            {/each}
        {:else}
            <div class="rounded-3xl bg-white p-6 shadow-lg/1 text-center">
                <p class="text-gray-500">You have no other appointments scheduled.</p>
            </div>
        {/if}
    {:else}
        <div class="relative flex flex-col items-center justify-center rounded-3xl bg-white p-6 shadow-lg/1">
            <div class="flex h-32 w-full flex-col items-center justify-center space-y-6">
                <Icon icon="ph:stethoscope" class="size-8 text-gray-400" />
                <h2 class="text-center font-medium text-gray-700">Login to view Appointments</h2>
            </div>
        </div>
    {/if}

    <div class="flex justify-center">
        <a href="/appointments/book" class="inline-flex items-center justify-center rounded-full bg-red-400 px-6 py-3 text-white shadow-lg/1 transition-all hover:bg-red-500">
            <Icon icon="ph:plus" class="mr-2 size-5" />
            Book Appointment
        </a>
    </div>
</div>