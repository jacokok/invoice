import { invalidateSession, deleteSessionTokenCookie } from "$lib/server/session.js";
import { error, redirect } from "@sveltejs/kit";

export const POST = async (event) => {
	if (!event.locals.session) {
		error(401, {
			message: "No session",
		});
	}
	await invalidateSession(event.locals.session.id);
	await deleteSessionTokenCookie(event);
	redirect(302, "/login");
};
