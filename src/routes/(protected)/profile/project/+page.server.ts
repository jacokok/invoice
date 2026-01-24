import { db } from "$lib/server";
import { eq } from "drizzle-orm";
import type { PageServerLoad } from "./$types";
import { projectTable } from "$lib/schema";

export const load = (async ({ locals }) => {
	const projects = await db.query.projectTable.findMany({
		where: eq(projectTable.userId, locals.user?.id ?? ""),
	});

	return { projects };
}) satisfies PageServerLoad;

export const actions = {
	delete: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get("id")?.toString() ?? "0");
		await db.delete(projectTable).where(eq(projectTable.id, id));
	},
};
