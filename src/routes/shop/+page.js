// import { tablesDB, Query } from '$lib/appwrite.js';
// import { error } from '@sveltejs/kit';

// export async function load({ params, fetch }) {

//     try {
//         const res = await tablesDB.listRows({
//             databaseId: 'metromale',
//             tableId: 'products',
//         });

//         const products = res.rows ?? null;
//         return { products };

//     } catch (err) {
//         console.error(err);
//         throw error(404, 'Product not found');
//     }
// }
