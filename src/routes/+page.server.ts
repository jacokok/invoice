import { db, schema } from "$lib/server";
import { eq } from "drizzle-orm";
import type { PageServerLoad } from "./$types";
import { v7 as uuid } from "uuid";
const { kv } = schema;

export const load = (async () => {
	const data = await db.select().from(kv).execute();
	return { data };
}) satisfies PageServerLoad;

export const actions = {
	create: async () => {
		await db.insert(kv).values({ id: uuid(), name: uuid() }).returning();
	},
	delete: async ({ request }) => {
		const data = await request.formData();
		const id = data.get("id")?.toString() ?? "";
		await db.delete(kv).where(eq(kv.id, id));
	},
};
