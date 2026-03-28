import { error } from "@sveltejs/kit";
import { form, getRequestEvent, query } from "$app/server";
import { and, eq } from "drizzle-orm";
import { db } from "$lib/server/db";
import { project, userDetail } from "$lib/server/db/schema";
import { schema, type FormSchema } from "./schema";
import { redirect } from "@sveltejs/kit";

export const getProjects = query(async () => {
	const { locals } = getRequestEvent();
	const userId = locals.user?.id;

	if (userId == null) {
		error(401, "Unauthorized");
	}

	const projects = await db.query.project.findMany({
		where: eq(project.userId, userId),
	});

	return { projects, userId };
});

export const submitPdfOptions = form(schema, async (params) => {
	const { locals } = getRequestEvent();
	const userId = locals.user?.id;

	if (userId == null) {
		error(401, "Unauthorized");
	}

	if (params.userId !== userId) {
		return { success: false, message: "Invalid user" };
	}

	const ownedProject = await db.query.project.findFirst({
		where: and(eq(project.id, params.projectId as number), eq(project.userId, userId)),
	});

	if (ownedProject == null) {
		return { success: false, message: "Invalid project" };
	}

	const isPreview = params.isPreview === "true";

	if (!isPreview) {
		const detail = await db.query.userDetail.findFirst({
			where: eq(userDetail.userId, userId),
		});

		if (detail == null) {
			return { success: false, message: "Update your user details before downloading" };
		}

		await db
			.update(userDetail)
			.set({ invoiceNumber: detail.invoiceNumber + 1 })
			.where(eq(userDetail.userId, userId));
	}

	return {
		success: true,
		message: isPreview ? "Opening preview" : "Preparing download",
	};
});
