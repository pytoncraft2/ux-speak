import { browser } from '$app/environment';
import {
	exportCampaignJson,
	importCampaignJson,
	loadCampaign,
	loadSessionState,
	resetToDefault,
	saveCampaign,
	saveSessionState
} from '$lib/storage/persistence';
import type {
	Campaign,
	Observation,
	ObservationType,
	Scenario,
	ScenarioResult,
	ScenarioStatus,
	Tester
} from '$lib/types';

function createId(): string {
	return crypto.randomUUID();
}

function debounce<T extends (...args: Parameters<T>) => void>(fn: T, ms: number): T {
	let timer: ReturnType<typeof setTimeout> | undefined;
	return ((...args: Parameters<T>) => {
		clearTimeout(timer);
		timer = setTimeout(() => fn(...args), ms);
	}) as T;
}

class CampaignStore {
	campaign = $state<Campaign>(loadCampaign());
	activeTesterId = $state('');
	activeScenarioId = $state('');

	private schedulePersist = debounce(() => {
		if (!browser) return;
		saveCampaign(this.campaign);
		saveSessionState({
			activeTesterId: this.activeTesterId,
			activeScenarioId: this.activeScenarioId
		});
	}, 300);

	constructor() {
		const session = loadSessionState(this.campaign);
		this.activeTesterId = session.activeTesterId;
		this.activeScenarioId = session.activeScenarioId;
	}

	private persist(): void {
		this.schedulePersist();
	}

	get activeTester(): Tester | undefined {
		return this.campaign.testers.find((t) => t.id === this.activeTesterId);
	}

	get activeScenario(): Scenario | undefined {
		return this.campaign.scenarios.find((s) => s.id === this.activeScenarioId);
	}

	get sortedScenarios(): Scenario[] {
		return [...this.campaign.scenarios].sort((a, b) => a.order - b.order);
	}

	get filteredObservations(): Observation[] {
		return this.campaign.observations
			.filter(
				(o) => o.testerId === this.activeTesterId && o.scenarioId === this.activeScenarioId
			)
			.sort((a, b) => b.timestamp - a.timestamp);
	}

	get currentResult(): ScenarioResult | undefined {
		return this.campaign.results.find(
			(r) => r.testerId === this.activeTesterId && r.scenarioId === this.activeScenarioId
		);
	}

	setActiveTester(id: string): void {
		this.activeTesterId = id;
		this.persist();
	}

	setActiveScenario(id: string): void {
		this.activeScenarioId = id;
		this.persist();
	}

	nextScenario(): void {
		const scenarios = this.sortedScenarios;
		const index = scenarios.findIndex((s) => s.id === this.activeScenarioId);
		if (index >= 0 && index < scenarios.length - 1) {
			this.activeScenarioId = scenarios[index + 1].id;
			this.persist();
		}
	}

	prevScenario(): void {
		const scenarios = this.sortedScenarios;
		const index = scenarios.findIndex((s) => s.id === this.activeScenarioId);
		if (index > 0) {
			this.activeScenarioId = scenarios[index - 1].id;
			this.persist();
		}
	}

	addObservation(type: ObservationType, note?: string, phaseId?: string): void {
		const observation: Observation = {
			id: createId(),
			testerId: this.activeTesterId,
			scenarioId: this.activeScenarioId,
			type,
			note: note?.trim() || undefined,
			phaseId: phaseId || undefined,
			timestamp: Date.now()
		};
		this.campaign.observations = [...this.campaign.observations, observation];
		this.persist();
	}

	removeObservation(id: string): void {
		this.campaign.observations = this.campaign.observations.filter((o) => o.id !== id);
		this.persist();
	}

	ensureResult(): ScenarioResult {
		const existing = this.currentResult;
		if (existing) return existing;

		const scenario = this.activeScenario;
		const result: ScenarioResult = {
			testerId: this.activeTesterId,
			scenarioId: this.activeScenarioId,
			status: 'pending',
			criteriaMet: scenario ? scenario.successCriteria.map(() => false) : []
		};
		this.campaign.results = [...this.campaign.results, result];
		return result;
	}

