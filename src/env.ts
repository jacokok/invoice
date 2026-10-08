import { defineEnvVars } from "@sveltejs/kit/env";

// Keep builds independent of deployment secrets; the database validates its URL on first use.
const optionalString = (value: string | undefined) => value;

export const variables = defineEnvVars({
	DATABASE_URL: { schema: optionalString },
	DATABASE_AUTH_TOKEN: { schema: optionalString },
	PUBLIC_ORIGIN: { public: true, schema: optionalString },
	GITHUB_CLIENT_ID: { schema: optionalString },
	GITHUB_CLIENT_SECRET: { schema: optionalString },
	BETTER_AUTH_SECRET: { schema: optionalString },
	BETTER_AUTH_URL: { schema: optionalString },
});
