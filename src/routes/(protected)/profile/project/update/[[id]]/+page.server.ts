import { db } from "$lib/server";
import { eq, and } from "drizzle-orm";
import type { PageServerLoad } from "./$types";
import { projectTable } from "$lib/schema";
import { fail, message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { insertProjectSchema } from "$lib/dbSchemas";

export const load = (async ({ params, locals }) => {
	const item = await db.query.projectTable.findFirst({
		where: and(
			eq(projectTable.id, Number(params.id ?? 0)),
			eq(projectTable.userId, locals.user?.id ?? "")
		),
	});

	const form = await superValidate(item, zod(insertProjectSchema));
	return { form, item };
}) satisfies PageServerLoad;

export const actions = {
	upsert: async ({ locals, request }) => {
		console.log("reached this");
		const form = await superValidate(request, zod(insertProjectSchema));
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
				await db.insert(projectTable).values(values);
				return message(form, "Created project details");
			} else {
				// Update
				await db
					.update(projectTable)
					.set(values)
					.where(
						and(eq(projectTable.id, form.data.id), eq(projectTable.userId, locals.user?.id ?? ""))
					);
				return message(form, "Updated project details");
			}
		} catch (err: unknown) {
			return message(form, (err as Error).message);
		}
	},
};
