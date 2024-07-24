<script lang="ts">
	import "../app.pcss";
	import { Toaster } from "@kayord/ui";

	let { children } = $props();
</script>

<Toaster />
{@render children()}
