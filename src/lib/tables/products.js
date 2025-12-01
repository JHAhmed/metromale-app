import { tablesDB, ID, Query } from '$lib/appwrite';

export async function getProduct(productId) {
	if (!productId) {
		console.error('Product ID is missing, cannot query products.');
		return { rows: [], total: 0 };
	}

	try {
		const product = await tablesDB.getRow('metromale', 'products', productId);
		return product;
	} catch (error) {
		console.error('Error fetching product details');
		return null;
	}
}

export async function getProducts(number) {
	const limit = Number.isInteger(number) && number > 0 ? number : undefined;

	try {
		const queries = limit ? [Query.limit(limit)] : [];
		return await tablesDB.listRows('metromale', 'products', queries);
	} catch (error) {
		console.error('Error fetching products:', error);
		return { rows: [], total: 0 };
	}
}
