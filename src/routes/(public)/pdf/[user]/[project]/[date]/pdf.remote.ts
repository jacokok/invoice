import { query } from "$app/server";
import { z } from "zod";
import { getInvoiceData } from "#lib/server/invoice.ts";

const schema = z.object({
	user: z.string().min(1),
	project: z.coerce.number().int().positive(),
	date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const getPdf = query(schema, (params) =>
	getInvoiceData(params.user, params.project, params.date)
);
