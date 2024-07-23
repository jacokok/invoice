import type { RequestHandler } from "./$types";
import { chromium, firefox, devices } from "playwright";

export const GET: RequestHandler = async () => {
	const browser = await firefox.launch({ headless: false, slowMo: 50 });
	const context = await browser.newContext(devices["Desktop Firefox"]);
	const page = await context.newPage();

	await page.goto("https://playwright.dev/");
	await page.screenshot({ path: `example.png` });
	await browser.close();
	return new Response("test");
};
