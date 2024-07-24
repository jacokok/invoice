import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const userTable = sqliteTable("user", {
	id: text("id").notNull().primaryKey(),
	githubId: text("github_id").unique(),
	userName: text("username").notNull(),
	role: text("role").notNull().default("USER"),
	avatar: text("avatar"),
	name: text("name").notNull(),
	email: text("email").notNull(),
});

export const sessionTable = sqliteTable("session", {
	id: text("id").notNull().primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => userTable.id),
	expiresAt: integer("expires_at").notNull(),
});

export const kv = sqliteTable("kv", {
	id: text("key").primaryKey(),
	name: text("value").notNull(),
});
