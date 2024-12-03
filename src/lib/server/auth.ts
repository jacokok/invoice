import { GitHub } from "arctic";
import { env } from "$env/dynamic/private";

// interface DatabaseUserAttributes {
// 	githubId: number;
// 	userName: string;
// 	role: string;
// 	avatar: string;
// 	name: string;
// 	email: string;
// }

export const github = new GitHub(
	env.GITHUB_CLIENT_ID,
	env.GITHUB_CLIENT_SECRET,
	// null
	`${env.ORIGIN}/login/github/callback`
);
