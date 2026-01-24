import { projectTable, timeTable, userDetailTable } from "$lib/schema";
import { db } from "$lib/server";
import { and, eq, lte, gte, asc } from "drizzle-orm";
import type { PageServerLoad } from "./$types";
import { firstAndLastDay } from "$lib/util";

export const load = (async ({ params }) => {
	const project = await db.query.projectTable.findFirst({
		where: eq(projectTable.id, Number(params.project)),
	});
	if (project == null) throw new Error("Project not found");

	const userDetail = await db.query.userDetailTable.findFirst({
		where: eq(userDetailTable.userId, params.user),
	});
	if (userDetail == null) throw new Error("User Detail not found");

	const dates = firstAndLastDay(params.date);
	const time = await db.query.timeTable.findMany({
		where: and(
			eq(timeTable.userId, params.user),
			eq(timeTable.projectId, Number(params.project)),
			lte(timeTable.date, dates.lastDay),
			gte(timeTable.date, dates.firstDay)
		),
		orderBy: [asc(timeTable.date)],
	});

	return { project, userDetail, time };
}) satisfies PageServerLoad;
