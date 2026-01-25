import { redirect } from "@sveltejs/kit";

export async function load({ locals }) {
	if (!locals.session) {
		redirect(303, "/sign-in");
	}
}
