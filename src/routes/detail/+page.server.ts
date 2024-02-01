import { db } from "$lib/db/db.server";
import { detail } from "$lib/db/schema";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
	const results = await db.select().from(detail);
	return { detail: results };
}) satisfies PageServerLoad;
