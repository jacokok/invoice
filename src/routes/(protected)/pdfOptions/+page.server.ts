import { db } from "$lib/server";
import { eq } from "drizzle-orm";
import type { PageServerLoad } from "./$types";
import { projectTable, userDetailTable } from "$lib/schema";
import { message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { dateToYM, schema, type FormSchema } from "./schema";

export const load = (async ({ locals }) => {
	const projects = await db.query.projectTable.findMany({
		where: eq(projectTable.userId, locals.user?.id ?? ""),
	});

	const getDefaultMonth = () => {
		const date = new Date();
		date.setMonth(date.getMonth() - 1);
		return dateToYM(date, true);
	};

	const defaultValues: FormSchema = {
		colorScheme: "dark",
		date: getDefaultMonth(),
		projectId: projects.length > 0 ? projects[0].id : 0,
		userId: locals.user?.id ?? "",
		isPreview: false,
	};

	const form = await superValidate(defaultValues, zod(schema));
	return { projects, form };
}) satisfies PageServerLoad;

export const actions = {
	download: async ({ request }) => {
		const form = await superValidate(request, zod(schema));

		if (!form.data.isPreview) {
			// Increment download count
			const detail = await db.query.userDetailTable.findFirst({
				where: eq(userDetailTable.userId, form.data.userId),
			});
			if (detail?.invoiceNumber) {
				await db
					.update(userDetailTable)
					.set({
						invoiceNumber: detail.invoiceNumber + 1,
					})
					.where(eq(userDetailTable.userId, form.data.userId));
			}
		}
		return message(form, "Download");
	},
};
