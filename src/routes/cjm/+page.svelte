<script lang="ts">
	import { getCampaignStore } from '$lib/stores/campaign.svelte';
	import CjmGrid from '$lib/components/CjmGrid.svelte';
	import ExportPanel from '$lib/components/ExportPanel.svelte';
	import { buildCjmGrid, buildCjmSummary } from '$lib/utils/cjm';

	const store = getCampaignStore();

	let selectedScenarioId = $state(store.activeScenarioId);
	let selectedTesterId = $state('');

	const scenarios = $derived(store.sortedScenarios);
	const grid = $derived(buildCjmGrid(store.campaign, selectedScenarioId, selectedTesterId || undefined));
	const summary = $derived(buildCjmSummary(store.campaign));
</script>

<svelte:head>
	<title>Customer Journey Map — UX Speak</title>
</svelte:head>

<h1 class="page-title">Customer Journey Map</h1>
<p class="page-subtitle">Synthèse des parcours utilisateurs et points de douleur</p>

<div class="filters card">
	<div class="form-group">
		<label for="cjm-scenario">Scénario</label>
		<select id="cjm-scenario" class="form-select" bind:value={selectedScenarioId}>
			{#each scenarios as scenario (scenario.id)}
				<option value={scenario.id}>Scénario {scenario.order} — {scenario.title}</option>
			{/each}
		</select>
	</div>

	<div class="form-group">
		<label for="cjm-tester">Testeur</label>
		<select id="cjm-tester" class="form-select" bind:value={selectedTesterId}>
			<option value="">Tous les testeurs</option>
			{#each store.campaign.testers as tester (tester.id)}
				<option value={tester.id}>{tester.name}</option>
			{/each}
		</select>
	</div>
</div>

<div class="grid-2">
	<div class="card">
		<h2 class="card__title">Points de friction</h2>
		{#if summary.topFrictionPoints.length === 0}
			<p style="color: var(--color-text-muted);">Aucune observation enregistrée.</p>
		{:else}
			<ul>
				{#each summary.topFrictionPoints as fp (fp.label)}
					<li><strong>{fp.label}</strong> — {fp.count} occurrence(s)</li>
				{/each}
			</ul>
		{/if}
	</div>

	<div class="card">
		<h2 class="card__title">Taux de réussite par scénario</h2>
		<ul>
			{#each summary.successRateByScenario as sr (sr.scenarioTitle)}
				<li>
					<strong>{sr.scenarioTitle}</strong> — {sr.rate}% ({sr.completed}/{sr.total} évalués)
				</li>
			{/each}
		</ul>
	</div>
</div>

<div class="card" style="margin-top: 1rem;">
	<h2 class="card__title">Grille du parcours</h2>
	<CjmGrid {grid} />
</div>

<div class="card" style="margin-top: 1rem;">
	<h2 class="card__title">Exports</h2>
	<ExportPanel scenarioId={selectedScenarioId} />
</div>
