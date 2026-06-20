<script lang="ts">
	import { getCampaignStore } from '$lib/stores/campaign.svelte';
	import ExportPanel from '$lib/components/ExportPanel.svelte';
	import type { JourneyPhase } from '$lib/types';

	const store = getCampaignStore();

	let newObjective = $state('');

	function addObjective() {
		const trimmed = newObjective.trim();
		if (!trimmed) return;
		store.updateCampaignInfo(store.campaign.name, store.campaign.dateRange, [
			...store.campaign.objectives,
			trimmed
		]);
		newObjective = '';
	}

	function removeObjective(index: number) {
		store.updateCampaignInfo(
			store.campaign.name,
			store.campaign.dateRange,
			store.campaign.objectives.filter((_, i) => i !== index)
		);
	}

	function addTester() {
		store.addTester({
			name: 'Nouveau testeur',
			persona: '',
			testDate: '',
			context: ''
		});
	}

	function addScenario() {
		const maxOrder = Math.max(0, ...store.campaign.scenarios.map((s) => s.order));
		store.addScenario({
			order: maxOrder + 1,
			title: 'Nouveau scénario',
			objective: '',
			task: '',
			successCriteria: [''],
			phases: [{ id: crypto.randomUUID(), name: 'Phase 1' }]
		});
	}

	function addCriterion(scenarioId: string) {
		const scenario = store.campaign.scenarios.find((s) => s.id === scenarioId);
		if (!scenario) return;
		store.updateScenario(scenarioId, {
			successCriteria: [...scenario.successCriteria, '']
		});
	}

	function updateCriterion(scenarioId: string, index: number, value: string) {
		const scenario = store.campaign.scenarios.find((s) => s.id === scenarioId);
		if (!scenario) return;
		const criteria = [...scenario.successCriteria];
		criteria[index] = value;
		store.updateScenario(scenarioId, { successCriteria: criteria });
	}

	function removeCriterion(scenarioId: string, index: number) {
		const scenario = store.campaign.scenarios.find((s) => s.id === scenarioId);
		if (!scenario) return;
		store.updateScenario(scenarioId, {
			successCriteria: scenario.successCriteria.filter((_, i) => i !== index)
		});
	}

	function addPhase(scenarioId: string) {
		const scenario = store.campaign.scenarios.find((s) => s.id === scenarioId);
		if (!scenario) return;
		const phase: JourneyPhase = { id: crypto.randomUUID(), name: 'Nouvelle phase' };
		store.updateScenario(scenarioId, { phases: [...scenario.phases, phase] });
	}

	function updatePhase(scenarioId: string, phaseId: string, name: string) {
		const scenario = store.campaign.scenarios.find((s) => s.id === scenarioId);
		if (!scenario) return;
		store.updateScenario(scenarioId, {
			phases: scenario.phases.map((p) => (p.id === phaseId ? { ...p, name } : p))
		});
	}

	function removePhase(scenarioId: string, phaseId: string) {
		const scenario = store.campaign.scenarios.find((s) => s.id === scenarioId);
		if (!scenario) return;
		store.updateScenario(scenarioId, {
			phases: scenario.phases.filter((p) => p.id !== phaseId)
		});
	}

	function resetCampaign() {
		if (
			confirm(
				'Réinitialiser toutes les données au protocole SNCF par défaut ? Les observations seront perdues.'
			)
		) {
			store.resetCampaign();
		}
	}
</script>

<svelte:head>
	<title>Configuration — UX Speak</title>
</svelte:head>

<h1 class="page-title">Configuration</h1>
<p class="page-subtitle">Modifier le protocole de test et les participants</p>

