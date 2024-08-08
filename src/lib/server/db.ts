import { drizzle } from "drizzle-orm/libsql";
import { env } from "$env/dynamic/private";

import { createClient } from "@libsql/client";
import { schema } from ".";

const client = createClient({
	url: env.DATABASE_URL ?? "libsql://invoice-doink.turso.io",
	authToken: env.DATABASE_AUTH_TOKEN,
});
export const db = drizzle(client, { schema });
