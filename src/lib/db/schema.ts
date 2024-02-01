import { pgTable, serial, text, date, numeric } from "drizzle-orm/pg-core";

export const kv = pgTable("kv", {
	id: text("key").primaryKey(),
	value: text("value").notNull(),
});

export const time = pgTable("time", {
	id: serial("id").primaryKey(),
	date: date("date").notNull(),
	hours: numeric("hours").notNull(),
	description: text("description").notNull(),
});
