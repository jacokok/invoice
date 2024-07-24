import { z } from "zod";

export const createTimeSchema = z.object({
	id: z.number().optional(),
	date: z.string(),
	description: z.string(),
	hours: z.number(),
});
