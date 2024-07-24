import { db } from "$lib/server";
import { eq } from "drizzle-orm";
import type { PageServerLoad } from "./$types";
import { timeTable } from "$lib/server/schema";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { createTimeSchema } from "./schema";

export const load = (async ({ locals }) => {
	const data = await db.query.timeTable.findMany({
		where: eq(timeTable.userId, locals.user?.id ?? ""),
	});
	const form = await superValidate(zod(createTimeSchema));
	return { form, data };
}) satisfies PageServerLoad;

export const actions = {
	create: async ({ locals }) => {
		try {
			if (locals.user?.id == null) throw new Error("User not logged id");

			// const selectedDate = Math.floor(Date.now() / 1000);
			await db.insert(timeTable).values({
				userId: locals.user?.id,
				date: new Date(),
				description: "Test",
				hours: 1,
			});
		} catch (err) {
			console.error(err);
		}
	},
	delete: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get("id")?.toString() ?? "0");
		await db.delete(timeTable).where(eq(timeTable.id, id));
	},
};
