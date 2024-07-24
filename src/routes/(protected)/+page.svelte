<script lang="ts">
	import { Button, Card } from "@kayord/ui";

	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();
</script>

<div class="m-4 flex items-center gap-2">
	<Button href="/kv">KV</Button>
	<Button href="/time">Time</Button>
</div>
