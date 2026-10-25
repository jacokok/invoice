import { error } from "@sveltejs/kit";
import { form, getRequestEvent, query } from "$app/server";
import { and, eq } from "drizzle-orm";
import { db } from "#lib/server/db/index.ts";
import { project, userDetail } from "#lib/server/db/schema.ts";
import { getInvoiceData } from "#lib/server/invoice.ts";
import { renderInvoicePdf } from "#lib/server/pdf.ts";
import { schema } from "./schema";

export const getProjects = query(async () => {
	const { locals } = getRequestEvent();
	const userId = locals.user?.id;

	if (userId == null) {
		error(401, "Unauthorized");
	}

	const projects = await db.query.project.findMany({
		where: eq(project.userId, userId),
	});

	return { projects, userId };
});

export const submitPdfOptions = form(schema, async (params) => {
	const { locals } = getRequestEvent();
	const userId = locals.user?.id;

	if (userId == null) {
		error(401, "Unauthorized");
	}

	if (params.userId !== userId) {
		return { success: false, message: "Invalid user" };
	}

	const ownedProject = await db.query.project.findFirst({
		where: and(eq(project.id, params.projectId), eq(project.userId, userId)),
	});

	if (ownedProject == null) {
		return { success: false, message: "Invalid project" };
	}

	if (params.isPreview === "true") {
		return { success: true, message: "Opening preview" };
	}

	const detail = await db.query.userDetail.findFirst({
		where: eq(userDetail.userId, userId),
	});

	if (detail == null) {
		return { success: false, message: "Update your user details before downloading" };
	}

	try {
		const data = await getInvoiceData(userId, params.projectId, params.date);
		const invoiceNumber = detail.invoiceNumber + 1;
		data.userDetail.invoiceNumber = invoiceNumber;
		const pdf = await renderInvoicePdf(data, params.colorScheme);

		// Only consume the number after rendering, and reject concurrent downloads
		// that would otherwise issue the same invoice number.
		const updated = await db
			.update(userDetail)
			.set({ invoiceNumber })
			.where(and(eq(userDetail.userId, userId), eq(userDetail.invoiceNumber, detail.invoiceNumber)))
			.returning({ invoiceNumber: userDetail.invoiceNumber });

		if (updated.length === 0) {
			return { success: false, message: "Another invoice was generated. Please try again." };
		}

		return {
			success: true,
			message: "Invoice ready",
			pdf,
			filename: `invoice-${invoiceNumber}-${params.date}.pdf`,
		};
	} catch (err) {
		console.error("Invoice PDF generation failed:", err);
		return { success: false, message: "Could not generate the invoice PDF. Please try again." };
	}
});
