import { z } from "zod";

export const schema = z.object({
	userId: z.string().min(1),
	date: z.iso.date(),
	projectId: z.number().int().positive(),
	colorScheme: z.enum(["light", "dark"]),
	isPreview: z.enum(["true", "false"]),
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
