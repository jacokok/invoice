import { getRequestEvent, query } from "$app/server";
import { count, desc, eq } from "drizzle-orm";
import { db } from "$lib/server/db";
import { time } from "$lib/server/db/schema";
import { z } from "zod";

const pageSchema = z.number().min(1).optional();

export const getTime = query(pageSchema, async (pageInput) => {
	const { locals } = getRequestEvent();
	const limit = 10;
	const page = (pageInput ?? 1) - 1;
	const totalQuery = await db.select({ value: count() }).from(time);
	const total = totalQuery[0].value;

	const skip = page * limit;

	console.log("page", page);
	const data = await db.query.time.findMany({
		orderBy: [desc(time.date)],
		limit: limit,
		offset: skip,
		where: eq(time.userId, locals.user?.id ?? ""),
		with: {
			project: true,
		},
	});

	return { data, total, limit: limit, skip };
});
