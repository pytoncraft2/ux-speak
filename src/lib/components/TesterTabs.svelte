<script lang="ts">
	import { getCampaignStore } from '$lib/stores/campaign.svelte';

	const store = getCampaignStore();

	interface Props {
		testers?: typeof store.campaign.testers;
		activeId?: string;
		onselect?: (id: string) => void;
	}

	let { testers = store.campaign.testers, activeId = store.activeTesterId, onselect }: Props =
		$props();

	function select(id: string) {
		if (onselect) {
			onselect(id);
		} else {
			store.setActiveTester(id);
		}
	}
</script>

<div class="tester-tabs" role="tablist">
	{#each testers as tester (tester.id)}
		<button
			type="button"
			role="tab"
			class="tester-tab"
			class:active={activeId === tester.id}
			aria-selected={activeId === tester.id}
			onclick={() => select(tester.id)}
		>
			{tester.name}
		</button>
	{/each}
</div>
