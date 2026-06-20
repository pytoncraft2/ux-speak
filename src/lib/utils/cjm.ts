import type { Campaign, Observation, ObservationType, Scenario, ScenarioResult } from '$lib/types';
import { OBSERVATION_LABELS, STATUS_LABELS } from '$lib/types';

export interface CjmCell {
	painPoints: Observation[];
	successes: Observation[];
	comments: Observation[];
}

export interface CjmRow {
	testerId: string;
	testerName: string;
	cells: Map<string, CjmCell>;
}

export interface CjmGrid {
	scenario: Scenario;
	rows: CjmRow[];
	phases: { id: string; name: string }[];
}

export interface CjmSummary {
	topFrictionPoints: { label: string; count: number }[];
	successRateByScenario: { scenarioTitle: string; rate: number; completed: number; total: number }[];
}

const PAIN_TYPES: ObservationType[] = ['hesitation', 'blocked', 'difficulty'];

function emptyCell(): CjmCell {
	return { painPoints: [], successes: [], comments: [] };
}

export function buildCjmGrid(
	campaign: Campaign,
	scenarioId: string,
	testerFilter?: string
): CjmGrid | null {
	const scenario = campaign.scenarios.find((s) => s.id === scenarioId);
	if (!scenario) return null;

	const testers = testerFilter
		? campaign.testers.filter((t) => t.id === testerFilter)
		: campaign.testers;

	const rows: CjmRow[] = testers.map((tester) => {
		const cells = new Map<string, CjmCell>();
		for (const phase of scenario.phases) {
			cells.set(phase.id, emptyCell());
		}

		const observations = campaign.observations.filter(
			(o) => o.scenarioId === scenarioId && o.testerId === tester.id
		);

		for (const obs of observations) {
			const phaseId = obs.phaseId ?? scenario.phases[0]?.id;
			if (!phaseId) continue;

			if (!cells.has(phaseId)) {
				cells.set(phaseId, emptyCell());
			}

			const cell = cells.get(phaseId)!;
			if (PAIN_TYPES.includes(obs.type)) {
				cell.painPoints.push(obs);
			} else if (obs.type === 'success') {
				cell.successes.push(obs);
			} else {
				cell.comments.push(obs);
			}
		}

		return { testerId: tester.id, testerName: tester.name, cells };
	});

	return { scenario, rows, phases: scenario.phases };
}

export function buildCjmSummary(campaign: Campaign): CjmSummary {
	const frictionCounts = new Map<string, number>();

	for (const obs of campaign.observations) {
		if (!PAIN_TYPES.includes(obs.type)) continue;
		const label = OBSERVATION_LABELS[obs.type];
		frictionCounts.set(label, (frictionCounts.get(label) ?? 0) + 1);
	}

	const topFrictionPoints = [...frictionCounts.entries()]
		.map(([label, count]) => ({ label, count }))
		.sort((a, b) => b.count - a.count);

	const successRateByScenario = [...campaign.scenarios]
		.sort((a, b) => a.order - b.order)
		.map((scenario) => {
			const results = campaign.results.filter(
				(r) => r.scenarioId === scenario.id && r.status !== 'pending'
			);
			const successes = results.filter((r) => r.status === 'success').length;
			const total = campaign.testers.length;
			return {
				scenarioTitle: scenario.title,
				rate: total > 0 ? Math.round((successes / total) * 100) : 0,
				completed: results.length,
				total
			};
		});

	return { topFrictionPoints, successRateByScenario };
}

export function getResultFor(
	campaign: Campaign,
	testerId: string,
	scenarioId: string
): ScenarioResult | undefined {
	return campaign.results.find((r) => r.testerId === testerId && r.scenarioId === scenarioId);
}

export function formatTime(timestamp: number): string {
	return new Date(timestamp).toLocaleTimeString('fr-FR', {
		hour: '2-digit',
		minute: '2-digit'
	});
}

export { STATUS_LABELS, OBSERVATION_LABELS };
