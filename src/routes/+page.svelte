<script lang="ts">
	import { resolve } from '$app/paths';
	import { getCampaignStore } from '$lib/stores/campaign.svelte';
	import { STATUS_LABELS } from '$lib/types';

	const store = getCampaignStore();
	const stats = $derived(store.getStats());
</script>

<svelte:head>
	<title>Accueil — UX Speak</title>
</svelte:head>

<h1 class="page-title">UX Speak</h1>
<p class="page-subtitle">{store.campaign.name}</p>
<p style="color: var(--color-text-muted); margin: -1rem 0 1.5rem;">{store.campaign.dateRange}</p>

<div class="stats-grid">
	<div class="stat-card">
		<div class="stat-card__value">{stats.totalObservations}</div>
		<div class="stat-card__label">Observations</div>
	</div>
	<div class="stat-card">
		<div class="stat-card__value">{stats.painPoints}</div>
		<div class="stat-card__label">Points de friction</div>
	</div>
	<div class="stat-card">
		<div class="stat-card__value">{stats.completedResults}/{stats.totalPossible}</div>
		<div class="stat-card__label">Scénarios évalués</div>
	</div>
	<div class="stat-card">
		<div class="stat-card__value">{store.campaign.testers.length}</div>
		<div class="stat-card__label">Testeurs</div>
	</div>
</div>

<div class="grid-2">
	<div class="card">
		<h2 class="card__title">Démarrer une session</h2>
		<p style="margin: 0 0 1rem; color: var(--color-text-muted); font-size: 0.9rem;">
			Capturez les observations en temps réel pendant vos tests utilisateurs.
		</p>
		<a href={resolve('/session')} class="btn btn--primary">Ouvrir la session live</a>
	</div>

	<div class="card">
		<h2 class="card__title">Customer Journey Map</h2>
		<p style="margin: 0 0 1rem; color: var(--color-text-muted); font-size: 0.9rem;">
			Visualisez les parcours, points de douleur et exportez votre rapport.
		</p>
		<a href={resolve('/cjm')} class="btn btn--primary">Voir le CJM</a>
	</div>
</div>

<div class="card" style="margin-top: 1rem;">
	<h2 class="card__title">Testeurs</h2>
	<ul>
		{#each store.campaign.testers as tester (tester.id)}
			<li style="margin-bottom: 0.75rem;">
				<strong>{tester.name}</strong> — {tester.persona}<br />
				<span style="font-size: 0.85rem; color: var(--color-text-muted);">
					{tester.testDate} · {tester.context}
				</span>
			</li>
		{/each}
	</ul>
</div>

<div class="card">
	<h2 class="card__title">Scénarios de test</h2>
	<ol>
		{#each store.sortedScenarios as scenario (scenario.id)}
			<li style="margin-bottom: 1rem;">
				<strong>{scenario.title}</strong>
				<p style="margin: 0.25rem 0; font-size: 0.85rem; color: var(--color-text-muted);">
					{scenario.task}
				</p>
				{#if store.campaign.results.filter((r) => r.scenarioId === scenario.id && r.status !== 'pending').length > 0}
					<ul style="font-size: 0.85rem; margin: 0.5rem 0 0;">
						{#each store.campaign.testers as tester (tester.id)}
							{@const result = store.campaign.results.find(
								(r) => r.testerId === tester.id && r.scenarioId === scenario.id
							)}
							{#if result && result.status !== 'pending'}
								<li>{tester.name} : {STATUS_LABELS[result.status]}</li>
							{/if}
						{/each}
					</ul>
				{/if}
			</li>
		{/each}
	</ol>
</div>

<div class="card">
	<h2 class="card__title">Objectifs du test</h2>
	<ul>
		{#each store.campaign.objectives as objective (objective)}
			<li>{objective}</li>
		{/each}
	</ul>
</div>
