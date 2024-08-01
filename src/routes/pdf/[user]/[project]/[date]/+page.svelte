<script lang="ts">
	import { Avatar, Separator } from "@kayord/ui";
	import type { PageData } from "./$types";
	import { dateToString, getInitials } from "$lib/util";
	import Section from "./Section.svelte";
	import Item from "./Item.svelte";
	import { mode } from "@kayord/ui/mode-watcher";

	let { data }: { data: PageData } = $props();

	const totalHours = $derived.by(() => {
		let total = 0;
		for (const t of data.time) {
			total += t.hours;
		}
		return total;
	});

	const total = $derived(totalHours * data.project.rate);

	const primaryColor = $derived(
		$mode == "light" ? data.project.primaryColorLight : data.project.primaryColorDark
	);

	const backgroundStyle = $derived(`background-color: ${primaryColor};`);
	const textStyle = $derived(`color: ${primaryColor};`);
</script>

<div class="bg-secondary">
	<div class="h-1" style={backgroundStyle}></div>
	<div class="mx-6 flex items-center justify-between py-4">
		<div class="flex items-center">
			<Avatar.Root class="mr-3 size-16">
				<Avatar.Fallback
					class="bg-primary text-3xl font-bold text-primary-foreground"
					style={backgroundStyle}
				>
					{getInitials(data.userDetail.name)}
				</Avatar.Fallback>
			</Avatar.Root>
			<div>
				<h2 style={textStyle}>{data.userDetail.name}</h2>
				<div class="text-sm">{data.userDetail.email}</div>
				<div class="text-sm">{data.userDetail.contactNumber}</div>
			</div>
		</div>
		<div class="text-right text-sm">
			<div class="whitespace-pre-line">
				{data.userDetail.address}
			</div>
		</div>
	</div>
</div>

<div class="mx-6 my-6 flex items-center justify-between">
	<div class="flex flex-col gap-2">
		<div class="text-muted-foreground">Billed to</div>
		<div>
			<div class="font-bold">{data.project?.billName}</div>
			<div class="whitespace-pre-line">{data.project?.billAddress}</div>
		</div>
	</div>
	<div class="flex flex-col gap-2 text-right">
		<div>
			<div class="text-muted-foreground">Invoice Number</div>
			<div>#{data.userDetail.invoiceNumber}</div>
		</div>
		<div>
			<div class="text-muted-foreground">Invoice Date</div>
			<div>{dateToString(new Date())}</div>
		</div>
	</div>
</div>

<Section titleLeft="item details" titleRight="hours" {textStyle} />
{#each data.time as time (time.id)}
	<Item date={time.date} description={time.description} hours={time.hours} />
{/each}

<div class="break-inside-avoid">
	<Section titleLeft="Banking Details" titleRight="Summary" {textStyle} />
	<div class="h-1" style={backgroundStyle}></div>

	<div class="mx-6 my-6 flex items-center justify-between">
		<div class="grid grid-cols-2 gap-x-6">
			<div class="text-muted-foreground">Bank</div>
			<div>{data.userDetail.bankName}</div>
			<div class="text-muted-foreground">Account Number</div>
			<div>{data.userDetail.bankAccountNumber}</div>
			<div class="text-muted-foreground">Branch Code</div>
			<div>{data.userDetail.bankBranchCode}</div>
			<div class="text-muted-foreground">Name</div>
			<div>{data.userDetail.bankHolderName}</div>
		</div>
		<div style={textStyle}>
			<div class="flex items-center justify-between gap-12">
				<div>TOTAL HOURS</div>
				<div>{totalHours}</div>
			</div>
			<div class="flex items-center justify-between gap-12">
				<div>RATE</div>
				<div>R{data.project.rate}</div>
			</div>
			<div class="mt-3 flex flex-col gap-1">
				<Separator class="h-1" style={backgroundStyle} />
				<div class="flex items-center justify-between text-2xl">
					<div>TOTAL</div>
					<div class="font-bold">R{total}</div>
				</div>
				<Separator class="h-1" style={backgroundStyle} />
			</div>
		</div>
	</div>

	<div class="h-1" style={backgroundStyle}></div>
</div>
