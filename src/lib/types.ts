export type ObservationType = 'hesitation' | 'blocked' | 'success' | 'difficulty' | 'comment';

export type ScenarioStatus = 'success' | 'partial' | 'failed' | 'pending';

export interface JourneyPhase {
	id: string;
	name: string;
}

export interface Tester {
	id: string;
	name: string;
	persona: string;
	testDate: string;
	context: string;
}

export interface Scenario {
	id: string;
	title: string;
	objective: string;
	task: string;
	successCriteria: string[];
	phases: JourneyPhase[];
	order: number;
}

export interface Observation {
	id: string;
	testerId: string;
	scenarioId: string;
	type: ObservationType;
	note?: string;
	phaseId?: string;
	timestamp: number;
}

export interface ScenarioResult {
	testerId: string;
	scenarioId: string;
	status: ScenarioStatus;
	criteriaMet: boolean[];
	notes?: string;
}

export interface Campaign {
	id: string;
	name: string;
	dateRange: string;
	objectives: string[];
	testers: Tester[];
	scenarios: Scenario[];
	observations: Observation[];
	results: ScenarioResult[];
}

export interface SessionState {
	activeTesterId: string;
	activeScenarioId: string;
}

export const OBSERVATION_LABELS: Record<ObservationType, string> = {
	hesitation: 'Hésitation',
	blocked: 'Bloqué',
	success: 'Succès',
	difficulty: 'Difficulté',
	comment: 'Commentaire'
};

export const OBSERVATION_TYPES: ObservationType[] = [
	'hesitation',
	'blocked',
	'success',
	'difficulty',
	'comment'
];

export const STATUS_LABELS: Record<ScenarioStatus, string> = {
	success: 'Réussi',
	partial: 'Partiel',
	failed: 'Échoué',
	pending: 'En cours'
};
