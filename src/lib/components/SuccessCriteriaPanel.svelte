<script lang="ts">
	import { getCampaignStore } from '$lib/stores/campaign.svelte';
	import type { ScenarioStatus } from '$lib/types';
	import { STATUS_LABELS } from '$lib/types';

	const store = getCampaignStore();

	const scenario = $derived(store.activeScenario);
	const result = $derived(store.currentResult);

	const statuses: ScenarioStatus[] = ['pending', 'success', 'partial', 'failed'];
</script>

{#if scenario}
	<div class="card">
		<h2 class="card__title">Critères de réussite</h2>

		<ul class="criteria-list">
			{#each scenario.successCriteria as criterion, index (index)}
				<li class="criteria-list__item">
					<input
						type="checkbox"
						id="criterion-{index}"
						checked={result?.criteriaMet[index] ?? false}
						onchange={(e) => store.setCriterionMet(index, e.currentTarget.checked)}
					/>
					<label for="criterion-{index}">{criterion}</label>
				</li>
			{/each}
		</ul>

		<div class="form-group" style="margin-top: 1rem;">
			<label for="result-notes">Notes de fin de scénario</label>
			<textarea
				id="result-notes"
				class="form-textarea"
				placeholder="Observations finales, citations..."
				value={result?.notes ?? ''}
				oninput={(e) => store.setResultNotes(e.currentTarget.value)}
			></textarea>
		</div>

		<p style="margin: 1rem 0 0.5rem; font-weight: 500;">Résultat du scénario</p>
		<div class="status-options">
			{#each statuses as status (status)}
				<button
					type="button"
					class="btn status-option"
					class:btn--primary={result?.status === status}
					onclick={() => store.setResultStatus(status)}
				>
					{STATUS_LABELS[status]}
				</button>
			{/each}
		</div>
	</div>
{/if}
