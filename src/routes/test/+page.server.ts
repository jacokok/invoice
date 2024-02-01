import { db, kv } from "$lib";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
	const result = await db.select().from(kv);
	return { result };
}) satisfies PageServerLoad;
