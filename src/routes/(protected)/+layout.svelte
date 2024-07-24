<script lang="ts">
	import type { LayoutData } from "./$types";

	import type { Snippet } from "svelte";
	import Header from "$lib/components/Header.svelte";

	let { children, data }: { children?: Snippet; data: LayoutData } = $props();
</script>

<Header />
{#if children}
	{@render children()}
{/if}
