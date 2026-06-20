import type { Campaign } from '$lib/types';
import { OBSERVATION_LABELS, STATUS_LABELS } from '$lib/types';
import { buildCjmGrid, buildCjmSummary } from '$lib/utils/cjm';

function escapeHtml(text: string): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
	const blob = new Blob([content], { type: mimeType });
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = filename;
	link.click();
	URL.revokeObjectURL(url);
}

export function exportMarkdown(campaign: Campaign, scenarioId?: string): string {
	const lines: string[] = [];
	const summary = buildCjmSummary(campaign);

	lines.push(`# Customer Journey Map — ${campaign.name}`);
	lines.push('');
	lines.push(`**Période :** ${campaign.dateRange}`);
	lines.push('');

	lines.push('## Objectifs du test');
	for (const obj of campaign.objectives) {
		lines.push(`- ${obj}`);
	}
	lines.push('');

	lines.push('## Synthèse');
	lines.push('');
	lines.push('### Points de friction');
	if (summary.topFrictionPoints.length === 0) {
		lines.push('_Aucune observation de friction enregistrée._');
	} else {
		for (const fp of summary.topFrictionPoints) {
			lines.push(`- **${fp.label}** : ${fp.count} occurrence(s)`);
		}
	}
	lines.push('');

	lines.push('### Taux de réussite par scénario');
	for (const sr of summary.successRateByScenario) {
		lines.push(
			`- **${sr.scenarioTitle}** : ${sr.rate}% (${sr.completed}/${sr.total} évalués)`
		);
	}
	lines.push('');

	const scenarios = scenarioId
		? campaign.scenarios.filter((s) => s.id === scenarioId)
		: [...campaign.scenarios].sort((a, b) => a.order - b.order);

	for (const scenario of scenarios) {
		const grid = buildCjmGrid(campaign, scenario.id);
		if (!grid) continue;

		lines.push(`## ${scenario.title}`);
		lines.push('');
		lines.push(`> ${scenario.task}`);
		lines.push('');

		const header = ['Testeur', ...grid.phases.map((p) => p.name)];
		lines.push(`| ${header.join(' | ')} |`);
		lines.push(`| ${header.map(() => '---').join(' | ')} |`);

		for (const row of grid.rows) {
			const cells = grid.phases.map((phase) => {
				const cell = row.cells.get(phase.id);
				if (!cell) return '—';

				const parts: string[] = [];
				for (const p of cell.painPoints) {
					const note = p.note ? ` : ${p.note}` : '';
					parts.push(`🔴 ${OBSERVATION_LABELS[p.type]}${note}`);
				}
				for (const s of cell.successes) {
					const note = s.note ? ` : ${s.note}` : '';
					parts.push(`🟢 Succès${note}`);
				}
				for (const c of cell.comments) {
					const note = c.note ? ` : ${c.note}` : '';
					parts.push(`💬 Commentaire${note}`);
				}
				return parts.length > 0 ? parts.join('<br>') : '—';
			});

			lines.push(`| ${row.testerName} | ${cells.join(' | ')} |`);
		}
		lines.push('');
	}

	lines.push('## Observations brutes');
	lines.push('');
	const sorted = [...campaign.observations].sort((a, b) => a.timestamp - b.timestamp);
	for (const obs of sorted) {
		const tester = campaign.testers.find((t) => t.id === obs.testerId)?.name ?? '?';
		const scenario = campaign.scenarios.find((s) => s.id === obs.scenarioId)?.title ?? '?';
		const time = new Date(obs.timestamp).toLocaleString('fr-FR');
		const note = obs.note ? ` — "${obs.note}"` : '';
		lines.push(
			`- [${time}] **${tester}** / ${scenario} / ${OBSERVATION_LABELS[obs.type]}${note}`
		);
	}
	lines.push('');

	lines.push('## Résultats par scénario');
	lines.push('');
	for (const result of campaign.results) {
		const tester = campaign.testers.find((t) => t.id === result.testerId)?.name ?? '?';
		const scenario = campaign.scenarios.find((s) => s.id === result.scenarioId)?.title ?? '?';
		lines.push(`- **${tester}** — ${scenario} : ${STATUS_LABELS[result.status]}`);
		if (result.notes) lines.push(`  - Notes : ${result.notes}`);
	}

	return lines.join('\n');
}

