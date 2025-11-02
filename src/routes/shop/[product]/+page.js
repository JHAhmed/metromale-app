import { tablesDB, Query } from '$lib/appwrite.js';
import { error } from '@sveltejs/kit';

export async function load({ params, fetch }) {
	const { product: slug } = params;
	const queries = [Query.equal('slug', slug)];

	// 2. Fetch data for this specific slug from your CMS
	// const response = await fetch(`https://cms.wurks.studio/products/${slug}`);

	try {
		const res = await tablesDB.listRows({
			databaseId: 'metromale',
			tableId: 'products',
			queries
		});
		const product = res.rows?.[0] ?? null;
		return { product };
	} catch (err) {
		console.error(err);
		throw error(404, 'Product not found');
	}
}
