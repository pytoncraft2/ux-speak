import { SNCF_DEFAULT_CAMPAIGN } from '$lib/data/sncf-default';
import type { Campaign, SessionState } from '$lib/types';

const CAMPAIGN_KEY = 'ux-speak-campaign';
const SESSION_KEY = 'ux-speak-session';

function cloneCampaign(campaign: Campaign): Campaign {
	return structuredClone(campaign);
}

export function loadCampaign(): Campaign {
	if (typeof localStorage === 'undefined') {
		return cloneCampaign(SNCF_DEFAULT_CAMPAIGN);
	}

	const stored = localStorage.getItem(CAMPAIGN_KEY);
	if (!stored) {
		return cloneCampaign(SNCF_DEFAULT_CAMPAIGN);
	}

	try {
		return JSON.parse(stored) as Campaign;
	} catch {
		return cloneCampaign(SNCF_DEFAULT_CAMPAIGN);
	}
}

export function saveCampaign(campaign: Campaign): void {
	if (typeof localStorage === 'undefined') return;
	localStorage.setItem(CAMPAIGN_KEY, JSON.stringify(campaign));
}

export function loadSessionState(campaign: Campaign): SessionState {
	if (typeof localStorage === 'undefined') {
		return {
			activeTesterId: campaign.testers[0]?.id ?? '',
			activeScenarioId: campaign.scenarios[0]?.id ?? ''
		};
	}

	const stored = localStorage.getItem(SESSION_KEY);
	if (stored) {
		try {
			const parsed = JSON.parse(stored) as SessionState;
			const testerExists = campaign.testers.some((t) => t.id === parsed.activeTesterId);
			const scenarioExists = campaign.scenarios.some((s) => s.id === parsed.activeScenarioId);
			if (testerExists && scenarioExists) {
				return parsed;
			}
		} catch {
			// fall through to defaults
		}
	}

	return {
		activeTesterId: campaign.testers[0]?.id ?? '',
		activeScenarioId: campaign.scenarios[0]?.id ?? ''
	};
}

export function saveSessionState(state: SessionState): void {
	if (typeof localStorage === 'undefined') return;
	localStorage.setItem(SESSION_KEY, JSON.stringify(state));
}

export function resetToDefault(): Campaign {
	const campaign = cloneCampaign(SNCF_DEFAULT_CAMPAIGN);
	saveCampaign(campaign);
	return campaign;
}

export function exportCampaignJson(campaign: Campaign): string {
	return JSON.stringify(campaign, null, 2);
}

export function importCampaignJson(json: string): Campaign {
	const parsed = JSON.parse(json) as Campaign;
	if (!parsed.id || !parsed.testers || !parsed.scenarios) {
		throw new Error('Format JSON invalide');
	}
	return parsed;
}
