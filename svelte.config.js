import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {

		// prerender: {
		// 	handleUnseenRoutes: async () => {
		// 		// const products = await fetchProducts();
		// 		// return products.map((product) => ({
		// 		// 	type: 'page',
		// 		// 	path: `/shop/${product.slug || product.id}`
		// 		// }));
		// 		return [
		// 			{ type: 'page', path: '/shop/male-fertility-supplements' },
		// 		];
		// 	}
		// },

		prerender: {
			handleUnseenRoutes: 'ignore'
		},

		adapter: adapter({
			// default options are fine
			pages: 'build',
			assets: 'build',
			fallback: 'index.html', // Can be useful for SPA-style routing
			precompress: false
		})
	}
};

export default config;
