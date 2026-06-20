<script lang="ts">
	import { getCampaignStore } from '$lib/stores/campaign.svelte';

	const store = getCampaignStore();

	interface Props {
		scenarioId?: string;
		onchange?: (id: string) => void;
	}

	let { scenarioId = store.activeScenarioId, onchange }: Props = $props();

	const scenarios = $derived(store.sortedScenarios);
	const activeScenario = $derived(scenarios.find((s) => s.id === scenarioId));

	const currentIndex = $derived(scenarios.findIndex((s) => s.id === scenarioId));

	function select(id: string) {
		if (onchange) {
			onchange(id);
		} else {
			store.setActiveScenario(id);
		}
	}

	function prev() {
		if (currentIndex > 0) {
			select(scenarios[currentIndex - 1].id);
		}
	}

	function next() {
		if (currentIndex < scenarios.length - 1) {
			select(scenarios[currentIndex + 1].id);
		}
	}
</script>

<div class="scenario-bar">
	<div class="scenario-bar__info">
		{#if activeScenario}
			<p class="scenario-bar__title">
				Scénario {activeScenario.order} — {activeScenario.title}
			</p>
			<p class="scenario-bar__task">{activeScenario.task}</p>
		{/if}
	</div>
	<div class="scenario-bar__controls" style="display: flex; gap: 0.5rem; align-items: center;">
		<button type="button" class="btn btn--sm" disabled={currentIndex <= 0} onclick={prev}>
			◀
		</button>
		<select
			class="form-select"
			value={scenarioId}
			onchange={(e) => select(e.currentTarget.value)}
			style="max-width: 280px;"
		>
			{#each scenarios as scenario (scenario.id)}
				<option value={scenario.id}>Scénario {scenario.order} — {scenario.title}</option>
			{/each}
		</select>
		<button
			type="button"
			class="btn btn--sm"
			disabled={currentIndex >= scenarios.length - 1}
			onclick={next}
		>
			▶
		</button>
	</div>
</div>
