// import { pgTable, text } from "drizzle-orm/pg-core";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const kv = sqliteTable("kv", {
	id: text("key").primaryKey(),
	name: text("value").notNull(),
});
