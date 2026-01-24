import { OAuth2RequestError } from "arctic";
import { github } from "$lib/server/auth";
import { generateRandomString, type RandomReader } from "@oslojs/crypto/random";

import { json, type RequestEvent } from "@sveltejs/kit";
import { db } from "$lib/server";
import { userTable } from "$lib/schema";
import { eq } from "drizzle-orm";
import { createSession, generateSessionToken, setSessionTokenCookie } from "$lib/server/session";

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get("code");
	const state = event.url.searchParams.get("state");
	const storedState = event.cookies.get("github_oauth_state") ?? null;

	if (!code || !state || !storedState || state !== storedState) {
		console.log(state !== storedState);
		return json({ code, state, storedState, message: "Need code and state" }, { status: 400 });
	}

	try {
		const tokens = await github.validateAuthorizationCode(code);

		const githubUserResponse = await event.fetch("https://api.github.com/user", {
			headers: {
				Authorization: `Bearer ${tokens.accessToken()}`,
				"User-Agent": "invoice",
			},
		});

		const githubUser: GitHubUser = await githubUserResponse.json();

		const existingUser = await db.query.userTable.findFirst({
			where: eq(userTable.githubId, githubUser.id.toString()),
		});

		if (existingUser) {
			const token = generateSessionToken();
			const session = await createSession(token, existingUser.id);
			setSessionTokenCookie(event, token, session.expiresAt);
		} else {
			const random: RandomReader = {
				read(bytes: Uint8Array): void {
					crypto.getRandomValues(bytes);
				},
			};

			const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
			const userId = generateRandomString(random, alphabet, 10); // 16 characters long

			// Replace this with your own DB client.
			await db.insert(userTable).values({
				id: userId,
				githubId: githubUser.id.toString(),
				userName: githubUser.login,
				email: githubUser.email,
				name: githubUser.name,
				avatar: githubUser.avatar_url,
			});

			const token = generateSessionToken();
			const session = await createSession(token, userId);
			setSessionTokenCookie(event, token, session.expiresAt);
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
			return json({ error: e, message: "Invalid code" }, { status: 400 });
		}
		return json({ error: e, message: "Critical Error" }, { status: 500 });
	}
}

interface GitHubUser {
	id: number;
	login: string;
	avatar_url: string;
	name: string;
	email: string;
}
