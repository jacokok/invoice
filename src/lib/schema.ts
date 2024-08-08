import { relations } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

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

export const timeTable = sqliteTable("time", {
	id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
	description: text("description").notNull(),
	hours: integer("hours", { mode: "number" }).notNull(),
	date: integer("date", { mode: "timestamp" }).notNull(),
	userId: text("user_id")
		.notNull()
		.references(() => userTable.id),
	projectId: integer("project_id", { mode: "number" })
		.notNull()
		.references(() => projectTable.id),
});

export const userDetailTable = sqliteTable("user_detail", {
	userId: text("user_id")
		.primaryKey()
		.notNull()
		.references(() => userTable.id),
	invoiceNumber: integer("invoice_number", { mode: "number" }).notNull(),
	name: text("name").notNull(),
	email: text("email").notNull(),
	contactNumber: text("contact_number").notNull(),
	address: text("address").notNull(),
	bankName: text("bank_name").notNull(),
	bankAccountNumber: text("bank_account_number").notNull(),
	bankBranchCode: text("bank_branch_code").notNull(),
	bankHolderName: text("bank_holder_name").notNull(),
});

export const projectTable = sqliteTable("project", {
	id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
	name: text("name").notNull(),
	billName: text("bill_name").notNull(),
	billAddress: text("bill_address").notNull(),
	rate: real("rate").notNull(),
	primaryColorLight: text("primary_color_light").notNull().default("#18181b"),
	primaryColorDark: text("primary_color_dark").notNull().default("#fafafa"),
	userId: text("user_id")
		.notNull()
		.references(() => userTable.id),
});

export const projectRelations = relations(timeTable, ({ one }) => ({
	project: one(projectTable, { fields: [timeTable.projectId], references: [projectTable.id] }),
}));
