<script lang="ts">
	import Invoice from "#lib/components/Invoice.svelte";
	import { getPdf } from "./pdf.remote";
	import { page } from "$app/state";

	const data = $derived(
		await getPdf({
			user: page.params.user ?? "",
			project: page.params.project,
			date: page.params.date ?? "",
		})
	);
</script>

<Invoice {data} theme={page.url.searchParams.get("theme") ?? "light"} />
