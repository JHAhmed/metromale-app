import { tablesDB, ID, Query } from '$lib/appwrite';

export async function getPost(postId) {
    if (!postId) {
        console.error('Post ID is missing, cannot query posts.');
        return { rows: [], total: 0 };
    }

    try {
        const post = await tablesDB.getRow('metromale', 'posts', postId);
        return post;
    } catch (error) {
        console.error('Error fetching post details');
        return null;
    }
}

export async function getPosts() {
    try {
        const posts = await tablesDB.listRows('metromale', 'posts');
        return posts;
    } catch (error) {
        console.error('Error fetching posts:', error);
        return { rows: [], total: 0 };
    }
}
