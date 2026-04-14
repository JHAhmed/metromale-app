const APPOINTMENT_CHECKOUT_STORAGE_KEY = 'appointment-checkout-draft';

export function saveAppointmentCheckoutDraft(draft) {
	if (typeof window === 'undefined') return;

	window.sessionStorage.setItem(APPOINTMENT_CHECKOUT_STORAGE_KEY, JSON.stringify(draft));
}

export function getAppointmentCheckoutDraft() {
	if (typeof window === 'undefined') return null;

	const rawDraft = window.sessionStorage.getItem(APPOINTMENT_CHECKOUT_STORAGE_KEY);
	if (!rawDraft) return null;

	try {
		return JSON.parse(rawDraft);
	} catch (error) {
		console.error('Failed to parse appointment checkout draft:', error);
		window.sessionStorage.removeItem(APPOINTMENT_CHECKOUT_STORAGE_KEY);
		return null;
	}
}

export function clearAppointmentCheckoutDraft() {
	if (typeof window === 'undefined') return;

	window.sessionStorage.removeItem(APPOINTMENT_CHECKOUT_STORAGE_KEY);
}
