import { OAuth2RequestError } from "arctic";
import { generateIdFromEntropySize } from "lucia";
import { github, lucia } from "$lib/server/auth";
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from "$env/static/private";

import { json, type RequestEvent } from "@sveltejs/kit";
import { db } from "$lib/server";
import { userTable } from "$lib/schema";
import { eq } from "drizzle-orm";

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get("code");
	const state = event.url.searchParams.get("state");
	const storedState = event.cookies.get("github_oauth_state") ?? null;

	if (!code || !state || !storedState || state !== storedState) {
		return new Response(null, {
			status: 400,
		});
	}

	try {
		return json({ code: code, state, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET });
		// const tokens = await github.validateAuthorizationCode(code);
		// const githubUserResponse = await fetch("https://api.github.com/user", {
		// 	headers: {
		// 		Authorization: `Bearer ${tokens.accessToken}`,
		// 	},
		// });
		// const githubUser: GitHubUser = await githubUserResponse.json();

		// const existingUser = await db.query.userTable.findFirst({
		// 	where: eq(userTable.githubId, githubUser.id.toString()),
		// });

		// if (existingUser) {
		// 	const session = await lucia.createSession(existingUser.id, {});
		// 	const sessionCookie = lucia.createSessionCookie(session.id);
		// 	event.cookies.set(sessionCookie.name, sessionCookie.value, {
		// 		path: ".",
		// 		...sessionCookie.attributes,
		// 	});
		// } else {
		// 	const userId = generateIdFromEntropySize(10); // 16 characters long

		// 	// Replace this with your own DB client.
		// 	await db.insert(userTable).values({
		// 		id: userId,
		// 		githubId: githubUser.id.toString(),
		// 		userName: githubUser.login,
		// 		email: githubUser.email,
		// 		name: githubUser.name,
		// 		avatar: githubUser.avatar_url,
		// 	});

		// 	const session = await lucia.createSession(userId, {});
		// 	const sessionCookie = lucia.createSessionCookie(session.id);
		// 	event.cookies.set(sessionCookie.name, sessionCookie.value, {
		// 		path: ".",
		// 		...sessionCookie.attributes,
		// 	});
		// }
		// return new Response(null, {
		// 	status: 302,
		// 	headers: {
		// 		Location: "/",
		// 	},
		// });
	} catch (e) {
		return json({ error: e });
	}
}

interface GitHubUser {
	id: number;
	login: string;
	avatar_url: string;
	name: string;
	email: string;
}
