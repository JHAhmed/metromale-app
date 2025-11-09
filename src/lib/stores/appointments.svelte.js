import { getUserAppointments } from "$lib/tables/appointments";
import { user } from "./auth.svelte";

export const appointments = $state({
    items: []
});

export async function loadAppointments() {
    try {
        const data = await getUserAppointments(user?.user?.$id);
        appointments.items = data.rows || [];
    } catch (error) {
        console.error('Error loading appointments:', error);
    }
}