<div class="card">
	<h2 class="card__title">Informations campagne</h2>
	<div class="form-group">
		<label for="campaign-name">Nom du projet</label>
		<input
			id="campaign-name"
			type="text"
			class="form-input"
			value={store.campaign.name}
			oninput={(e) =>
				store.updateCampaignInfo(e.currentTarget.value, store.campaign.dateRange, store.campaign.objectives)}
		/>
	</div>
	<div class="form-group">
		<label for="campaign-dates">Période</label>
		<input
			id="campaign-dates"
			type="text"
			class="form-input"
			value={store.campaign.dateRange}
			oninput={(e) =>
				store.updateCampaignInfo(store.campaign.name, e.currentTarget.value, store.campaign.objectives)}
		/>
	</div>

	<h3 style="font-size: 0.95rem; margin: 1rem 0 0.5rem;">Objectifs</h3>
	<ul class="criteria-list">
		{#each store.campaign.objectives as objective, index (index)}
			<li class="criteria-list__item" style="align-items: center;">
				<input
					type="text"
					class="form-input"
					value={objective}
					oninput={(e) => {
						const objectives = [...store.campaign.objectives];
						objectives[index] = e.currentTarget.value;
						store.updateCampaignInfo(store.campaign.name, store.campaign.dateRange, objectives);
					}}
				/>
				<button type="button" class="btn btn--sm btn--danger" onclick={() => removeObjective(index)}>
					×
				</button>
			</li>
		{/each}
	</ul>
	<div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
		<input type="text" class="form-input" placeholder="Nouvel objectif" bind:value={newObjective} />
		<button type="button" class="btn" onclick={addObjective}>Ajouter</button>
	</div>
</div>

<div class="card">
	<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
		<h2 class="card__title" style="margin: 0;">Testeurs</h2>
		<button type="button" class="btn btn--sm" onclick={addTester}>+ Ajouter</button>
	</div>

	{#each store.campaign.testers as tester (tester.id)}
		<div
			style="border: 1px solid var(--color-border); border-radius: var(--radius); padding: 1rem; margin-bottom: 1rem;"
		>
			<div class="grid-2">
				<div class="form-group">
					<label for="tester-name-{tester.id}">Nom</label>
					<input
						id="tester-name-{tester.id}"
						type="text"
						class="form-input"
						value={tester.name}
						oninput={(e) => store.updateTester(tester.id, { name: e.currentTarget.value })}
					/>
				</div>
				<div class="form-group">
					<label for="tester-persona-{tester.id}">Persona</label>
					<input
						id="tester-persona-{tester.id}"
						type="text"
						class="form-input"
						value={tester.persona}
						oninput={(e) => store.updateTester(tester.id, { persona: e.currentTarget.value })}
					/>
				</div>
				<div class="form-group">
					<label for="tester-date-{tester.id}">Date du test</label>
					<input
						id="tester-date-{tester.id}"
						type="text"
						class="form-input"
						value={tester.testDate}
						oninput={(e) => store.updateTester(tester.id, { testDate: e.currentTarget.value })}
					/>
				</div>
				<div class="form-group">
					<label for="tester-context-{tester.id}">Contexte</label>
					<input
						id="tester-context-{tester.id}"
						type="text"
						class="form-input"
						value={tester.context}
						oninput={(e) => store.updateTester(tester.id, { context: e.currentTarget.value })}
					/>
				</div>
			</div>
			{#if store.campaign.testers.length > 1}
				<button
					type="button"
					class="btn btn--sm btn--danger"
					onclick={() => {
						if (confirm(`Supprimer ${tester.name} ?`)) store.removeTester(tester.id);
					}}
				>
					Supprimer
				</button>
			{/if}
		</div>
	{/each}
</div>

<div class="card">
	<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
		<h2 class="card__title" style="margin: 0;">Scénarios</h2>
		<button type="button" class="btn btn--sm" onclick={addScenario}>+ Ajouter</button>
	</div>

	{#each store.sortedScenarios as scenario (scenario.id)}
		<div
			style="border: 1px solid var(--color-border); border-radius: var(--radius); padding: 1rem; margin-bottom: 1rem;"
		>
			<div class="form-group">
				<label for="scenario-title-{scenario.id}">Titre</label>
				<input
					id="scenario-title-{scenario.id}"
					type="text"
					class="form-input"
					value={scenario.title}
					oninput={(e) => store.updateScenario(scenario.id, { title: e.currentTarget.value })}
				/>
			</div>
			<div class="form-group">
				<label for="scenario-objective-{scenario.id}">Objectif</label>
				<textarea
					id="scenario-objective-{scenario.id}"
					class="form-textarea"
					value={scenario.objective}
					oninput={(e) => store.updateScenario(scenario.id, { objective: e.currentTarget.value })}
				></textarea>
			</div>
			<div class="form-group">
				<label for="scenario-task-{scenario.id}">Tâche</label>
				<textarea
					id="scenario-task-{scenario.id}"
					class="form-textarea"
					value={scenario.task}
					oninput={(e) => store.updateScenario(scenario.id, { task: e.currentTarget.value })}
				></textarea>
			</div>

			<h4 style="font-size: 0.9rem; margin: 0.75rem 0 0.5rem;">Critères de réussite</h4>
			{#each scenario.successCriteria as criterion, index (index)}
				<div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
					<input
						type="text"
						class="form-input"
						value={criterion}
						oninput={(e) => updateCriterion(scenario.id, index, e.currentTarget.value)}
					/>
					<button
						type="button"
						class="btn btn--sm btn--danger"
						onclick={() => removeCriterion(scenario.id, index)}
					>
						×
					</button>
				</div>
			{/each}
			<button type="button" class="btn btn--sm" onclick={() => addCriterion(scenario.id)}>
				+ Critère
			</button>

			<h4 style="font-size: 0.9rem; margin: 1rem 0 0.5rem;">Phases du parcours (CJM)</h4>
			{#each scenario.phases as phase (phase.id)}
				<div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
					<input
						type="text"
						class="form-input"
						value={phase.name}
						oninput={(e) => updatePhase(scenario.id, phase.id, e.currentTarget.value)}
					/>
					<button
						type="button"
						class="btn btn--sm btn--danger"
						onclick={() => removePhase(scenario.id, phase.id)}
					>
						×
					</button>
				</div>
			{/each}
			<button type="button" class="btn btn--sm" onclick={() => addPhase(scenario.id)}>
				+ Phase
			</button>

			{#if store.campaign.scenarios.length > 1}
				<div style="margin-top: 1rem;">
					<button
						type="button"
						class="btn btn--sm btn--danger"
						onclick={() => {
							if (confirm(`Supprimer le scénario « ${scenario.title} » ?`))
								store.removeScenario(scenario.id);
						}}
					>
						Supprimer le scénario
					</button>
				</div>
			{/if}
		</div>
	{/each}
</div>

<div class="card">
	<h2 class="card__title">Import / Export / Réinitialisation</h2>
	<ExportPanel showJson={true} />
	<div style="margin-top: 1rem;">
		<button type="button" class="btn btn--danger" onclick={resetCampaign}>
			Réinitialiser au protocole SNCF
		</button>
	</div>
</div>
