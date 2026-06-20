<script lang="ts">
	import { getCampaignStore } from '$lib/stores/campaign.svelte';
	import { downloadFile, exportHtml, exportJson, exportMarkdown } from '$lib/utils/export';

	const store = getCampaignStore();

	interface Props {
		scenarioId?: string;
		showJson?: boolean;
	}

	let { scenarioId = '', showJson = true }: Props = $props();

	const slug = $derived(
		store.campaign.name
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, '')
	);

	function exportMd() {
		const content = exportMarkdown(store.campaign, scenarioId || undefined);
		downloadFile(content, `cjm-${slug}.md`, 'text/markdown');
	}

	function exportHtmlFile() {
		const content = exportHtml(store.campaign, scenarioId || undefined);
		downloadFile(content, `cjm-${slug}.html`, 'text/html');
	}

	function exportJsonFile() {
		const content = exportJson(store.campaign);
		downloadFile(content, `ux-speak-${slug}.json`, 'application/json');
	}

	function importJson(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = () => {
			try {
				store.importJson(reader.result as string);
			} catch {
				alert('Fichier JSON invalide.');
			}
		};
		reader.readAsText(file);
		input.value = '';
	}
</script>

<div class="export-actions">
	<button type="button" class="btn btn--primary" onclick={exportMd}>Exporter Markdown</button>
	<button type="button" class="btn" onclick={exportHtmlFile}>Exporter HTML (impression PDF)</button>
	{#if showJson}
		<button type="button" class="btn" onclick={exportJsonFile}>Exporter JSON</button>
		<label class="btn" style="cursor: pointer;">
			Importer JSON
			<input type="file" accept=".json,application/json" hidden onchange={importJson} />
		</label>
	{/if}
</div>
