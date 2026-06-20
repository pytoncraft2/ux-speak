<script lang="ts">
	import { getCampaignStore } from '$lib/stores/campaign.svelte';
	import type { ObservationType } from '$lib/types';
	import { OBSERVATION_LABELS, OBSERVATION_TYPES } from '$lib/types';

	const store = getCampaignStore();

	interface Props {
		oncapture?: (type: ObservationType, note?: string, phaseId?: string) => void;
	}

	let { oncapture }: Props = $props();

	let note = $state('');
	let phaseId = $state('');

	const phases = $derived(store.activeScenario?.phases ?? []);

	function capture(type: ObservationType) {
		const trimmedNote = note.trim() || undefined;
		const selectedPhase = phaseId || undefined;

		if (oncapture) {
			oncapture(type, trimmedNote, selectedPhase);
		} else {
			store.addObservation(type, trimmedNote, selectedPhase);
		}

		note = '';
	}

	const btnClass: Record<ObservationType, string> = {
		hesitation: 'btn--hesitation',
		blocked: 'btn--blocked',
		success: 'btn--success',
		difficulty: 'btn--difficulty',
		comment: 'btn--comment'
	};
</script>

<div class="card">
	<h2 class="card__title">Capture rapide</h2>

	<div class="quick-actions">
		{#each OBSERVATION_TYPES as type (type)}
			<button type="button" class="btn {btnClass[type]}" onclick={() => capture(type)}>
				{OBSERVATION_LABELS[type]}
			</button>
		{/each}
	</div>

	<div class="grid-2" style="margin-top: 1rem;">
		{#if phases.length > 0}
			<div class="form-group">
				<label for="phase-select">Phase du parcours (optionnel)</label>
				<select id="phase-select" class="form-select" bind:value={phaseId}>
					<option value="">— Non précisée —</option>
					{#each phases as phase (phase.id)}
						<option value={phase.id}>{phase.name}</option>
					{/each}
				</select>
			</div>
		{/if}

		<div class="form-group">
			<label for="quick-note">Note rapide (optionnel)</label>
			<input
				id="quick-note"
				type="text"
				class="form-input"
				placeholder="Ex. : ne trouve pas l'onglet cartes"
				bind:value={note}
				onkeydown={(e) => {
					if (e.key === 'Enter') capture('comment');
				}}
			/>
		</div>
	</div>
</div>
