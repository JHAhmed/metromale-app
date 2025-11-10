<script>
    import Icon from '@iconify/svelte';
    import { getUserAppointments } from '$lib/tables/appointments';
    import { user } from '$lib/stores/auth.svelte';
    import Appointment from '$lib/components/Appointment.svelte';

    // Helper function to format dates and times
    function formatDateTime(dateString, options) {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-GB', options).format(date);
    }

    // Function to separate appointments by time
    function categorizeAppointments(appointments) {
        const now = new Date();
        const future = [];
        const past = [];

        appointments.forEach(appt => {
            const apptDate = new Date(appt.appointmentDatetime);
            if (apptDate >= now) {
                future.push(appt);
            } else {
                past.push(appt);
            }
        });

        // Sort future appointments by date (earliest first)
        future.sort((a, b) => new Date(a.appointmentDatetime) - new Date(b.appointmentDatetime));
        
        // Sort past appointments by date (most recent first)
        past.sort((a, b) => new Date(b.appointmentDatetime) - new Date(a.appointmentDatetime));

        return {
            next: future[0] || null,
            upcoming: future.slice(1),
            past: past
        };
    }
</script>

<section class="p-4 md:p-8">
    <div class="mx-auto max-w-3xl">
        {#await getUserAppointments(user?.user?.$id)}
            <div class="py-12 text-center">
                <Icon icon="ph:calendar" class="mx-auto mb-4 size-12 text-gray-400" />
                <h2 class="mb-2 text-lg font-medium text-gray-700">Loading Appointments...</h2>
                <p class="mb-6 text-gray-600">Please wait...</p>
            </div>
        {:then appointmentsData}
            {@const { next, upcoming, past } = categorizeAppointments(appointmentsData.rows)}
            
            {#if appointmentsData.total === 0}
                <div class="py-12 text-center">
                    <Icon icon="ph:calendar-x" class="mx-auto mb-4 size-12 text-gray-400" />
                    <h2 class="mb-2 text-lg font-medium text-gray-700">No appointments yet</h2>
                    <p class="mb-6 text-gray-600">Book your first appointment to get started.</p>
                    <a
                        href="/appointments/new"
                        class="inline-flex items-center rounded-full bg-red-400 px-6 py-3 text-sm font-semibold text-white active:bg-red-500 active:scale-99">
                        <Icon icon="ph:calendar-plus" class="mr-2 size-4" />
                        Book Now
                    </a>
                </div>
            {:else}
                <div class="mb-6 flex items-center justify-between">
                    <h1 class="text-2xl font-semibold text-gray-800">Appointments</h1>
                    <a href="/appointments/new" class="group flex items-center gap-2 rounded-full bg-red-400 px-4 py-2 text-sm font-medium text-white transition-all focus:outline-none active:scale-[98%] active:bg-red-500">
                        <Icon icon="mdi:plus" class="h-5 w-5 transition-transform group-active:rotate-90" />
                        Book New
                    </a>
                </div>

                {#if next}
                    <div class="mb-10">
                        <h3 class="mb-2 text-sm font-medium uppercase tracking-wide text-gray-500">Next Appointment</h3>
                        <div class="relative overflow-hidden rounded-3xl bg-white/80 p-6 shadow-lg/1 backdrop-blur-md">
                            <div class="flex items-start justify-between">
                                <div>
                                    <p class="text-xl font-semibold text-gray-900">{next.patientName}</p>
                                    <p class="text-sm text-gray-600">{next.branch}</p>
                                </div>
                            </div>
                            <div class="mt-4 border-t border-gray-200 pt-4">
                                <div class="flex items-center gap-3 text-gray-700">
                                    <Icon icon="ph:calendar-blank" class="h-5 w-5 text-gray-500" />
                                    <span class="font-medium">
                                        {formatDateTime(next.appointmentDatetime, { dateStyle: 'full' })}
                                    </span>
                                </div>
                                <div class="mt-2 flex items-center gap-3 text-gray-700">
                                    <Icon icon="ph:clock" class="h-5 w-5 text-gray-500" />
                                    <span class="font-medium">
                                        {formatDateTime(next.appointmentDatetime, { timeStyle: 'short' })}
                                    </span>
                                </div>
                            </div>
                            <a href="/appointments/{next.$id}" class="mt-6 block cursor-pointer w-full rounded-xl bg-primary py-2.5 text-center text-sm font-medium text-white transition-all hover:bg-primary/80 hover:shadow-sm">
                                View Details
                            </a>
                        </div>
                    </div>
                {/if}

                <div class="mb-10">
                    <h3 class="mb-2 text-sm font-medium uppercase tracking-wide text-gray-500">Upcoming Appointments</h3>
                    <div class="space-y-4">
                        {#if upcoming.length > 0}
                            {#each upcoming as appointment (appointment.$id)}
                                <Appointment {appointment} />
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
                        {#if past.length > 0}
                            {#each past as appointment (appointment.$id)}
                                <Appointment {appointment} />
                            {/each}
                        {:else}
                            <div class="rounded-xl border border-dashed border-gray-200 bg-white/50 p-8 text-center backdrop-blur-sm">
                                <p class="text-gray-500">No past appointments found.</p>
                            </div>
                        {/if}
                    </div>
                </div>
            {/if}
        {:catch error}
            <div class="py-12 text-center">
                <Icon icon="ph:warning-circle" class="mx-auto mb-4 size-12 text-red-400" />
                <h2 class="mb-2 text-lg font-medium text-gray-700">Error loading appointments</h2>
                <p class="mb-6 text-gray-600">{error.message}</p>
            </div>
        {/await}
    </div>
</section>