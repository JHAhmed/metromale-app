<script>
    import Icon from '@iconify/svelte';

    const dummyAppointments = [
        {
            id: 1,
            doctorName: 'Dr. Karthik Gunasekaran',
            specialty: 'Andrology',
            date: '2025-09-23T11:00:00',
            type: 'Virtual Consultation'
        },
        {
            id: 2,
            doctorName: 'Dr. Karthik Gunasekaran',
            specialty: 'Urology',
            date: '2025-10-05T14:30:00',
            type: 'In-Person Visit'
        },
        {
            id: 3,
            doctorName: 'Dr. Karthik Gunasekaran',
            specialty: 'Andrology',
            date: '2025-10-28T09:00:00',
            type: 'Follow-up'
        },

    ];

    // Separate the next appointment from the rest
    const nextAppointment = dummyAppointments[0];
    const upcomingAppointments = dummyAppointments.slice(1);

    // Helper function to format dates and times
    function formatDateTime(dateString, options) {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-IN', options).format(date);
    }
</script>

<section class="p-4 md:p-8">
    <div class="mx-auto max-w-3xl">
        <div class="mb-6 flex items-center justify-between">
            <h1 class="text-2xl font-semibold text-gray-800">Appointments</h1>
            <a href="/appointments/book" class="group flex items-center gap-2 rounded-full bg-red-400 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-red-500 hover:shadow-md focus:outline-none active:scale-[98%] active:bg-red-500">
                <Icon icon="mdi:plus" class="h-5 w-5 transition-transform group-active:rotate-90" />
                Book New
            </a>
        </div>

        <div class="mb-10">
            <h3 class="mb-2 text-sm font-medium uppercase tracking-wide text-gray-500">Next Appointment</h3>
            <div class="relative overflow-hidden rounded-3xl bg-white/80 p-6 shadow-lg/1 backdrop-blur-md">
                <div class="flex items-start justify-between">
                    <div>
                        <p class="text-xl font-semibold text-gray-900">{nextAppointment.doctorName}</p>
                        <p class="text-sm text-gray-600">{nextAppointment.specialty}</p>
                    </div>
                    <!-- <div class="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                        {nextAppointment.type}
                    </div> -->
                </div>
                <div class="mt-4 border-t border-gray-200 pt-4">
                    <div class="flex items-center gap-3 text-gray-700">
                        <Icon icon="ph:calendar-blank" class="h-5 w-5 text-gray-500" />
                        <span class="font-medium">
                            {formatDateTime(nextAppointment.date, { dateStyle: 'full' })}
                        </span>
                    </div>
                    <div class="mt-2 flex items-center gap-3 text-gray-700">
                        <Icon icon="ph:clock" class="h-5 w-5 text-gray-500" />
                        <span class="font-medium">
                            {formatDateTime(nextAppointment.date, { timeStyle: 'short' })}
                        </span>
                    </div>
                </div>
                <a href="/appointments/{nextAppointment.id}" class="mt-6 block cursor-pointer w-full rounded-xl bg-primary py-2.5 text-center text-sm font-medium text-white transition-all hover:bg-primary/80 hover:shadow-sm">
                    View Details
                </a>
            </div>
        </div>

        <div class="mb-10">
            <h3 class="mb-2 text-sm font-medium uppercase tracking-wide text-gray-500">Upcoming Appointments</h3>
            <div class="space-y-4">
                {#if upcomingAppointments.length > 0}
                    {#each upcomingAppointments as appt}
                        <a href="/appointments/{appt.id}" class="group flex items-center gap-4 rounded-3xl bg-white/80 shadow-lg/1 p-4 backdrop-blur-sm ">
                            <div class="flex flex-col items-center justify-center rounded-lg bg-gray-50 p-2 text-center shadow-sm">
                                <span class="text-xs font-bold uppercase text-gray-600">
                                    {formatDateTime(appt.date, { month: 'short' })}
                                </span>
                                <span class="text-lg font-bold text-gray-800">
                                    {formatDateTime(appt.date, { day: '2-digit' })}
                                </span>
                            </div>
                            <div class="flex-1">
                                <p class="font-medium text-gray-800">{appt.doctorName}</p>
                                <p class="text-sm text-gray-500">{appt.specialty}</p>
                            </div>
                            <div class="text-right">
                                <p class="text-sm font-medium text-gray-600">
                                    {formatDateTime(appt.date, { timeStyle: 'short' })}
                                </p>
                            </div>
                            <Icon icon="mdi:chevron-right" class="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1" />
                        </a>
                    {/each}
                {:else}
                    <div class="rounded-xl border border-dashed border-gray-200 bg-white/50 p-8 text-center backdrop-blur-sm">
                        <p class="text-gray-500">You have no other appointments scheduled.</p>
                    </div>
                {/if}
            </div>
        </div>

        <div>
            <h3 class="mb-2 text-sm font-medium uppercase tracking-wide text-gray-500">Past Appointments</h3>
            <div class="space-y-4">
                {#if upcomingAppointments.length > 0}
                    {#each upcomingAppointments as appt}
                        <a href="/appointments/{appt.id}" class="group flex items-center gap-4 rounded-3xl bg-white/80 shadow-lg/1 p-4 backdrop-blur-sm ">
                            <div class="flex flex-col items-center justify-center rounded-lg bg-gray-50 p-2 text-center shadow-sm">
                                <span class="text-xs font-bold uppercase text-gray-600">
                                    {formatDateTime(appt.date, { month: 'short' })}
                                </span>
                                <span class="text-lg font-bold text-gray-800">
                                    {formatDateTime(appt.date, { day: '2-digit' })}
                                </span>
                            </div>
                            <div class="flex-1">
                                <p class="font-medium text-gray-800">{appt.doctorName}</p>
                                <p class="text-sm text-gray-500">{appt.specialty}</p>
                            </div>
                            <div class="text-right">
                                <p class="text-sm font-medium text-gray-600">
                                    {formatDateTime(appt.date, { timeStyle: 'short' })}
                                </p>
                            </div>
                            <Icon icon="mdi:chevron-right" class="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1" />
                        </a>
                    {/each}
                {:else}
                    <div class="rounded-xl border border-dashed border-gray-200 bg-white/50 p-8 text-center backdrop-blur-sm">
                        <p class="text-gray-500">You have no other appointments scheduled.</p>
                    </div>
                {/if}
            </div>
        </div>


    </div>
</section>
