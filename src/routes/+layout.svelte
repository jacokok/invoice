<script lang="ts">
	import type { Snippet } from "svelte";
	import "../app.pcss";

	let { children }: { children?: Snippet } = $props();
</script>

{#if children}
	{@render children()}
{/if}
