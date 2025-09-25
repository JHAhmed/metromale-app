// routes/+layout.js
export const prerender = true;
export const ssr = false;

import { initKinde } from '$lib/auth';
import { isLoading, isAuthenticated, user, kindeClient } from '$lib/stores/auth.svelte.js';
import { goto } from '$app/navigation'; 
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

let isNativeReady = false;

export async function load({ url }) {
    isLoading.isLoading = true;

    if (Capacitor.isNativePlatform() && !isNativeReady) {
        await StatusBar.setOverlaysWebView({ overlay: false });
        await StatusBar.setBackgroundColor({ color: '#ffffff' });
        await StatusBar.setStyle({ style: Style.Light });
        isNativeReady = true;
    }

    try {
        const kinde = await initKinde();
        const isAuth = await kinde.isAuthenticated();

        isAuthenticated.isAuthenticated = isAuth;
        kindeClient.client = kinde;

        if (isAuth) {
            user.user = await kinde.getUserProfile();
        } else {
            user.user = null;

            const publicRoutes = ['/auth/login', '/']; // Example: login and register pages

            if (!publicRoutes.includes(url.pathname)) {
                // goto('/auth/login');
                kindeClient.client.login();
                return {}; 
            }

            // if (url.pathname !== '/auth/login') {
            //     goto('/auth/login');
            //     return {}; 
            // }
        }

    } catch (e) {
        isAuthenticated.isAuthenticated = false;
        user.user = null;
        if (e instanceof Response && e.status >= 300 && e.status <= 399) {
            throw e; // Re-throw the redirect to SvelteKit
        }
        console.error("Auth check failed:", e);

    } finally {
        isLoading.isLoading = false;
    }

    return {};
}
