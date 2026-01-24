import { sqliteTable, AnySQLiteColumn, uniqueIndex, text, foreignKey, integer, real } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const user = sqliteTable("user", {
	id: text().primaryKey().notNull(),
	githubId: text("github_id"),
	username: text().notNull(),
	role: text().default("USER").notNull(),
	avatar: text(),
	name: text().notNull(),
	email: text().notNull(),
},
(table) => [
	uniqueIndex("user_github_id_unique").on(table.githubId),
]);

export const session = sqliteTable("session", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").notNull().references(() => user.id),
	expiresAt: integer("expires_at").notNull(),
});

export const time = sqliteTable("time", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	description: text().notNull(),
	hours: integer().notNull(),
	userId: text("user_id").notNull().references(() => user.id),
	date: integer().notNull(),
	projectId: integer("project_id").notNull().references(() => project.id),
});

export const userDetail = sqliteTable("user_detail", {
	userId: text("user_id").primaryKey().notNull().references(() => user.id),
	invoiceNumber: integer("invoice_number").notNull(),
	name: text().notNull(),
	email: text().notNull(),
	contactNumber: text("contact_number").notNull(),
	address: text().notNull(),
	bankName: text("bank_name").notNull(),
	bankAccountNumber: text("bank_account_number").notNull(),
	bankBranchCode: text("bank_branch_code").notNull(),
	bankHolderName: text("bank_holder_name").notNull(),
});

export const project = sqliteTable("project", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	name: text().notNull(),
	billName: text("bill_name").notNull(),
	billAddress: text("bill_address").notNull(),
	rate: real().notNull(),
	userId: text("user_id").notNull().references(() => user.id),
	primaryColorLight: text("primary_color_light").default("#18181b").notNull(),
	primaryColorDark: text("primary_color_dark").default("#fafafa").notNull(),
});

