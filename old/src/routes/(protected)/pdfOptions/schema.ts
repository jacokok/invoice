import { z } from "zod";

export const schema = z.object({
	userId: z.string(),
	date: z.string(),
	projectId: z.number(),
	colorScheme: z.string(),
	isPreview: z.boolean(),
});

export type FormSchema = z.infer<typeof schema>;

export const dateToYM = (date: Date, isValue?: boolean) => {
	const day = "01";
	const month = date.toLocaleString("default", { month: "short" });
	const year = date.getFullYear();
	if (isValue) {
		return new Date(`${year}-${month}-${day}`).toLocaleDateString();
	} else {
		return `${month} ${year}`;
	}
};
