import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { env } from "$env/dynamic/private";
import puppeteer from "puppeteer-core";

export const GET: RequestHandler = async () => {
	console.log("lets go", env.BROWSERLESS_ENDPOINT);
	const browser = await puppeteer.connect({
		browserWSEndpoint: env.BROWSERLESS_ENDPOINT ?? "",
	});

	const page = await browser.newPage();
	await page.goto("https://example.com");
	const html = await page.evaluate(() => document.querySelector("body")?.innerHTML);
	await browser.close();
	return json({ html });
};
