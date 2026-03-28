import { createInsertSchema } from "drizzle-zod";
import { project, userDetail } from "$lib/server/db/schema";
import z from "zod";

const insertTimeSchema = z.object({
	id: z.coerce.number<string | number>().optional(),
	description: z.string().min(1, "Please enter a description"),
	date: z.string().min(1, "Please enter a date"),
	hours: z.coerce.number<string | number>().min(0.25, "Please enter hours worked"),
	projectId: z.coerce.number<string | number>().positive("Please select a project"),
	userId: z.string().min(1, "Please enter userId"),
});

const insertUserDetailSchema = createInsertSchema(userDetail, {
	userId: (s) => s.optional(),
	invoiceNumber: (s) => s.positive(),
	address: (s) => s.min(1, "Please enter a address"),
	bankAccountNumber: (s) => s.min(1, "Please enter a bank Account Number"),
	bankBranchCode: (s) => s.min(1, "Please enter a bank Branch Code"),
	bankHolderName: (s) => s.min(1, "Please enter a bank Holder Name"),
	bankName: (s) => s.min(1, "Please enter a bank Name"),
	contactNumber: (s) => s.min(1, "Please enter contactNumber"),
	email: (s) => s.min(1, "Please enter email"),
	name: (s) => s.min(1, "Please enter name"),
});

const insertProjectSchema = createInsertSchema(project, {
	name: (s) => s.min(1, "Please enter a name"),
	billName: (s) => s.min(1, "Please enter a bill Name"),
	billAddress: (s) => s.min(1, "Please enter a bill Address"),
	rate: (s) => s.min(1, "Please enter a rate"),
	primaryColorDark: (s) => s.min(1, "Please pick a primary color for dark theme"),
	primaryColorLight: (s) => s.min(1, "Please pick a primary color for light theme"),
});

export { insertTimeSchema, insertUserDetailSchema, insertProjectSchema };
