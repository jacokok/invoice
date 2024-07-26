<script lang="ts">
	import { Button, Card, DropdownMenu } from "@kayord/ui";
	import EmptyIcon from "lucide-svelte/icons/nut-off";
	import EllipsisIcon from "lucide-svelte/icons/ellipsis";
	import DeleteProject from "./DeleteProject.svelte";

	let { data } = $props();

	let deleteConfirm = $state(false);
	let deleteId = $state(0);
</script>

<div class="m-4 flex flex-col gap-2">
	<div class="flex justify-end">
		<Button href="/profile/project/update">Create Project</Button>
	</div>

	{#if data.projects.length <= 0}
		<Card.Root>
			<Card.Header class="flex flex-row items-center gap-2">
				<div class="flex items-center justify-center rounded-full bg-muted p-2">
					<EmptyIcon class="size-7" />
				</div>
				<div class="flex flex-col gap-1">
					<Card.Title>Projects</Card.Title>
					<Card.Description>User Does not have any projects yet.</Card.Description>
				</div>
			</Card.Header>
		</Card.Root>
	{/if}

	{#each data.projects as project}
		<Card.Root class="flex items-center justify-between">
			<Card.Header>
				<Card.Title>{project.name}</Card.Title>
				<Card.Description>{project.billName}</Card.Description>
			</Card.Header>
			<div class="mr-2">
				<DropdownMenu.Root>
					<DropdownMenu.Trigger asChild let:builder>
						<Button variant="outline" size="icon" builders={[builder]}>
							<EllipsisIcon class="size-5" />
						</Button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content>
						<DropdownMenu.Item href="/profile/project/update/{project.id}">Edit</DropdownMenu.Item>
						<DropdownMenu.Item
							onclick={() => {
								deleteConfirm = true;
								deleteId = project.id;
							}}
						>
							Delete
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		</Card.Root>
	{/each}
</div>

<DeleteProject bind:id={deleteId} bind:open={deleteConfirm} />
