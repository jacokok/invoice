import { db } from "$lib/server";
import { eq, and } from "drizzle-orm";
import type { PageServerLoad } from "./$types";
import { timeTable, projectTable } from "$lib/schema";
import { fail, message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { insertTimeSchema } from "$lib/dbSchemas";

export const load = (async ({ params, locals }) => {
	const item = await db.query.timeTable.findFirst({
		where: and(
			eq(timeTable.id, Number(params.id ?? 0)),
			eq(timeTable.userId, locals.user?.id ?? "")
		),
	});

	const projects = await db.query.projectTable.findMany({
		where: eq(projectTable.userId, locals.user?.id ?? ""),
	});

	const form = await superValidate(item, zod(insertTimeSchema));
	return { form, item, projects };
}) satisfies PageServerLoad;

export const actions = {
	upsert: async ({ locals, request }) => {
		const form = await superValidate(request, zod(insertTimeSchema));
		try {
			if (locals.user?.id == null) {
				return fail(500, { message: "User not found" });
			}
			if (!form.valid) return fail(400, { form });

			const values = {
				...form.data,
				userId: locals.user?.id,
			};

			if (!form.data.id) {
				// Create
				await db.insert(timeTable).values(values);
				return message(form, "Time logged!");
			} else {
				// Update
				await db
					.update(timeTable)
					.set(values)
					.where(and(eq(timeTable.id, form.data.id), eq(timeTable.userId, locals.user?.id ?? "")));
				return message(form, "Time updated!");
			}
		} catch (err: unknown) {
			return message(form, (err as Error).message);
		}
	},
};
