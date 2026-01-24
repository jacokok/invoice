<script lang="ts">
	import { authClient } from "$lib/auth-client.js";
	import Header from "$lib/components/Header.svelte";

	let { children } = $props();

	const { data: session } = await authClient.getSession();
</script>

<Header {session} />
{@render children()}
