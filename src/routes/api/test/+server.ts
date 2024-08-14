import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { env } from "$env/dynamic/private";
import { chromium, firefox, webkit } from "playwright-core";

export const GET: RequestHandler = async () => {
	console.log(env.CHROMIUM_PATH);
	console.log("launching browser");

	const browser = await chromium.launch({
		executablePath: env.CHROMIUM_PATH ?? "",
	});

	return json({ test: "it works" });
};
