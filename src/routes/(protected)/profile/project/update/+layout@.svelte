<script lang="ts">
	import Header from "$lib/components/Header.svelte";
	let { children, data } = $props();
</script>

<Header user={data?.user ?? undefined} />
{@render children()}
