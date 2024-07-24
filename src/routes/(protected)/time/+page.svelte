<script lang="ts">
	import { Button, Card } from "@kayord/ui";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();
</script>

<div class="m-4">
	<form method="POST" action="?/create">
		<Button type="submit">Create</Button>
	</form>
</div>

{#each data.data as d}
	<Card.Root class="m-4">
		<Card.Header>
			<Card.Title>{d.id}</Card.Title>
			<Card.Description>{d.description}</Card.Description>
		</Card.Header>
		<Card.Content>
			Date: {d.date}
		</Card.Content>
		<Card.Footer>
			<form method="POST" action="?/delete">
				<input type="hidden" name="id" value={d.id} />
				<Button type="submit" variant="destructive">Delete</Button>
			</form>
		</Card.Footer>
	</Card.Root>
{/each}
