<script lang="ts">
	import { invalidateAll } from "$app/navigation";
	import { AlertDialog } from "@kayord/ui";
	import { toast } from "svelte-sonner";
	import { deleteTime } from "./delete.remote";

	interface Props {
		id: number;
		open?: boolean;
	}

	type DeleteTimeResult = { success: boolean; message: string };

	let { id = $bindable(0), open = $bindable(false) }: Props = $props();
	let isDeleting = $state(false);

	const handleDelete = async () => {
		if (!id || isDeleting) return;

		try {
			isDeleting = true;
			const result = (await deleteTime(id)) as DeleteTimeResult;

			if (!result.success) {
				toast.error(result.message ?? "Could not delete time entry");
				return;
			}

			open = false;
			toast(result.message);
			await invalidateAll();
		} catch {
			toast.error("Could not delete time entry");
		} finally {
			isDeleting = false;
		}
	};
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Delete time entry?</AlertDialog.Title>
			<AlertDialog.Description>
				This removes only the selected time entry and cannot be undone.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel disabled={isDeleting}>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action
				disabled={isDeleting}
				onclick={handleDelete}
				class="bg-destructive text-destructive-foreground hover:bg-destructive/80"
			>
				{isDeleting ? "Deleting..." : "Delete"}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
