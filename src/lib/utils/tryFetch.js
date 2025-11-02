export async function tryFetch(url, method = 'GET', headers = {}, body = null) {

    try {
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: method !== 'GET' ? JSON.stringify(body) : undefined
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
        
    } catch (error) {
        console.error('Fetch failed:', error);
        return { error: error.message };
    }
}
