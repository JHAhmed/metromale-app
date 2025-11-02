import { getProducts } from "$lib/tables/products";

export const products = $state({
    items: []
});

export async function loadProducts() {
    try {
        const data = await getProducts();
        console.log(data);
        products.items = data.rows || [];
        console.log('Products loaded:', products.items);
    } catch (error) {
        console.error('Error loading products:', error);
    }
}