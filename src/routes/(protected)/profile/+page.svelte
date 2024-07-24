<script lang="ts">
	import { Card } from "@kayord/ui";
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<Card.Root class="m-4">
	<Card.Header>
		<Card.Title>{data.user?.name}</Card.Title>
		<Card.Description>{data.user?.email}</Card.Description>
	</Card.Header>
	<Card.Content>
		<div>{JSON.stringify(data)}</div>
	</Card.Content>
</Card.Root>
