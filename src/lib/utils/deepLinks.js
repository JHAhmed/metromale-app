// Keep app links on the dedicated app host so the public information website
// at metromaleclinic.com remains a normal website.
const APP_LINK_HOSTS = new Set(['app.metromaleclinic.com']);
export const PENDING_DEEP_LINK_KEY = 'pendingDeepLink';

/**
 * Convert a URL received from an Android App Link or iOS Universal Link into
 * a route understood by the Svelte app.
 *
 * Capacitor also delivers custom authentication callback URLs through the
 * same App plugin event, so only paths understood by this app are accepted.
 */
export function getInternalPathFromAppLink(rawUrl) {
	if (!rawUrl) return null;

	try {
		const url = new URL(rawUrl);
		const hostname = url.hostname.toLowerCase();

		if (url.protocol !== 'https:' || !APP_LINK_HOSTS.has(hostname)) {
			return null;
		}

		const segments = url.pathname.split('/').filter(Boolean);
		const [section, slug] = segments;
		const encodedSlug = slug ? encodeURIComponent(decodeURIComponent(slug)) : null;

		if (section?.toLowerCase() === 'products' && segments.length === 2) {
			return `/shop/${encodedSlug}${url.search}${url.hash}`;
		}

		if (['articles', 'blog', 'blogs'].includes(section?.toLowerCase()) && segments.length === 2) {
			return `/content/${encodedSlug}${url.search}${url.hash}`;
		}

		if (['content', 'appointments'].includes(section?.toLowerCase()) && segments.length <= 2) {
			return `${url.pathname.replace(/\/$/, '') || '/'}${url.search}${url.hash}`;
		}

		if (section?.toLowerCase() === 'shop' && segments.length <= 2) {
			return `${url.pathname.replace(/\/$/, '') || '/'}${url.search}${url.hash}`;
		}

		return null;
	} catch {
		return null;
	}
}

export function isProtectedDeepLink(path) {
	return path?.startsWith('/appointments/') === true;
}

export function consumePendingDeepLink() {
	if (typeof sessionStorage === 'undefined') return null;

	const pendingPath = sessionStorage.getItem(PENDING_DEEP_LINK_KEY);
	sessionStorage.removeItem(PENDING_DEEP_LINK_KEY);

	if (!pendingPath) return null;

	try {
		const url = new URL(pendingPath, 'https://app.metromaleclinic.com');
		if (url.origin !== 'https://app.metromaleclinic.com') return null;
		if (!url.pathname.startsWith('/appointments/')) return null;

		return `${url.pathname}${url.search}${url.hash}`;
	} catch {
		return null;
	}
}
