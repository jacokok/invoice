import { form, getRequestEvent, query } from "$app/server";
import { and, eq } from "drizzle-orm";
import { db } from "$lib/server/db";
import { project, time } from "$lib/server/db/schema";
import { z } from "zod";
import { insertTimeSchema } from "$lib/insertSchema";
import { error } from "@sveltejs/kit";

const updateSchema = z.number().optional();
type UpdateTimeResult = { success: boolean; message: string };

export const getUpdate = query(updateSchema, async (id) => {
	const { locals } = getRequestEvent();
	let item = await db.query.time.findFirst({
		where: and(eq(time.id, Number(id ?? 0)), eq(time.userId, locals.user?.id ?? "")),
	});

	const projects = await db.query.project.findMany({
		where: eq(project.userId, locals.user?.id ?? ""),
	});

	// Default Values
	if (item == null) {
		item = {
			date: new Date(),
			id: 0,
			userId: locals.user?.id ?? "",
			description: "",
			hours: 1,
			projectId: projects.length > 0 ? projects[0].id : 0,
		};
	}

	return { item, projects };
});

export const updateTime = form(insertTimeSchema, async (params): Promise<UpdateTimeResult> => {
	const { locals } = getRequestEvent();
	try {
		if (locals.user?.id == null) {
			error(401, "Unauthorized");
		}
		const values = {
			...params,
			userId: locals.user?.id,
			date: new Date(params.date),
		};

		if (values.id === 0) {
			values.id = undefined;
		}

		if (params.id == null || params.id === 0) {
			// Create
			await db.insert(time).values(values);
			return { success: true, message: "Time logged!" };
		} else {
			// Update
			await db
				.update(time)
				.set(values)
				.where(and(eq(time.id, params.id), eq(time.userId, locals.user?.id ?? "")));
			return { success: true, message: "Time updated!" };
		}
	} catch {
		return { success: false, message: "Could not set time log" };
	}
});
