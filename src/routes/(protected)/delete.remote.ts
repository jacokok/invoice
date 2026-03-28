import { getRequestEvent, query } from "$app/server";
import { and, eq } from "drizzle-orm";
import { db } from "$lib/server/db";
import { time } from "$lib/server/db/schema";
import { error } from "@sveltejs/kit";
import { z } from "zod";

const schema = z.number().int().positive();

export const deleteTime = query(schema, async (id) => {
	const { locals } = getRequestEvent();
	const userId = locals.user?.id;

	if (userId == null) {
		error(401, "Unauthorized");
	}

	await db.delete(time).where(and(eq(time.id, id), eq(time.userId, userId)));

	return { success: true, message: "Time entry deleted" };
});
