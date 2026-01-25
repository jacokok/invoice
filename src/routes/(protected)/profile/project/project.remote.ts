import { getRequestEvent, query } from "$app/server";
import { eq } from "drizzle-orm";
import { db } from "$lib/server/db";
import { project } from "$lib/server/db/schema";
import { z } from "zod";

export const getProjects = query(async () => {
	const { locals } = getRequestEvent();
	const projects = await db.query.project.findMany({
		where: eq(project.userId, locals.user?.id ?? ""),
	});
	return { projects };
});

export const deleteProject = query(z.number(), async (id) => {
	await db.delete(project).where(eq(project.id, id));
});
