import { pgTable, serial, text, date, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Schema

export const kv = pgTable("kv", {
	id: text("key").primaryKey(),
	value: text("value").notNull(),
});

export const time = pgTable("time", {
	id: serial("id").primaryKey(),
	date: date("date").notNull(),
	hours: integer("hours").notNull(),
	description: text("description").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const project = pgTable("project", {
	id: serial("id").primaryKey(),
	name: text("name").notNull(),
	billedToName: text("billedToName").notNull(),
	address: text("address").notNull(),
});

export const detail = pgTable("detail", {
	id: serial("id").primaryKey(),
	name: text("name").notNull(),
	contactNumber: text("contactNumber").notNull(),
	email: text("email").notNull(),
	address: text("address").notNull(),
	bankName: text("bankName").notNull(),
	bankAccountNumber: text("bankAccountNumber").notNull(),
	bankBranchCode: text("bankBranchCode").notNull(),
	bankHolderName: text("bankHolderName").notNull(),
	rate: integer("rate").notNull(),
	invoiceNumber: integer("invoiceNumber").notNull(),
});

// Zod Schemas

export const kvSchema = createInsertSchema(kv);
export const timeSchema = createInsertSchema(time);
export const detailSchema = createInsertSchema(detail, {
	id: z
		.number()
		.nullish()
		.transform((x) => x ?? undefined),
	name: (i) => i.name.min(1),
	contactNumber: (i) => i.contactNumber.min(1),
	email: (i) => i.email.email(),
	address: (i) => i.address.min(1),
	bankName: (i) => i.bankName.min(1),
	bankAccountNumber: (i) => i.bankAccountNumber.min(1),
	bankBranchCode: (i) => i.bankBranchCode.min(1),
	bankHolderName: (i) => i.bankHolderName.min(1),
	rate: z.coerce.number(),
	invoiceNumber: z.coerce.number(),
}).required();
