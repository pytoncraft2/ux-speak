<script lang="ts">
	import { getCampaignStore } from '$lib/stores/campaign.svelte';
	import type { Observation } from '$lib/types';
	import { OBSERVATION_LABELS } from '$lib/types';
	import { formatTime } from '$lib/utils/cjm';

	const store = getCampaignStore();

	interface Props {
		observations?: Observation[];
		onremove?: (id: string) => void;
	}

	let {
		observations = store.filteredObservations,
		onremove
	}: Props = $props();

	function remove(id: string) {
		if (onremove) {
			onremove(id);
		} else {
			store.removeObservation(id);
		}
	}
</script>

<div class="card">
	<h2 class="card__title">Timeline des observations</h2>

	{#if observations.length === 0}
		<p class="timeline__empty">Aucune observation pour ce testeur et ce scénario.</p>
	{:else}
		<ul class="timeline">
			{#each observations as obs (obs.id)}
				<li class="timeline__item">
					<span class="timeline__time">{formatTime(obs.timestamp)}</span>
					<span class="timeline__badge timeline__badge--{obs.type}">
						{OBSERVATION_LABELS[obs.type]}
					</span>
					{#if obs.note}
						<span class="timeline__note">— {obs.note}</span>
					{/if}
					<button
						type="button"
						class="btn btn--sm btn--danger"
						style="margin-left: auto;"
						onclick={() => remove(obs.id)}
						aria-label="Supprimer l'observation"
					>
						×
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>
