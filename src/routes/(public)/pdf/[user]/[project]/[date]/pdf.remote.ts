import { query } from "$app/server";
import { z } from "zod";
import { eq, and, lte, gte, asc } from "drizzle-orm";
import { db } from "#lib/server/db/index.ts";
import {
	project as projectTable,
	userDetail as userDetailTable,
	time as timeTable,
} from "#lib/server/db/schema.ts";
import { firstAndLastDay } from "#lib/util.ts";

const schema = z.object({
	user: z.string().min(1),
	project: z.coerce.number().int().positive(),
	date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const getPdf = query(schema, async (params) => {
	const project = await db.query.project.findFirst({
		where: eq(projectTable.id, Number(params.project)),
	});
	if (project == null) throw new Error("Project not found");

	const userDetail = await db.query.userDetail.findFirst({
		where: eq(userDetailTable.userId, params.user ?? ""),
	});
	if (userDetail == null) throw new Error("User Detail not found");

	const dates = firstAndLastDay(params.date);

	const time = await db.query.time.findMany({
		where: and(
			eq(timeTable.userId, params.user ?? ""),
			eq(timeTable.projectId, Number(params.project)),
			lte(timeTable.date, dates.lastDay),
			gte(timeTable.date, dates.firstDay)
		),
		orderBy: [asc(timeTable.date)],
	});

	return { project, userDetail, time };
});
