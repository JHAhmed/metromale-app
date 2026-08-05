const dateFormatter = new Intl.DateTimeFormat('en-CA', {
	year: 'numeric',
	month: '2-digit',
	day: '2-digit'
});

function dateKey(value) {
	const timestamp = typeof value === 'number' ? value : Date.parse(value);
	if (Number.isNaN(timestamp)) return null;

	return dateFormatter.format(timestamp);
}

function getAppointmentDateKeys(appointment) {
	const appointmentDate = dateKey(appointment?.appointmentDatetime);
	const today = dateKey(Date.now());

	if (appointmentDate === null || today === null) return null;

	return { appointmentDate, today };
}

export function isUpcomingAppointment(appointment) {
	const dates = getAppointmentDateKeys(appointment);
	return dates !== null && dates.appointmentDate >= dates.today;
}

export function isAppointmentDateInPast(appointment) {
	const dates = getAppointmentDateKeys(appointment);
	return dates !== null && dates.appointmentDate < dates.today;
}

export function isExpiredPendingAppointment(appointment) {
	return appointment?.status === 'pending' && isAppointmentDateInPast(appointment);
}
