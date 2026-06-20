<script lang="ts">
	import { getCampaignStore } from '$lib/stores/campaign.svelte';
	import ExportPanel from '$lib/components/ExportPanel.svelte';
	import QuickCapture from '$lib/components/QuickCapture.svelte';
	import ObservationTimeline from '$lib/components/ObservationTimeline.svelte';
	import ScenarioSelector from '$lib/components/ScenarioSelector.svelte';
	import SuccessCriteriaPanel from '$lib/components/SuccessCriteriaPanel.svelte';
	import TesterTabs from '$lib/components/TesterTabs.svelte';

	const store = getCampaignStore();
</script>

<svelte:head>
	<title>Session live — UX Speak</title>
</svelte:head>

<h1 class="page-title">Session live</h1>
<p class="page-subtitle">{store.campaign.name}</p>

<ScenarioSelector />
<TesterTabs />

<QuickCapture />
<ObservationTimeline />
<SuccessCriteriaPanel />
