import { createAuthClient } from "better-auth/svelte";
import * as env from "$app/env/public";
export const authClient = createAuthClient({
	baseURL: env.PUBLIC_ORIGIN,
});
export type Session = typeof authClient.$Infer.Session;
