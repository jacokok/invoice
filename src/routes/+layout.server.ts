import { db } from "$lib/db/db.server";
import { detail } from "$lib/db/schema";
import type { LayoutServerLoad } from "./$types";

export const load = (async () => {
	const detailResults = await db.select().from(detail);
	return { detail: detailResults };
}) satisfies LayoutServerLoad;
