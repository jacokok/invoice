import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { env } from "$env/dynamic/private";
import { chromium } from "playwright-core";

export const GET: RequestHandler = async () => {
	const browser = await chromium.launch({
		executablePath: env.CHROMIUM_PATH ?? "",
	});

	const page = await browser.newPage();
	await page.goto("https://example.com");
	const html = await page.evaluate(() => document.querySelector("body")?.innerHTML);
	await browser.close();
	return json({ html });
};
