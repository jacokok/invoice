import type { RequestHandler } from "./$types";
import { db } from "$lib/server";
import { projectTable } from "$lib/schema";
import { count } from "drizzle-orm";
import { json } from "@sveltejs/kit";

export const GET: RequestHandler = async () => {
	const projectCount = await db.select({ count: count() }).from(projectTable);
	return json({ projectCount });
};
