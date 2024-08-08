import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { chromium } from "playwright-core";
import { env } from "$env/dynamic/private";

export const GET: RequestHandler = async () => {
	const browser = await chromium.launch({
		executablePath: env.CHROMIUM_PATH,
		headless: true,
	});

	const page = await browser.newPage();
	await page.goto("https://example.com");
	const html = await page.innerHTML("body");
	await browser.close();
	return json({ html });
};
