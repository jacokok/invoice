import type { Config } from "drizzle-kit";

const { DATABASE_URL, DATABASE_AUTH_TOKEN } = process.env;
if (!DATABASE_URL) {
	throw new Error("No url");
}

export default {
	schema: "./src/lib/schema.ts",
	out: "drizzle",
	driver: "turso",
	dialect: "sqlite",
	dbCredentials: {
		url: DATABASE_URL,
		authToken: DATABASE_AUTH_TOKEN,
	},
} satisfies Config;
