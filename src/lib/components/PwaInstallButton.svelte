<script lang="ts">
	import { onMount } from 'svelte';
	import { getPwaInstall } from '$lib/pwa/install.svelte';

	const pwa = getPwaInstall();

	onMount(() => {
		pwa.init();
	});
</script>

{#if pwa.initialized && !pwa.isInstalled}
	<button type="button" class="btn btn--sm btn--primary" onclick={() => pwa.install()}>
		Télécharger l'app
	</button>
{/if}
