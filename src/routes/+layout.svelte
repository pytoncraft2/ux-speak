<script lang="ts">
	import { page } from '$app/stores';
	import { base, resolve } from '$app/paths';
	import PwaRegister from '$lib/components/PwaRegister.svelte';
	import { getCampaignStore } from '$lib/stores/campaign.svelte';
	import { downloadFile, exportJson } from '$lib/utils/export';
	import '../app.css';

	let { children } = $props();

	const store = getCampaignStore();

	const navItems = [
		{ path: '/', label: 'Accueil' },
		{ path: '/session', label: 'Session live' },
		{ path: '/cjm', label: 'Customer Journey Map' },
		{ path: '/config', label: 'Configuration' }
	];

	function isActive(path: string, pathname: string): boolean {
		const href = resolve(path);
		if (path === '/') {
			return pathname === base || pathname === `${base}/`;
		}
		return pathname === href || pathname.startsWith(`${href}/`);
	}

	function exportBackup() {
		const content = exportJson(store.campaign);
		downloadFile(content, 'ux-speak-backup.json', 'application/json');
	}
</script>

<svelte:head>
	<link rel="icon" href="{base}/pwa-192x192.png" />
	<link rel="apple-touch-icon" href="{base}/pwa-192x192.png" />
	<link rel="manifest" href="{base}/manifest.webmanifest" />
	<title>UX Speak</title>
</svelte:head>

<PwaRegister />

<div class="app-shell">
	<nav class="app-nav">
		<a href={resolve('/')} class="app-nav__brand">UX Speak</a>

		<ul class="app-nav__links">
			{#each navItems as item (item.path)}
				<li>
					<a
						href={resolve(item.path)}
						class="app-nav__link"
						class:active={isActive(item.path, $page.url.pathname)}
					>
						{item.label}
					</a>
				</li>
			{/each}
		</ul>

		<div class="app-nav__actions">
			<button type="button" class="btn btn--sm" onclick={exportBackup}>Backup JSON</button>
		</div>
	</nav>

	<main class="app-main">
		{@render children()}
	</main>
</div>
