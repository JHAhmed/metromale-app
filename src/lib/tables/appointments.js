import { tablesDB, ID, Query } from '$lib/appwrite';

export async function addAppointment(appointmentData) {
    try {
        const newAppointment = await tablesDB.createRow('metromale', 'appointments', ID.unique(), appointmentData);
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

export async function getAppointments() {
    try {
        const appointments = await tablesDB.listRows('metromale', 'appointments');
        return appointments;
    } catch (error) {
        console.error('Error fetching appointments:', error);
        return { rows: [], total: 0 };
    }
}
