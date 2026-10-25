import { renderHtml } from "@formepdf/html";
import { render } from "svelte/server";
import Invoice from "#lib/components/Invoice.svelte";
import invoiceCss from "#lib/components/invoice.css?raw";
import type { InvoiceData } from "./invoice.ts";

export async function renderInvoiceHtml(data: InvoiceData, theme: string) {
	const { body } = await render(Invoice, { props: { data, theme } });
	return `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>
		body { margin: 0; }
		${invoiceCss}
	</style></head><body>${body}</body></html>`;
}

export async function renderInvoicePdf(data: InvoiceData, theme: string) {
	const html = await renderInvoiceHtml(data, theme);
	const { pdf, warnings } = renderHtml(html);

	if (warnings.length > 0) {
		console.warn("Invoice PDF rendering warnings:", warnings);
	}

	return pdf;
}
