import { form, getRequestEvent, query } from "$app/server";
import { and, eq } from "drizzle-orm";
import { db } from "$lib/server/db";
import { project } from "$lib/server/db/schema";
import { z } from "zod";
import { error, redirect, isRedirect, isHttpError } from "@sveltejs/kit";
import { insertProjectSchema } from "$lib/insertSchema";

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

export const getProject = query(z.number().optional(), async (id) => {
	const { locals } = getRequestEvent();
	const item = await db.query.project.findFirst({
		where: and(eq(project.id, Number(id ?? 0)), eq(project.userId, locals.user?.id ?? "")),
	});
	return { item };
});

export const upsertProject = form(insertProjectSchema, async (data) => {
	const { locals } = getRequestEvent();

	if (locals.user?.id == null) {
		error(401, "User not found");
	}

	const values = {
		...data,
		userId: locals.user?.id,
	};

	try {
		if (!data.id) {
			// Create
			await db.insert(project).values(values);
		} else {
			// Update
			await db
				.update(project)
				.set(values)
				.where(and(eq(project.id, data.id), eq(project.userId, locals.user?.id ?? "")));
		}
	} catch (err: unknown) {
		if (isRedirect(err) || isHttpError(err)) throw err;
		error(500, (err as Error).message);
	}

	redirect(303, "/profile/project");
});
