<script lang="ts">
	import { AlertDialog } from "@kayord/ui";

	interface Props {
		id: number;
		open?: boolean;
	}

	let { id = $bindable(0), open = $bindable(false) }: Props = $props();
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Delete time logged?</AlertDialog.Title>
			<AlertDialog.Description>
				This will remove the time logged permanently. Do you want to proceed?
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<form method="POST" action="?/delete">
				<input type="hidden" name="id" value={id} />
				<AlertDialog.Action
					type="submit"
					class="bg-destructive text-destructive-foreground hover:bg-destructive/80"
				>
					Delete
				</AlertDialog.Action>
			</form>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
