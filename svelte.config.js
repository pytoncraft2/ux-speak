import adapter from '@sveltejs/adapter-static';
import { basePath } from './config/site.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		runes: ({ filename }) =>
			filename.split(/[/\\]/).includes('node_modules') ? undefined : true
	},
	kit: {
		paths: {
			base: basePath
		},
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html',
			strict: false
		}),
		prerender: {
			entries: ['*']
		}
	}
};

export default config;
