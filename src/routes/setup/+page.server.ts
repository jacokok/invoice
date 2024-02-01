import { detailSchema } from "$lib/db/schema";
import { fail, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { superValidate } from "sveltekit-superforms/server";

export const load = (async () => {
	return {
		form: await superValidate(detailSchema),
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, detailSchema);
		console.log("check", form);
		if (!form.valid) {
			return fail(400, {
				form,
			});
		}

		return {
			form,
		};
	},
};
