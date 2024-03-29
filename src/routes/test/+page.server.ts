import { db } from "$lib/db/db.server";
import { kv } from "$lib/db/schema";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
	const result = await db.select().from(kv);
	return { result };
}) satisfies PageServerLoad;
