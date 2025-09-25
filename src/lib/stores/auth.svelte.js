import { initKinde } from '$lib/auth';

export const isAuthenticated = $state({ isAuthenticated: false });
export const user = $state({ user: null });
export const isLoading = $state({ isLoading: false });

export const kindeClient = $state({ client: null });

export async function loadAuth() {
	const client = await initKinde();
    isAuthenticated.isAuthenticated = await client.isAuthenticated();
    if (isAuthenticated.isAuthenticated) {
        user.user = await client.getUser();
    }

}
