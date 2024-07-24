import type { RequestHandler } from "./$types";
import { CHROMIUM_PATH } from "$env/static/private";
import { chromium, devices } from "playwright";

export const GET: RequestHandler = async () => {
	const browser = await chromium.launch({
		executablePath: CHROMIUM_PATH,
	});
	const context = await browser.newContext(devices["Desktop Firefox"]);
	const page = await context.newPage();

	await page.goto("https://playwright.dev/");
	await page.screenshot({ path: `example.png` });
	await browser.close();
	return new Response("test");
};
