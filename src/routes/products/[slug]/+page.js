import { redirect } from '@sveltejs/kit';

export function load({ params, url }) {
	throw redirect(307, `/shop/${encodeURIComponent(params.slug)}${url.search}`);
}
