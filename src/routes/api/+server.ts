import { db, schema } from "$lib/server";
import { json } from "@sveltejs/kit";

const { kv } = schema;

export const GET = async () => {
	const result = await db.select().from(kv).execute();
	return json(result);
};
