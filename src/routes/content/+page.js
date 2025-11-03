import { tablesDB, Query } from '$lib/appwrite.js';
import { error } from '@sveltejs/kit';

export async function load({ params, fetch }) {

    const queries = [Query.equal('isPublished', true)];

    try {
        const res = await tablesDB.listRows({
            databaseId: 'metromale',
            tableId: 'posts',
            queries
        });

        const posts = res.rows ?? null;
        return { posts };

    } catch (err) {
        console.error(err);
        throw error(404, 'Product not found');
    }
}
