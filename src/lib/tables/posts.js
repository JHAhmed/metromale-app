import { tablesDB, Query } from '$lib/appwrite';

export async function getPost(postId) {
	if (!postId) {
		console.error('Post ID is missing, cannot query posts.');
		return { rows: [], total: 0 };
	}

	try {
		const post = await tablesDB.getRow('metromale', 'posts', postId);
		return post;
	} catch {
		console.error('Error fetching post details');
		return null;
	}
}

export async function getPosts(number) {
	const limit = Number.isInteger(number) && number > 0 ? number : undefined;

	try {
		const queries = limit
			? [Query.limit(limit), Query.equal('isPublished', true)]
			: [Query.equal('isPublished', true)];
		return await tablesDB.listRows('metromale', 'posts', queries);
	} catch (error) {
		console.error('Error fetching posts:', error);
		return { rows: [], total: 0 };
	}
}

export async function getLatestPublishedAlert() {
	try {
		const response = await tablesDB.listRows('metromale', 'posts', [
			Query.equal('type', 'alert'),
			Query.equal('isPublished', true),
			Query.orderDesc('$updatedAt'),
			Query.limit(1)
		]);

		return response.rows?.[0] ?? null;
	} catch (error) {
		console.error('Error fetching the latest published alert:', error);
		return null;
	}
}
