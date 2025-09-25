import createKindeClient from '@kinde-oss/kinde-auth-pkce-js';
import { Capacitor } from '@capacitor/core';

let kinde;

export async function initKinde() {
	if (!kinde) {

		const isMobile = Capacitor.isNativePlatform();

		const redirectUri = isMobile
			? `com.metromaleclinic.metromale://kinde_callback`
			: window.location.origin;

		const logoutUri = isMobile
			? `com.metromaleclinic.metromale://kinde_logoutcallback`
			: window.location.origin;

		kinde = await createKindeClient({
			client_id: '6aeb90ef7412451791fa455a151da3aa', // From Kinde
			domain: 'https://metromale.kinde.com',
			
			redirect_uri: redirectUri,
			logout_uri: logoutUri,
			scope: 'openid profile email offline',
			is_dangerously_use_local_storage: true, 
			on_redirect_callback: (appState) => {
				const target = appState?.targetUrl ?? '/';
				window.location.replace(target);
			}
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
