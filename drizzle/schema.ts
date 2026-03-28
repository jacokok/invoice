import { integer, real, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const userBak = sqliteTable("user_bak", {
	id: text().primaryKey().notNull(),
	githubId: text("github_id"),
	username: text().notNull(),
	role: text().default("USER").notNull(),
	avatar: text(),
	name: text().notNull(),
	email: text().notNull(),
	},
	(table) => [uniqueIndex("user_github_id_unique").on(table.githubId)]
);

export const sessionBak = sqliteTable("session_bak", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").notNull().references(() => userBak.id),
	expiresAt: integer("expires_at").notNull(),
});

export const timeBak = sqliteTable("time_bak", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	description: text().notNull(),
	hours: integer().notNull(),
	userId: text("user_id").notNull().references(() => userBak.id),
	date: integer().notNull(),
	projectId: integer("project_id").notNull().references(() => projectBak.id),
});

export const userDetailBak = sqliteTable("user_detail_bak", {
	userId: text("user_id").primaryKey().notNull().references(() => userBak.id),
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

export const projectBak = sqliteTable("project_bak", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	name: text().notNull(),
	billName: text("bill_name").notNull(),
	billAddress: text("bill_address").notNull(),
	rate: real().notNull(),
	userId: text("user_id").notNull().references(() => userBak.id),
	primaryColorLight: text("primary_color_light").default("#18181b").notNull(),
	primaryColorDark: text("primary_color_dark").default("#fafafa").notNull(),
});
