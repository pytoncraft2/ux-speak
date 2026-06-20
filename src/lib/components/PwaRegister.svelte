<script lang="ts">
	import { browser } from '$app/environment';
	import { base } from '$app/paths';
	import { onMount } from 'svelte';

	onMount(async () => {
		if (!browser || !('serviceWorker' in navigator)) return;

		const swUrl = `${base}/sw.js`;
		const scope = base ? `${base}/` : '/';

		try {
			await navigator.serviceWorker.register(swUrl, { scope, type: 'classic' });
		} catch (error) {
			console.warn('Enregistrement du service worker PWA échoué:', error);
		}
	});
</script>
