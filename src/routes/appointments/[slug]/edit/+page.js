import { error } from '@sveltejs/kit';
import { getAppointment } from '$lib/tables/appointments';

export const load = async ({ params }) => {
	try {
		const appointment = await getAppointment(params.slug);
		if (!appointment) {
			throw error(404, 'Appointment not found');
		}
		return { appointment };
	} catch (e) {
		throw error(404, 'Appointment not found');
	}
};
