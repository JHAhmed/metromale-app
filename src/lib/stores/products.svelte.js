import { getProducts } from "$lib/tables/products";

export const products = $state({
    items: []
});

export async function loadProducts() {
    try {
        const data = await getProducts();
        products.items = data.rows || [];
    } catch (error) {
        console.error('Error loading products:', error);
    }
}