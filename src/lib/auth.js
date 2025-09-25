import createKindeClient from '@kinde-oss/kinde-auth-pkce-js';
import { Capacitor } from '@capacitor/core';

const isMobile = Capacitor.isNativePlatform();
let kinde;

// Will this work?
const redirectUri = isMobile
	? `com.metromaleclinic.metromale://wurks.kinde.com/kinde_callback`
	: window.location.origin;

const logoutUri = isMobile
	? `com.metromaleclinic.metromale://wurks.kinde.com/kinde_logoutcallback`
	: window.location.origin;


export async function initKinde() {
	if (!kinde) {
		kinde = await createKindeClient({
			client_id: '4c66c650a3d04088bd821c2192791ffe', // From Kinde
			domain: 'https://wurks.kinde.com',
			redirect_uri: redirectUri,
			logout_uri: logoutUri,
			scope: 'openid profile email offline',
			is_dangerously_use_local_storage: true // Dev only! Use custom domains in prod for secure cookies! TODO - What does this mean?
		});
	}

	return kinde;
}

// Helper to get access token
export async function getAccessToken() {
	const client = await initKinde();
	return client.getToken();
}

export async function logout() {
    const client = await initKinde();
    await client.logout();
}
