import { tablesDB, ID, Query, Permission, Role } from '$lib/appwrite';

export async function addOrder(orderData) {
	try {
		const newOrder = await tablesDB.createRow('metromale', 'shop_orders', ID.unique(), orderData, [
			Permission.read(Role.user(orderData.userId)),
			Permission.write(Role.user(orderData.userId))
		]);
		return newOrder;
	} catch (error) {
		console.error('Error creating order:', error);
		return null;
	}
}

export async function getOrder(orderId) {
	if (!orderId) {
		console.error('Order ID is missing, cannot query orders.');
		return null;
	}

	try {
		const order = await tablesDB.getRow('metromale', 'shop_orders', orderId);
		return order;
	} catch (error) {
		console.error('Error fetching order details:', error);
		return null;
	}
}

export async function getLatestUserOrder(userId) {
	if (!userId) {
		console.error('User ID is missing, cannot query orders.');
		return null;
	}
	try {
		const queries = [Query.equal('userId', userId), Query.orderDesc('$createdAt')];
		const orders = await tablesDB.listRows('metromale', 'shop_orders', queries);
		return orders.total > 0 ? orders.rows[0] : null;
	} catch (error) {
		console.error('Error fetching orders:', error);
		return null;
	}
}

export async function getUserOrders(userId) {
	if (!userId) {
		console.error('User ID is missing, cannot query orders.');
		return { rows: [], total: 0 };
	}
	try {
		const queries = [Query.equal('userId', userId), Query.orderDesc('$createdAt')];
		const orders = await tablesDB.listRows('metromale', 'shop_orders', queries);
		return orders;
	} catch (error) {
		console.error('Error fetching orders:', error);
		return { rows: [], total: 0 };
	}
}
