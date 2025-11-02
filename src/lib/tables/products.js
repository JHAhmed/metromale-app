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

export async function getProducts() {
	try {
		const products = await tablesDB.listRows('metromale', 'products');
		return products;
	} catch (error) {
		console.error('Error fetching products:', error);
		return { rows: [], total: 0 };
	}
}
