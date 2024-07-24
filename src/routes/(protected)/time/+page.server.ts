import { db } from "$lib/server";
import { eq } from "drizzle-orm";
import type { PageServerLoad } from "./$types";
import { timeTable } from "$lib/server/schema";

export const load = (async () => {
	const data = await db.query.timeTable.findMany();
	return { data };
}) satisfies PageServerLoad;

export const actions = {
	create: async () => {
		try {
			// const selectedDate = Math.floor(Date.now() / 1000);
			await db.insert(timeTable).values({
				userId: "icmyvdsyacgb6fij",
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
