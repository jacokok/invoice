<script lang="ts">
	import { ModeWatcher } from "mode-watcher";
	import { authClient } from "#lib/auth-client.ts";
	import Header from "#lib/components/Header.svelte";

	let { children } = $props();

	const { data: session } = await authClient.getSession();
</script>

<ModeWatcher />
<Header {session} />
{@render children()}
