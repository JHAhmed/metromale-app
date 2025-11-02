import { ID, Query } from 'appwrite';
import { storage } from '$lib/appwrite';

export async function getFile(fileId) {
	const result = storage.getFileView({
		bucketId: "images",
		fileId: fileId
	});

	return result;
}
