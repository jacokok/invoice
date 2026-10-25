import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { renderHtmlWithLayout } from "@formepdf/html";
import { createServer, type ViteDevServer } from "vite";
import type { InvoiceData } from "../src/lib/server/invoice.ts";

let server: ViteDevServer;
let renderer: typeof import("../src/lib/server/pdf.ts");

before(async () => {
	server = await createServer({ server: { middlewareMode: true }, appType: "custom" });
	renderer = (await server.ssrLoadModule("/src/lib/server/pdf.ts")) as typeof renderer;
});

after(async () => {
	await server?.close();
});

function invoice(itemCount = 1): InvoiceData {
	return {
		project: {
			id: 1,
			userId: "test",
			name: "Project",
			billName: "Client & Co",
			billAddress: "Client address\nSecond line",
			rate: 100,
			primaryColorLight: "#123456",
			primaryColorDark: "#abcdef",
		},
		userDetail: {
			userId: "test",
			invoiceNumber: 42,
			name: "Test User",
			email: "test@example.com",
			contactNumber: "123",
			address: "Address\nSecond line",
			bankName: "Bank",
			bankAccountNumber: "123456",
			bankBranchCode: "0001",
			bankHolderName: "Test User",
		},
		time: Array.from({ length: itemCount }, (_, i) => ({
			id: i + 1,
			userId: "test",
			projectId: 1,
			date: new Date(2026, 0, 1),
			description: "Work done\nSecond line <script>alert(1)</script>",
			hours: 8,
		})),
	};
}

for (const theme of ["light", "dark"]) {
	test(`${theme} invoice renders HTML and a PDF without unsupported styles`, async () => {
		const html = await renderer.renderInvoiceHtml(invoice(), theme);
		assert.match(html, /Client &amp; Co/);
		assert.match(html, /&lt;script(?:&gt;|>)/);
		assert.doesNotMatch(html, /<script>/);
		assert.match(html, /<br\s*\/?\s*>/);
		assert.match(html, /R800/);
		assert.match(html, /#42/);
		assert.ok(html.includes(theme === "light" ? "#123456" : "#abcdef"));

		const result = renderHtmlWithLayout(html, { auditContent: true });
		assert.deepEqual(result.warnings, []);
		assert.equal(result.layout.pages.length, 1);

		const pdf = await renderer.renderInvoicePdf(invoice(), theme);
		assert.equal(new TextDecoder().decode(pdf.slice(0, 5)), "%PDF-");
		assert.ok(pdf.byteLength > 1000);
	});
}

test("empty invoices still render the banking details and zero total", async () => {
	const html = await renderer.renderInvoiceHtml(invoice(0), "light");
	assert.match(html, /Banking Details/);
	assert.match(html, /R0/);
	const result = renderHtmlWithLayout(html, { auditContent: true });
	assert.deepEqual(result.warnings, []);
	assert.equal(result.layout.pages.length, 1);
});

test("long invoices paginate without dropping content", async () => {
	const html = await renderer.renderInvoiceHtml(invoice(60), "light");
	assert.match(html, /R48000/);
	const result = renderHtmlWithLayout(html, { auditContent: true });
	assert.deepEqual(result.warnings, []);
	assert.ok(result.layout.pages.length > 1);
});