export function exportHtml(campaign: Campaign, scenarioId?: string): string {
	const summary = buildCjmSummary(campaign);
	const scenarios = scenarioId
		? campaign.scenarios.filter((s) => s.id === scenarioId)
		: [...campaign.scenarios].sort((a, b) => a.order - b.order);

	let gridsHtml = '';
	for (const scenario of scenarios) {
		const grid = buildCjmGrid(campaign, scenario.id);
		if (!grid) continue;

		let tableRows = '';
		for (const row of grid.rows) {
			let cells = `<td class="tester">${escapeHtml(row.testerName)}</td>`;
			for (const phase of grid.phases) {
				const cell = row.cells.get(phase.id);
				let content = '—';
				if (cell) {
					const parts: string[] = [];
					for (const p of cell.painPoints) {
						const note = p.note ? `: ${escapeHtml(p.note)}` : '';
						parts.push(`<span class="pain">${escapeHtml(OBSERVATION_LABELS[p.type])}${note}</span>`);
					}
					for (const s of cell.successes) {
						const note = s.note ? `: ${escapeHtml(s.note)}` : '';
						parts.push(`<span class="success">Succès${note}</span>`);
					}
					for (const c of cell.comments) {
						const note = c.note ? `: ${escapeHtml(c.note)}` : '';
						parts.push(`<span class="comment">Commentaire${note}</span>`);
					}
					if (parts.length > 0) content = parts.join('<br>');
				}
				cells += `<td>${content}</td>`;
			}
			tableRows += `<tr>${cells}</tr>`;
		}

		const headers = grid.phases.map((p) => `<th>${escapeHtml(p.name)}</th>`).join('');
		gridsHtml += `
			<section>
				<h2>${escapeHtml(scenario.title)}</h2>
				<p class="task">${escapeHtml(scenario.task)}</p>
				<table>
					<thead><tr><th>Testeur</th>${headers}</tr></thead>
					<tbody>${tableRows}</tbody>
				</table>
			</section>`;
	}

	const frictionHtml =
		summary.topFrictionPoints.length === 0
			? '<p>Aucune observation de friction.</p>'
			: `<ul>${summary.topFrictionPoints.map((f) => `<li><strong>${escapeHtml(f.label)}</strong> : ${f.count}</li>`).join('')}</ul>`;

	const ratesHtml = summary.successRateByScenario
		.map(
			(r) =>
				`<li><strong>${escapeHtml(r.scenarioTitle)}</strong> : ${r.rate}% (${r.completed}/${r.total})</li>`
		)
		.join('');

	return `<!DOCTYPE html>
<html lang="fr">
<head>
	<meta charset="utf-8">
	<title>CJM — ${escapeHtml(campaign.name)}</title>
	<style>
		body { font-family: system-ui, sans-serif; max-width: 1100px; margin: 2rem auto; padding: 0 1rem; color: #1a1a1a; }
		h1 { font-size: 1.5rem; }
		h2 { font-size: 1.15rem; margin-top: 2rem; }
		.task { font-style: italic; color: #555; }
		table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.85rem; }
		th, td { border: 1px solid #ccc; padding: 0.5rem; vertical-align: top; text-align: left; }
		th { background: #f5f5f5; }
		.tester { font-weight: 600; white-space: nowrap; }
		.pain { color: #c0392b; display: block; margin-bottom: 0.25rem; }
		.success { color: #27ae60; display: block; margin-bottom: 0.25rem; }
		.comment { color: #2980b9; display: block; margin-bottom: 0.25rem; }
		@media print { body { margin: 0; } section { page-break-inside: avoid; } }
	</style>
</head>
<body>
	<h1>Customer Journey Map — ${escapeHtml(campaign.name)}</h1>
	<p>${escapeHtml(campaign.dateRange)}</p>
	<h2>Synthèse</h2>
	<h3>Points de friction</h3>
	${frictionHtml}
	<h3>Taux de réussite</h3>
	<ul>${ratesHtml}</ul>
	${gridsHtml}
</body>
</html>`;
}

export function exportJson(campaign: Campaign): string {
	return JSON.stringify(campaign, null, 2);
}
