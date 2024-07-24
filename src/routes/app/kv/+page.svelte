<script lang="ts">
	import { Button, Card } from "@kayord/ui";

	export let data;
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
			<Card.Description>t{d.name}</Card.Description>
		</Card.Header>
		<Card.Footer>
			<form method="POST" action="?/delete">
				<input type="hidden" name="id" value={d.id} />
				<Button type="submit" variant="destructive">Delete</Button>
			</form>
		</Card.Footer>
	</Card.Root>
{/each}
