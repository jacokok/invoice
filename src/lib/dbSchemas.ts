import { createInsertSchema } from "drizzle-zod";
import { projectTable, timeTable, userDetailTable } from "./schema";

const insertTimeSchema = createInsertSchema(timeTable, {
	description: (s) => s.description.min(1, "Please enter a description"),
	hours: (s) => s.hours.min(1, "Please enter a positive number"),
});

const insertUserDetailSchema = createInsertSchema(userDetailTable, {
	invoiceNumber: (s) => s.invoiceNumber.positive(),
	address: (s) => s.address.min(1, "Please enter a address"),
	bankAccountNumber: (s) => s.bankAccountNumber.min(1, "Please enter a bank Account Number"),
	bankBranchCode: (s) => s.bankBranchCode.min(1, "Please enter a bank Branch Code"),
	bankHolderName: (s) => s.bankHolderName.min(1, "Please enter a bank Holder Name"),
	bankName: (s) => s.bankHolderName.min(1, "Please enter a bank Name"),
	contactNumber: (s) => s.contactNumber.min(1, "Please enter contactNumber"),
	email: (s) => s.contactNumber.min(1, "Please enter email"),
	name: (s) => s.name.min(1, "Please enter name"),
});

const insertProjectSchema = createInsertSchema(projectTable, {
	name: (s) => s.name.min(1, "Please enter a name"),
	billName: (s) => s.billName.min(1, "Please enter a bill Name"),
	billAddress: (s) => s.billAddress.min(1, "Please enter a bill Address"),
	rate: (s) => s.rate.min(1, "Please enter a rate"),
});

export { insertTimeSchema, insertUserDetailSchema, insertProjectSchema };
