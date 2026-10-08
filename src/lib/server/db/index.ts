import { drizzle } from "drizzle-orm/libsql";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";
import * as env from "$app/env/private";

function createDb(): LibSQLDatabase<typeof schema> {
	if (!env.DATABASE_URL) throw new Error("DATABASE_URL is required to connect to the database");
	const client = createClient({
		url: env.DATABASE_URL,
		authToken: env.DATABASE_AUTH_TOKEN,
	});
	return drizzle(client, { schema });
}

let _db: LibSQLDatabase<typeof schema> | undefined;

export const db: LibSQLDatabase<typeof schema> = new Proxy({} as LibSQLDatabase<typeof schema>, {
	get(_, prop) {
		if (!_db) _db = createDb();
		return Reflect.get(_db, prop);
	},
});
