import { tablesDB, ID, Query, Permission, Role } from '$lib/appwrite';

export async function addAppointment(appointmentData) {
    try {
        const newAppointment = await tablesDB.createRow(
            'metromale', 
            'appointments', 
            ID.unique(), 
            appointmentData,
            [
                Permission.read(Role.user(appointmentData.userId)),
                Permission.write(Role.user(appointmentData.userId))
            ]
        );
        return newAppointment;
    } catch (error) {
        console.error('Error creating appointment:', error);
        return null;
    }
}

export async function getAppointment(appointmentId) {
    if (!appointmentId) {
        console.error('Appointment ID is missing, cannot query appointments.');
        return { rows: [], total: 0 };
    }

    try {
        const appointment = await tablesDB.getRow('metromale', 'appointments', appointmentId);
        return appointment;
    } catch (error) {
        console.error('Error fetching appointment details');
        return null;
    }
}

export async function getUserAppointments(userId) {
    if (!userId) {
        console.error('User ID is missing, cannot query appointments.');
        return { rows: [], total: 0 };
    }

    try {

        const queries = [Query.equal('userId', userId)];

        const appointments = await tablesDB.listRows('metromale', 'appointments', queries);
        return appointments;
    } catch (error) {
        console.error('Error fetching appointments:', error);
        return { rows: [], total: 0 };
    }
}
