export const prerender = true;
export const ssr = false;

import { browser } from '$app/environment';
import { initAuth } from '$lib/auth/bootstrap.js';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

let isNativeReady = false;

async function setupNativeChrome() {
	try {
		await StatusBar.setOverlaysWebView({ overlay: false });
		await StatusBar.setBackgroundColor({ color: '#ffffff' });
		await StatusBar.setStyle({ style: Style.Light });
	} catch (e) {
		console.error('Native chrome setup failed:', e);
	}
}

export function load() {
	if (!browser) return {};

	void initAuth();

	if (Capacitor.isNativePlatform() && !isNativeReady) {
		isNativeReady = true;
		void setupNativeChrome();
	}
	return {};
}
