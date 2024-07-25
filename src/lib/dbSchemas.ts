import { createInsertSchema } from "drizzle-zod";
import { timeTable } from "./server/schema";

const insertTimeSchema = createInsertSchema(timeTable);

export { insertTimeSchema };
