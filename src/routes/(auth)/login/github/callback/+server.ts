import { OAuth2RequestError } from "arctic";
import { generateIdFromEntropySize } from "lucia";
import { github, lucia } from "$lib/server/auth";

import { json, type RequestEvent } from "@sveltejs/kit";
import { db } from "$lib/server";
import { userTable } from "$lib/schema";
import { eq } from "drizzle-orm";

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get("code");
	const state = event.url.searchParams.get("state");
	const storedState = event.cookies.get("github_oauth_state") ?? null;

	if (!code || !state || !storedState || state !== storedState) {
		console.log(state !== storedState);
		return json({ code, state, storedState, message: "Need code and state" }, { status: 400 });
	}

	const progress: Array<string> = [];

	try {
		progress.push("start");
		const tokens = await github.validateAuthorizationCode(code);
		progress.push("tokens " + JSON.stringify(tokens));
		const githubUserResponse = await fetch("https://api.github.com/user", {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`,
			},
		});
		progress.push("githubUserResponse " + JSON.stringify(githubUserResponse));
		const githubUser: GitHubUser = await githubUserResponse.json();

		progress.push("githubUser " + JSON.stringify(githubUser));

		const existingUser = await db.query.userTable.findFirst({
			where: eq(userTable.githubId, githubUser.id.toString()),
		});

		progress.push("existingUser " + JSON.stringify(existingUser));

		if (existingUser) {
			const session = await lucia.createSession(existingUser.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: ".",
				...sessionCookie.attributes,
			});
		} else {
			progress.push("generateIdFromEntropySize");
			const userId = generateIdFromEntropySize(10); // 16 characters long
			progress.push("userId " + userId);

			// Replace this with your own DB client.
			await db.insert(userTable).values({
				id: userId,
				githubId: githubUser.id.toString(),
				userName: githubUser.login,
				email: githubUser.email,
				name: githubUser.name,
				avatar: githubUser.avatar_url,
			});

			const session = await lucia.createSession(userId, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: ".",
				...sessionCookie.attributes,
			});
		}
		return new Response(null, {
			status: 302,
			headers: {
				Location: "/",
			},
		});
	} catch (e) {
		// the specific error message depends on the provider
		if (e instanceof OAuth2RequestError) {
			// invalid code
			return json({ error: e, message: "Invalid code", progress }, { status: 400 });
		}
		return json({ error: e, message: "Critical Error", progress }, { status: 500 });
	}
}

interface GitHubUser {
	id: number;
	login: string;
	avatar_url: string;
	name: string;
	email: string;
}
