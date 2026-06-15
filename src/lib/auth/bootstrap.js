import { account } from '$lib/appwrite.js';
import { cart } from '$lib/stores/cart.svelte.js';
import { isAuthenticated, isLoading, user } from '$lib/stores/auth.svelte.js';
import { loadProducts, products } from '$lib/stores/products.svelte.js';
import { storageAdapter } from '$lib/utils/storageAdapter.js';

let authPromise = null;
let cartPromise = null;
let productsPromise = null;
let authRun = 0;

export function hydrateCart() {
	if (cartPromise) return cartPromise;

	cartPromise = (async () => {
		try {
			const storedCart = await storageAdapter.getObject('cart');
			cart.items = Array.isArray(storedCart?.items) ? storedCart.items : [];
		} catch {
			cart.items = [];
		}
	})();

	return cartPromise;
}

export function warmProductCatalog() {
	if (products.items.length > 0) return Promise.resolve();
	if (!productsPromise) {
		productsPromise = loadProducts();
	}
	return productsPromise;
}

export function initAuth({ force = false } = {}) {
	if (authPromise && !force) return authPromise;

	const runId = ++authRun;
	isLoading.isLoading = true;
	void hydrateCart();

	authPromise = (async () => {
		try {
			const appwriteUser = await account.get();
			if (runId !== authRun) return;

			isAuthenticated.isAuthenticated = !!appwriteUser?.$id;
			user.user = appwriteUser?.$id ? appwriteUser : null;

			if (user.user) {
				void warmProductCatalog();
			}
		} catch {
			if (runId !== authRun) return;

			isAuthenticated.isAuthenticated = false;
			user.user = null;
		} finally {
			if (runId === authRun) {
				isLoading.isLoading = false;
			}
		}
	})();

	return authPromise;
}

export function clearAuth() {
	authRun += 1;
	authPromise = null;
	isAuthenticated.isAuthenticated = false;
	user.user = null;
	isLoading.isLoading = false;
}
