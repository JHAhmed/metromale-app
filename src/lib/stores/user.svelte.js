import { ID } from 'appwrite';
import { goto, invalidateAll } from '$app/navigation';
import { account } from '$lib/appwrite';

// Avoid auth calls in server-side, so that a user is not shared between requests
const isBrowser = typeof window !== 'undefined';

export let user = $state(null);

async function init() {
    if (!isBrowser) return;
    try {
        user = await account.get();
    } catch (e) {
        user = null;
    }
}

init();

export async function register(email, password, name) {
    if (!isBrowser) return;
    await account.create(ID.unique(), email, password, name);
    await login(email, password);
}

export async function login(email, password) {
    if (!isBrowser) return;
    await account.createEmailPasswordSession(email, password);

    console.log('Login successful');

    await init();
    goto('/');
}

export async function logout() {
    if (!isBrowser) return;
    await account.deleteSession('current');
    user = null;
    await invalidateAll(); 
    goto('/');
}
