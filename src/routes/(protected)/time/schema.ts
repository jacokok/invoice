import { z } from "zod";

export const createTimeSchema = z.object({
	id: z.number().optional(),
	date: z.coerce.date(),
	description: z.string().min(1, "Please enter a description"),
	hours: z.coerce.number().min(1, "Please enter a positive number"),
});
