<script lang="ts">
	import { Button, DropdownMenu, Table } from "@kayord/ui";
	import type { PageData } from "./$types";
	import EllipsisIcon from "lucide-svelte/icons/ellipsis";
	import EditIcon from "lucide-svelte/icons/pencil";
	import TrashIcon from "lucide-svelte/icons/trash";
	import DeleteTime from "./DeleteTime.svelte";
	import Pagination from "$lib/components/Pagination.svelte";
	import CreateIcon from "lucide-svelte/icons/plus";
	import DownloadIcon from "lucide-svelte/icons/download";
	import { goto } from "$app/navigation";

	let { data }: { data: PageData } = $props();

	let deleteConfirm = $state(false);
	let deleteId = $state(0);
</script>

<div class="m-2">
	<div class="flex w-full items-center justify-between py-2 pb-4">
		<Button href="/pdfOptions">
			<DownloadIcon class="mr-2 size-5" />Generate PDF
		</Button>
		<Button href="/update">
			<CreateIcon class="mr-2 size-5" />Create
		</Button>
	</div>

	<div class="rounded-md border">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-[100px]">Date</Table.Head>
					<Table.Head class="w-[100px]">Hours</Table.Head>
					<Table.Head class="w-[100px]">Project</Table.Head>
					<Table.Head class="w-full">Description</Table.Head>
					<Table.Head>Options</Table.Head>
				</Table.Row>
			</Table.Header>

			<Table.Body>
				{#each data.data as d, i (i)}
					<Table.Row>
						<Table.Cell class="font-medium">{d.date.toLocaleDateString()}</Table.Cell>
						<Table.Cell>{d.hours}</Table.Cell>
						<Table.Cell>{d.project.name}</Table.Cell>
						<Table.Cell class="whitespace-pre-line">{d.description}</Table.Cell>
						<Table.Cell class="text-center">
							<DropdownMenu.Root>
								<DropdownMenu.Trigger><EllipsisIcon class="size-5" /></DropdownMenu.Trigger>
								<DropdownMenu.Content>
									<DropdownMenu.Item onclick={() => goto(`/update/${d.id}`)}>
										<EditIcon class="mr-2 size-5" /> Edit
									</DropdownMenu.Item>
									<DropdownMenu.Item
										onclick={() => {
											deleteConfirm = true;
											deleteId = d.id;
										}}
									>
										<TrashIcon class="mr-2 size-5" /> Delete
									</DropdownMenu.Item>
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
		{#if data.data.length <= 0}
			<div class="p-2 text-muted-foreground">No data available</div>
		{/if}
	</div>
	<div class="flex justify-center p-2">
		<Pagination count={data.total} perPage={data.limit} />
	</div>
</div>
<DeleteTime bind:id={deleteId} bind:open={deleteConfirm} />
