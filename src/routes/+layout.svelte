<script lang="ts">
	import "../app.pcss";
	import { Toaster } from "@kayord/ui";
	import { ModeWatcher } from "@kayord/ui/mode-watcher";

	let { children } = $props();
</script>

<ModeWatcher />
<Toaster />
{@render children()}
