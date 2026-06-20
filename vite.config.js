import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vite';
import { viteBase, withBase } from './config/site.js';

export default defineConfig({
	base: viteBase,
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			registerType: 'autoUpdate',
			manifest: {
				id: withBase('/'),
				name: 'UX Speak — Tests utilisateurs',
				short_name: 'UX Speak',
				description:
					"Outil de capture d'observations et Customer Journey Map pour tests utilisateurs UX/UI.",
				lang: 'fr',
				start_url: withBase('/'),
				scope: withBase('/'),
				display: 'standalone',
				orientation: 'portrait',
				theme_color: '#0d6efd',
				background_color: '#f8f9fa',
				icons: [
					{
						src: withBase('/pwa-192x192.png'),
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: withBase('/pwa-512x512.png'),
						sizes: '512x512',
						type: 'image/png'
					},
					{
						src: withBase('/pwa-512x512.png'),
						sizes: '512x512',
						type: 'image/png',
						purpose: 'maskable'
					}
				]
			},
			workbox: {
				globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2,webmanifest}'],
				navigateFallback: withBase('/index.html')
			},
			devOptions: {
				enabled: true,
				suppressWarnings: true,
				navigateFallback: withBase('/index.html')
			},
			kit: { includeVersionFile: true }
		})
	]
});
