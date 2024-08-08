import { Lucia } from "lucia";
// import { dev } from "$app/environment";
import { GitHub } from "arctic";
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from "$env/static/private";
import { adapter } from "./adapter";

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			// secure: !dev,
			secure: false,
		},
	},
	getUserAttributes: (attributes) => {
		return {
			// attributes has the type of DatabaseUserAttributes
			githubId: attributes.githubId,
			username: attributes.userName,
			role: attributes.role,
			avatar: attributes.avatar,
			name: attributes.name,
			email: attributes.email,
		};
	},
});

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseUserAttributes {
	githubId: number;
	userName: string;
	role: string;
	avatar: string;
	name: string;
	email: string;
}

export const github = new GitHub(GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET);
