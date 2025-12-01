import { tablesDB, Query } from '$lib/appwrite.js';
import { error } from '@sveltejs/kit';

export async function load({ params, fetch }) {
    const { slug } = params;

    const queries = [Query.equal('slug', slug), Query.equal('isPublished', true)];

    // 2. Fetch data for this specific slug from your CMS
    // const response = await fetch(`https://cms.wurks.studio/posts/${slug}`);

    try {
        const res = await tablesDB.listRows({
            databaseId: 'metromale',
            tableId: 'posts',
            queries
        });
        const post = res.rows?.[0]
        return { post };
    } catch (err) {
        console.error(err);
        throw error(404, 'Post not found');
    }
}
