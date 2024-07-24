import { lucia } from "$lib/server/auth";
import { error, redirect } from "@sveltejs/kit";

export const POST = async (event) => {
	if (!event.locals.session) {
		error(401, {
			message: "No session",
		});
	}
	await lucia.invalidateSession(event.locals.session.id);
	const sessionCookie = lucia.createBlankSessionCookie();
	event.cookies.set(sessionCookie.name, sessionCookie.value, {
		path: ".",
		...sessionCookie.attributes,
	});
	redirect(302, "/login");
};