	setCriterionMet(index: number, met: boolean): void {
		const result = this.ensureResult();
		const updated = [...result.criteriaMet];
		updated[index] = met;
		this.updateResult({ criteriaMet: updated });
	}

	setResultStatus(status: ScenarioStatus): void {
		this.updateResult({ status });
	}

	setResultNotes(notes: string): void {
		this.updateResult({ notes: notes.trim() || undefined });
	}

	private updateResult(partial: Partial<ScenarioResult>): void {
		const idx = this.campaign.results.findIndex(
			(r) => r.testerId === this.activeTesterId && r.scenarioId === this.activeScenarioId
		);
		if (idx === -1) {
			const scenario = this.activeScenario;
			const result: ScenarioResult = {
				testerId: this.activeTesterId,
				scenarioId: this.activeScenarioId,
				status: 'pending',
				criteriaMet: scenario ? scenario.successCriteria.map(() => false) : [],
				...partial
			};
			this.campaign.results = [...this.campaign.results, result];
			this.persist();
			return;
		}

		this.campaign.results = this.campaign.results.map((r, i) =>
			i === idx ? { ...r, ...partial } : r
		);
		this.persist();
	}

	updateCampaignInfo(name: string, dateRange: string, objectives: string[]): void {
		this.campaign = { ...this.campaign, name, dateRange, objectives };
		this.persist();
	}

	updateTester(id: string, data: Partial<Omit<Tester, 'id'>>): void {
		this.campaign.testers = this.campaign.testers.map((t) =>
			t.id === id ? { ...t, ...data } : t
		);
		this.persist();
	}

	addTester(tester: Omit<Tester, 'id'>): void {
		this.campaign.testers = [...this.campaign.testers, { ...tester, id: createId() }];
		this.persist();
	}

	removeTester(id: string): void {
		this.campaign.testers = this.campaign.testers.filter((t) => t.id !== id);
		this.campaign.observations = this.campaign.observations.filter((o) => o.testerId !== id);
		this.campaign.results = this.campaign.results.filter((r) => r.testerId !== id);
		if (this.activeTesterId === id) {
			this.activeTesterId = this.campaign.testers[0]?.id ?? '';
		}
		this.persist();
	}

	updateScenario(id: string, data: Partial<Omit<Scenario, 'id'>>): void {
		this.campaign.scenarios = this.campaign.scenarios.map((s) =>
			s.id === id ? { ...s, ...data } : s
		);
		this.persist();
	}

	addScenario(scenario: Omit<Scenario, 'id'>): void {
		this.campaign.scenarios = [...this.campaign.scenarios, { ...scenario, id: createId() }];
		this.persist();
	}

	removeScenario(id: string): void {
		this.campaign.scenarios = this.campaign.scenarios.filter((s) => s.id !== id);
		this.campaign.observations = this.campaign.observations.filter((o) => o.scenarioId !== id);
		this.campaign.results = this.campaign.results.filter((r) => r.scenarioId !== id);
		if (this.activeScenarioId === id) {
			this.activeScenarioId = this.sortedScenarios[0]?.id ?? '';
		}
		this.persist();
	}

	resetCampaign(): void {
		this.campaign = resetToDefault();
		this.activeTesterId = this.campaign.testers[0]?.id ?? '';
		this.activeScenarioId = this.campaign.scenarios[0]?.id ?? '';
		this.persist();
	}

	exportJson(): string {
		return exportCampaignJson(this.campaign);
	}

	importJson(json: string): void {
		this.campaign = importCampaignJson(json);
		const session = loadSessionState(this.campaign);
		this.activeTesterId = session.activeTesterId;
		this.activeScenarioId = session.activeScenarioId;
		this.persist();
	}

	getStats() {
		const totalObservations = this.campaign.observations.length;
		const completedResults = this.campaign.results.filter((r) => r.status !== 'pending').length;
		const totalPossible = this.campaign.testers.length * this.campaign.scenarios.length;
		const painPoints = this.campaign.observations.filter((o) =>
			['hesitation', 'blocked', 'difficulty'].includes(o.type)
		).length;

		return { totalObservations, completedResults, totalPossible, painPoints };
	}
}

export const campaignStore = new CampaignStore();

export function getCampaignStore() {
	return campaignStore;
}
