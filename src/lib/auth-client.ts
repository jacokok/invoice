import { createAuthClient } from "better-auth/svelte";
import { PUBLIC_ORIGIN } from "$env/static/public";
export const authClient = createAuthClient({
	baseURL: PUBLIC_ORIGIN,
});
export type Session = typeof authClient.$Infer.Session;
