import { eq, and, lte, gte, asc } from "drizzle-orm";
import { db } from "#lib/server/db/index.ts";
import {
	project as projectTable,
	userDetail as userDetailTable,
	time as timeTable,
} from "#lib/server/db/schema.ts";
import { firstAndLastDay } from "#lib/util.ts";

export async function getInvoiceData(userId: string, projectId: number, date: string) {
	const project = await db.query.project.findFirst({
		where: and(eq(projectTable.id, projectId), eq(projectTable.userId, userId)),
	});
	if (project == null) throw new Error("Project not found");

	const userDetail = await db.query.userDetail.findFirst({
		where: eq(userDetailTable.userId, userId),
	});
	if (userDetail == null) throw new Error("User Detail not found");

	const dates = firstAndLastDay(date);
	const time = await db.query.time.findMany({
		where: and(
			eq(timeTable.userId, userId),
			eq(timeTable.projectId, projectId),
			lte(timeTable.date, dates.lastDay),
			gte(timeTable.date, dates.firstDay)
		),
		orderBy: [asc(timeTable.date)],
	});

	return { project, userDetail, time };
}

export type InvoiceData = Awaited<ReturnType<typeof getInvoiceData>>;
