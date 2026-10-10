import { form, getRequestEvent, query } from "$app/server";
import { and, eq } from "drizzle-orm";
import { db } from "#lib/server/db/index.ts";
import { project, time } from "#lib/server/db/schema.ts";
import { z } from "zod";
import { insertTimeSchema } from "#lib/insertSchema.ts";
import { error } from "@sveltejs/kit";

const updateSchema = z.number().optional();
type UpdateTimeResult = { success: boolean; message: string };

export const getUpdate = query(updateSchema, async (id) => {
	const { locals } = getRequestEvent();
	const projects = await db.query.project.findMany({
		where: eq(project.userId, locals.user?.id ?? ""),
	});

	const newItem = {
		date: new Date(),
		id: 0,
		userId: locals.user?.id ?? "",
		description: "",
		hours: 1,
		projectId: projects[0]?.id ?? 0,
	};

	// Creating an entry doesn't need a time-entry lookup.
	if (id === 0 || id === undefined) {
		return { item: newItem, projects };
	}

	const item = await db.query.time.findFirst({
		where: and(eq(time.id, id), eq(time.userId, locals.user?.id ?? "")),
	});

	return { item: item ?? newItem, projects };
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
