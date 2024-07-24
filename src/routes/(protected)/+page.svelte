<script lang="ts">
	import { Button, Card } from "@kayord/ui";

	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();
</script>

<div class="m-4">Home Page</div>

<Button href="/kv">KV</Button>

<Card.Root class="m-4">
	<Card.Header>
		<Card.Title>Test</Card.Title>
		<Card.Description>Test</Card.Description>
	</Card.Header>
	<Card.Content>
		{JSON.stringify(data.user)}
	</Card.Content>
</Card.Root>
