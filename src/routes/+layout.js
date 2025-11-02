export const prerender = true;
export const ssr = false;

import { goto } from '$app/navigation';
import { account } from '$lib/appwrite.js';
import { isAuthenticated, user } from '$lib/stores/auth.svelte.js';
import { cart } from '$lib/stores/cart.svelte.js';
import { loadProducts } from '$lib/stores/products.svelte.js';
import { storageAdapter } from '$lib/utils/storageAdapter.js';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

let isNativeReady = false;
const publicRoutes = ['/', '/auth/login', '/auth/register', '/about'];

export async function load({ url }) {

	if (Capacitor.isNativePlatform() && !isNativeReady) {
		await StatusBar.setOverlaysWebView({ overlay: false });
		await StatusBar.setBackgroundColor({ color: '#ffffff' });
		await StatusBar.setStyle({ style: Style.Light });
		isNativeReady = true;
	}

	let appwriteUser = null;

	try {
		try {
			appwriteUser = await account.get();
		} catch (error) {
			console.error('Error fetching user:', error);
		}

		const isAuth = !!appwriteUser?.$id;

		isAuthenticated.isAuthenticated = isAuth;

		if (isAuth) {
			user.user = appwriteUser;

		try {
			const storedCart = await storageAdapter.getObject('cart');
			cart.items = storedCart.items || [];

			await loadProducts();
		} catch (error) {
			console.log('No stored current cart found:', error);
			await storageAdapter.setObject('cart', cart);
		}

		} else {
			user.user = null;
			if (!publicRoutes.includes(url.pathname)) {
				goto('/auth/login');
				return {};
			}
		}
	} catch (e) {
		isAuthenticated.isAuthenticated = false;
		user.user = null;

		if (e instanceof Response && e.status >= 300 && e.status <= 399) {
			throw e; // Re-throw the redirect to SvelteKit
		}
		console.error('Auth check failed:', e);
	}

	return {};
}
