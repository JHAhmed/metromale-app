import { tablesDB, ID, Query, Permission, Role } from '$lib/appwrite';

export async function addPatient(patientData) {
    try {
        const newPatient = await tablesDB.createRow(
            'metromale', 
            'patients', 
            ID.unique(), 
            patientData,
            [
                Permission.read(Role.user(patientData.associatedUserId)),
                Permission.write(Role.user(patientData.associatedUserId))
            ]
        );
        return newPatient;
    } catch (error) {
        console.error('Error creating patient:', error);
        return null;
    }
}

export async function getPatient(patientId) {
    if (!patientId) {
        console.error('Patient ID is missing, cannot query patients.');
        return { rows: [], total: 0 };
    }

    try {
        const patient = await tablesDB.getRow('metromale', 'patients', patientId);
        return patient;
    } catch (error) {
        console.error('Error fetching patient details');
        return null;
    }
}

export async function getUserPatients(userId) {
    if (!userId) {
        console.error('User ID is missing, cannot query patients.');
        return { rows: [], total: 0 };
    }

    try {

        const queries = [Query.equal('associatedUserId', userId)];

        const patients = await tablesDB.listRows('metromale', 'patients', queries);
        return patients;
    } catch (error) {
        console.error('Error fetching patients:', error);
        return { rows: [], total: 0 };
    }
}
