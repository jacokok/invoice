<script lang="ts">
	import { AlertDialog } from "@kayord/ui";
	import { deleteProject, getProjects } from "../project/project.remote";
	import { toast } from "svelte-sonner";

	interface Props {
		id: number;
		open?: boolean;
	}

	let { id = $bindable(0), open = $bindable(false) }: Props = $props();

	const removeProject = async () => {
		try {
			await deleteProject(id);
			await getProjects().refresh();
		} catch (error) {
			console.log(error);
			toast.error("Failed to delete project. Please try again.");
		} finally {
			open = false;
		}
	};
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Delete project?</AlertDialog.Title>
			<AlertDialog.Description>
				This will remove the entire project permanently. Do you want to proceed?
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action
				type="submit"
				class="bg-destructive text-destructive-foreground hover:bg-destructive/80"
				onclick={removeProject}
			>
				Delete
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
