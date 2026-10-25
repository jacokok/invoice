<script lang="ts">
	import type { InvoiceData } from "#lib/server/invoice.ts";
	import { dateToString, getInitials } from "#lib/util.ts";
	import "./invoice.css";

	let { data, theme = "light" }: { data: InvoiceData; theme?: string } = $props();

	const totalHours = $derived(data.time.reduce((total, time) => total + time.hours, 0));
	const total = $derived(totalHours * data.project.rate);
	const isDark = $derived(theme === "dark");
	const primaryColor = $derived(
		isDark ? data.project.primaryColorDark : data.project.primaryColorLight
	);
	const backgroundStyle = $derived(`background-color: ${primaryColor};`);
	const textStyle = $derived(`color: ${primaryColor};`);
	const mutedStyle = $derived(`color: ${isDark ? "#a1a1aa" : "#71717a"};`);
	const panelStyle = $derived(`background-color: ${isDark ? "#27272a" : "#f4f4f5"};`);
</script>

{#snippet multiline(text: string)}
	{#each text.split(/\r?\n/) as line, i (i)}
		{#if i > 0}<br />{/if}{line}
	{/each}
{/snippet}

<div
	class="invoice"
	style={`background-color: ${isDark ? "#09090b" : "#ffffff"}; color: ${isDark ? "#fafafa" : "#09090b"};`}
>
	<div style={panelStyle}>
		<div class="invoice-rule" style={backgroundStyle}></div>
		<div class="invoice-row invoice-header">
			<div class="invoice-identity">
				<div
					class="invoice-avatar"
					style={`${backgroundStyle} color: ${isDark ? "#18181b" : "#fafafa"};`}
				>
					{getInitials(data.userDetail.name)}
				</div>
				<div>
					<h2 style={textStyle}>{data.userDetail.name}</h2>
					<div class="invoice-small">{data.userDetail.email}</div>
					<div class="invoice-small">{data.userDetail.contactNumber}</div>
				</div>
			</div>
			<div class="invoice-right invoice-small">{@render multiline(data.userDetail.address)}</div>
		</div>
	</div>

	<div class="invoice-row invoice-block">
		<div class="invoice-stack">
			<div style={mutedStyle}>Billed to</div>
			<div>
				<div class="invoice-bold">{data.project.billName}</div>
				<div>{@render multiline(data.project.billAddress)}</div>
			</div>
		</div>
		<div class="invoice-stack invoice-right">
			<div>
				<div style={mutedStyle}>Invoice Number</div>
				<div>#{data.userDetail.invoiceNumber}</div>
			</div>
			<div>
				<div style={mutedStyle}>Invoice Date</div>
				<div>{dateToString(new Date())}</div>
			</div>
		</div>
	</div>

	<div class="invoice-row invoice-section" style={`${panelStyle} ${textStyle}`}>
		<div>Item Details</div>
		<div>Hours</div>
	</div>
	{#each data.time as time (time.id)}
		<div class="invoice-item" style={`border-color: ${isDark ? "#27272a" : "#e4e4e7"};`}>
			<div class="invoice-row invoice-item-content">
				<div>
					<div>{dateToString(time.date)}</div>
					<div style={mutedStyle}>{@render multiline(time.description)}</div>
				</div>
				<div>{time.hours}</div>
			</div>
		</div>
	{/each}

	<div class="invoice-summary">
		<div class="invoice-row invoice-section" style={`${panelStyle} ${textStyle}`}>
			<div>Banking Details</div>
			<div>Summary</div>
		</div>
		<div class="invoice-rule" style={backgroundStyle}></div>
		<div class="invoice-row invoice-block">
			<div class="invoice-banking">
				<div style={mutedStyle}>Bank</div>
				<div>{data.userDetail.bankName}</div>
				<div style={mutedStyle}>Account Number</div>
				<div>{data.userDetail.bankAccountNumber}</div>
				<div style={mutedStyle}>Branch Code</div>
				<div>{data.userDetail.bankBranchCode}</div>
				<div style={mutedStyle}>Name</div>
				<div>{data.userDetail.bankHolderName}</div>
			</div>
			<div style={textStyle}>
				<div class="invoice-row invoice-totals-row">
					<div>TOTAL HOURS</div>
					<div>{totalHours}</div>
				</div>
				<div class="invoice-row invoice-totals-row">
					<div>RATE</div>
					<div>R{data.project.rate}</div>
				</div>
				<div class="invoice-total">
					<div class="invoice-rule" style={backgroundStyle}></div>
					<div class="invoice-row invoice-total-value">
						<div>TOTAL</div>
						<div class="invoice-bold">R{total}</div>
					</div>
					<div class="invoice-rule" style={backgroundStyle}></div>
				</div>
			</div>
		</div>
		<div class="invoice-rule" style={backgroundStyle}></div>
	</div>
</div>
