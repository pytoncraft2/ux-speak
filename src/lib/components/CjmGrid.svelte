<script lang="ts">
	import type { CjmGrid as CjmGridType } from '$lib/utils/cjm';
	import { OBSERVATION_LABELS } from '$lib/types';

	interface Props {
		grid: CjmGridType | null;
	}

	let { grid }: Props = $props();
</script>

{#if grid}
	<div class="cjm-grid-wrapper">
		<table class="cjm-table">
			<thead>
				<tr>
					<th>Testeur</th>
					{#each grid.phases as phase (phase.id)}
						<th>{phase.name}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each grid.rows as row (row.testerId)}
					<tr>
						<td class="tester-cell">{row.testerName}</td>
						{#each grid.phases as phase (phase.id)}
							{@const cell = row.cells.get(phase.id)}
							<td>
								{#if cell}
									{#each cell.painPoints as obs (obs.id)}
										<span class="cjm-cell__item cjm-cell__item--pain">
											{OBSERVATION_LABELS[obs.type]}{obs.note ? `: ${obs.note}` : ''}
										</span>
									{/each}
									{#each cell.successes as obs (obs.id)}
										<span class="cjm-cell__item cjm-cell__item--success">
											Succès{obs.note ? `: ${obs.note}` : ''}
										</span>
									{/each}
									{#each cell.comments as obs (obs.id)}
										<span class="cjm-cell__item cjm-cell__item--comment">
											Commentaire{obs.note ? `: ${obs.note}` : ''}
										</span>
									{/each}
									{#if cell.painPoints.length === 0 && cell.successes.length === 0 && cell.comments.length === 0}
										<span style="color: var(--color-text-muted);">—</span>
									{/if}
								{:else}
									<span style="color: var(--color-text-muted);">—</span>
								{/if}
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{:else}
	<p style="color: var(--color-text-muted);">Sélectionnez un scénario pour afficher la grille.</p>
{/if}
