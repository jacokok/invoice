<script lang="ts">
	import { resolve } from "$app/paths";
	import { Button, DropdownMenu } from "@kayord/ui";
	import { createShadTable, DataTable, renderSnippet } from "@kayord/ui/data-table";
	import DeleteTime from "./DeleteTime.svelte";
	import EllipsisIcon from "@lucide/svelte/icons/ellipsis";
	import EditIcon from "@lucide/svelte/icons/pencil";
	import TrashIcon from "@lucide/svelte/icons/trash";
	import Pagination from "#lib/components/Pagination.svelte";
	import CreateIcon from "@lucide/svelte/icons/plus";
	import DownloadIcon from "@lucide/svelte/icons/download";
	import { goto } from "$app/navigation";

	import { getTime } from "./time.remote";

	type TimeEntry = Awaited<ReturnType<typeof getTime>>["data"][number];

	let page = $state(1);
	const timeQuery = $derived(getTime(page));
	const data = $derived(timeQuery.current);
	const isLoading = $derived(!timeQuery.ready);
	let deleteConfirm = $state(false);
	let deleteId = $state(0);

	const table = createShadTable<TimeEntry>({
		get data() {
			return data?.data ?? [];
		},
		columns: [
			{
				accessorKey: "date",
				header: "Date",
				cell: ({ row }) => row.original.date.toLocaleDateString(),
				meta: { className: "font-medium" },
			},
			{ accessorKey: "hours", header: "Hours" },
			{ accessorKey: "project.name", header: "Project" },
			{
				accessorKey: "description",
				header: "Description",
				meta: { className: "whitespace-pre-line" },
			},
			{
				id: "options",
				header: "Options",
				cell: ({ row }) => renderSnippet(options, row.original),
				meta: { className: "text-center" },
			},
		],
		getRowId: (row) => String(row.id),
		manualPagination: true,
		enableSorting: false,
	});
</script>

{#snippet options(entry: TimeEntry)}
	<DropdownMenu.Root>
		<DropdownMenu.Trigger aria-label="Time entry options">
			<EllipsisIcon class="size-4" />
		</DropdownMenu.Trigger>
		<DropdownMenu.Content>
			<DropdownMenu.Item
				onclick={() => goto(resolve("/(protected)/update/[[id]]", { id: String(entry.id) }))}
			>
				<EditIcon /> Edit
			</DropdownMenu.Item>
			<DropdownMenu.Item
				variant="destructive"
				onclick={() => {
					deleteId = entry.id;
					deleteConfirm = true;
				}}
			>
				<TrashIcon /> Delete
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/snippet}

<div class="m-2">
	<div class="flex w-full items-center justify-between py-2 pb-4">
		<Button href="/pdfOptions">
			<DownloadIcon />Generate PDF
		</Button>
		<Button href="/update/0">
			<CreateIcon />Create
		</Button>
	</div>

	{#if timeQuery.error}
		<div role="alert" class="mb-2 flex items-center justify-between gap-2">
			<p>Could not load time entries. Please try again.</p>
			<Button onclick={() => timeQuery.refresh().catch(() => {})}>Retry</Button>
		</div>
	{/if}
	<div aria-busy={isLoading}>
		{#if isLoading}
			<span role="status" class="sr-only">Loading time entries…</span>
		{/if}
		<DataTable
			{table}
			{isLoading}
			pagination={false}
			disableUISorting
			noDataMessage={timeQuery.error ? "Time entries unavailable" : "No data available"}
		/>
	</div>
	{#if data}
		<div class="flex justify-center p-2">
			<Pagination bind:page count={data.total} perPage={data.limit} />
		</div>
	{/if}
</div>

<DeleteTime bind:id={deleteId} bind:open={deleteConfirm} />
