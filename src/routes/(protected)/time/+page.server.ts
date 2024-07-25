import { db } from "$lib/server";
import { count, desc, eq } from "drizzle-orm";
import type { PageServerLoad } from "./$types";
import { timeTable } from "$lib/server/schema";
import { fail, message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { createTimeSchema } from "./schema";

export const load = (async ({ url, locals }) => {
	const limit = 10;
	const page = Number(url.searchParams.get("page") ?? "1") - 1;
	const totalQuery = await db.select({ value: count() }).from(timeTable);
	const total = totalQuery[0].value;

	const skip = page * limit;
	// const skip = Number(url.searchParams.get("skip") ?? "0");

	const data = await db.query.timeTable.findMany({
		orderBy: [desc(timeTable.date)],
		limit: limit,
		offset: skip,
		where: eq(timeTable.userId, locals.user?.id ?? ""),
	});

	const form = await superValidate(zod(createTimeSchema));
	return { form, data, total, limit: limit, skip };
}) satisfies PageServerLoad;

export const actions = {
	create: async ({ locals, request }) => {
		const form = await superValidate(request, zod(createTimeSchema));

		if (locals.user?.id == null) {
			return fail(500, { message: "User not found" });
		}

		if (!form.valid) return fail(400, { form });

		await db.insert(timeTable).values({
			userId: locals.user?.id,
			date: form.data.date,
			description: form.data.description,
			hours: form.data.hours,
		});
		return message(form, "Time logged!");
	},
	delete: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get("id")?.toString() ?? "0");
		await db.delete(timeTable).where(eq(timeTable.id, id));
	},
};
