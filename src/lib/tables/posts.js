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
	const alerts = await getPublishedAlerts(1);
	return alerts.rows?.[0] ?? null;
}

export async function getPublishedAlerts(limit) {
	const queries = [
		Query.equal('type', 'alert'),
		Query.equal('isPublished', true),
		Query.orderDesc('$updatedAt')
	];

	if (Number.isInteger(limit) && limit > 0) {
		queries.push(Query.limit(limit));
	}

	try {
		return await tablesDB.listRows('metromale', 'posts', queries);
	} catch (error) {
		console.error('Error fetching published alerts:', error);
		return { rows: [], total: 0 };
	}
}
