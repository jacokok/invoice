import { z } from "zod";

export const schema = z.object({
	userId: z.string(),
	date: z.string(),
	projectId: z.number(),
	colorScheme: z.string(),
	isPreview: z.string(),
});

export type FormSchema = z.infer<typeof schema>;

export const dateToYM = (date: Date, isValue?: boolean) => {
	const day = "01";
	const month = date.toLocaleString("default", { month: "short" });
	const year = date.getFullYear();
	if (isValue) {
		const numMonth = String(date.getMonth() + 1).padStart(2, "0");
		return `${year}-${numMonth}-${day}`;
	} else {
		return `${month} ${year}`;
	}
};
