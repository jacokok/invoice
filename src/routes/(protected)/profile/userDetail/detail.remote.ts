import { form, getRequestEvent, query } from "$app/server";
import { eq } from "drizzle-orm";
import { db } from "$lib/server/db";
import { time, userDetail } from "$lib/server/db/schema";
import { insertUserDetailSchema } from "$lib/insertSchema";
import { error } from "@sveltejs/kit";

export const getDetail = query(async () => {
	const { locals } = getRequestEvent();
	const item = await db.query.userDetail.findFirst({
		where: eq(time.userId, locals.user?.id ?? ""),
	});

	return { item };
});

export const updateDetail = form(insertUserDetailSchema, async (params) => {
	try {
		const { locals } = getRequestEvent();
		if (locals.user?.id == null) {
			error(401, "Unauthorized");
		}

		const values = {
			...params,
			userId: locals.user?.id,
		};

		await db.insert(userDetail).values(values).onConflictDoUpdate({
			target: userDetail.userId,
			set: values,
		});

		return { success: true, message: "Updated user details" };
	} catch {
		return { success: false, message: "Failed to update user details" };
	}
});
