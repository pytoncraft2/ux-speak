<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	onMount(async () => {
		if (!browser) return;

		try {
			const { registerSW } = await import('virtual:pwa-register');
			registerSW({ immediate: true });
		} catch {
			// PWA non disponible en dehors d'un build avec le plugin
		}
	});
</script>
