import { db } from "$lib/server";
import { eq } from "drizzle-orm";
import type { PageServerLoad } from "./$types";
import { timeTable, userDetailTable } from "$lib/schema";
import { fail, message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { insertUserDetailSchema } from "$lib/dbSchemas";

export const load = (async ({ locals }) => {
	const item = await db.query.userDetailTable.findFirst({
		where: eq(timeTable.userId, locals.user?.id ?? ""),
	});

	const form = await superValidate(item, zod(insertUserDetailSchema));
	return { form, item };
}) satisfies PageServerLoad;

export const actions = {
	update: async ({ locals, request }) => {
		const form = await superValidate(request, zod(insertUserDetailSchema));
		try {
			if (locals.user?.id == null) {
				return fail(500, { message: "User not found" });
			}
			if (!form.valid) return fail(400, { form });

			const values = {
				...form.data,
				userId: locals.user?.id,
			};

			await db.insert(userDetailTable).values(values).onConflictDoUpdate({
				target: userDetailTable.userId,
				set: values,
			});
			return message(form, "Updated user details");
		} catch (err: unknown) {
			return message(form, (err as Error).message);
		}
	},
};
