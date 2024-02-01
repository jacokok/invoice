import { detail, detailSchema } from "$lib/db/schema";
import { fail, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { superValidate } from "sveltekit-superforms/server";
import { db } from "$lib/db/db.server";
import { eq } from "drizzle-orm";

export const load = (async ({ params }) => {
	const detailResults = await db.query.detail.findFirst({
		where: eq(detail.id, Number(params.Id)),
	});
	return {
		form: await superValidate(detailResults, detailSchema),
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, detailSchema);
		if (!form.valid) {
			return fail(400, {
				form,
			});
		}
		console.log("lets go");

		if (!form.data.id || form.data.id == 0) {
			if (form.data.id == 0) form.data.id = undefined;
			// CREATE user
			console.log("crearing");
			await db.insert(detail).values(form.data);
		} else {
			// UPDATE user
			console.log("udpating");
			await db.update(detail).set(form.data);
		}

		return {
			form,
		};
	},
};
