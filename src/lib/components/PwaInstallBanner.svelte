<script lang="ts">
	import { onMount } from 'svelte';
	import { getPwaInstall } from '$lib/pwa/install.svelte';

	const pwa = getPwaInstall();

	onMount(() => {
		pwa.init();
	});
</script>

{#if pwa.showBanner}
	<aside class="pwa-banner" aria-label="Installer l'application">
		<div class="pwa-banner__content">
			<div class="pwa-banner__icon" aria-hidden="true">📲</div>
			<div class="pwa-banner__text">
				<strong class="pwa-banner__title">Utilisez UX Speak hors ligne</strong>
				<p class="pwa-banner__desc">
					Téléchargez l'application sur votre appareil pour vos sessions de test sans
					connexion.
				</p>
			</div>
			<div class="pwa-banner__actions">
				<button type="button" class="btn btn--primary" onclick={() => pwa.install()}>
					Télécharger l'application
				</button>
				<button
					type="button"
					class="btn btn--sm pwa-banner__dismiss"
					onclick={() => pwa.dismissBanner()}
					aria-label="Masquer le bandeau"
				>
					×
				</button>
			</div>
		</div>
	</aside>
{/if}

{#if pwa.showIosHelp}
	<div class="pwa-help-backdrop" onclick={() => pwa.closeHelp()} role="presentation"></div>
	<div class="pwa-help" role="dialog" aria-labelledby="pwa-ios-title">
		<h2 id="pwa-ios-title" class="pwa-help__title">Installer sur iPhone / iPad</h2>
		<ol class="pwa-help__steps">
			<li>Appuyez sur <strong>Partager</strong> dans Safari</li>
			<li>Choisissez <strong>Sur l'écran d'accueil</strong></li>
			<li>Confirmez avec <strong>Ajouter</strong></li>
		</ol>
		<button type="button" class="btn btn--primary" onclick={() => pwa.closeHelp()}>
			Compris
		</button>
	</div>
{/if}

{#if pwa.showUnsupportedHelp}
	<div class="pwa-help-backdrop" onclick={() => pwa.closeHelp()} role="presentation"></div>
	<div class="pwa-help" role="dialog" aria-labelledby="pwa-unsupported-title">
		<h2 id="pwa-unsupported-title" class="pwa-help__title">Installation non disponible</h2>
		<p class="pwa-help__text">
			Utilisez Chrome ou Edge sur HTTPS (ex. GitHub Pages), ou installez via le menu du
			navigateur : <strong>Installer l'application</strong>.
		</p>
		<button type="button" class="btn btn--primary" onclick={() => pwa.closeHelp()}>
			Compris
		</button>
	</div>
{/if}
