import { createInsertSchema } from "drizzle-zod";
import { project, time, userDetail } from "$lib/server/db/schema";

const insertTimeSchema = createInsertSchema(time, {
	description: (s) => s.min(1, "Please enter a description"),
	hours: (s) => s.min(1, "Please enter a positive number"),
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
