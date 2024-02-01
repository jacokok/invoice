import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ parent }) => {
	const data = await parent();
	if (data.detail.length <= 0) {
		redirect(303, "/setup");
	}
	return { ...data };
}) satisfies PageServerLoad;
