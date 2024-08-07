import type { RequestHandler } from "./$types";
import { CHROMIUM_PATH } from "$env/static/private";
import { chromium } from "playwright-core";

export const GET: RequestHandler = async () => {
	const result = await htmlToPDF();
	return new Response(result);
};

const htmlToPDF = async () => {
	const browser = await chromium.launch({
		executablePath: CHROMIUM_PATH,
	});
	const page = await browser.newPage();

	await page.goto("http://localhost:5173/pdf");
	const result = await page.pdf({
		format: "A4",
		printBackground: true,
		margin: { left: "0px", top: "0px", right: "0px", bottom: "0px" },
	});
	await browser.close();
	return result;
};
