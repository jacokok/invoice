import { db } from "$lib/server";
import { count, desc, eq } from "drizzle-orm";
import type { PageServerLoad } from "./$types";
import { timeTable } from "$lib/schema";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { insertTimeSchema } from "$lib/dbSchemas";

export const load = (async ({ url, locals }) => {
	const limit = 10;
	const page = Number(url.searchParams.get("page") ?? "1") - 1;
	const totalQuery = await db.select({ value: count() }).from(timeTable);
	const total = totalQuery[0].value;

	const skip = page * limit;

	const data = await db.query.timeTable.findMany({
		orderBy: [desc(timeTable.date)],
		limit: limit,
		offset: skip,
		where: eq(timeTable.userId, locals.user?.id ?? ""),
		with: {
			project: true,
		},
	});

	const form = await superValidate(zod(insertTimeSchema));
	return { form, data, total, limit: limit, skip };
}) satisfies PageServerLoad;

export const actions = {
	delete: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get("id")?.toString() ?? "0");
		await db.delete(timeTable).where(eq(timeTable.id, id));
	},
};
