import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import puppeteer from "@cloudflare/puppeteer";

export const GET: RequestHandler = async ({ platform }) => {
	const browser = await puppeteer.launch(platform?.env.MYBROWSER);
	// const browser = await puppeteer.launch(MYBROWSER, { fetch });
	const page = await browser.newPage();
	await page.goto("https://example.com");
	const metrics = await page.metrics();
	await browser.close();
	return json(metrics);
};

// const htmlToPDF = async () => {
// 	const browser = await chromium.launch({
// 		executablePath: CHROMIUM_PATH,
// 	});
// 	const page = await browser.newPage();

// 	await page.goto("http://localhost:5173/pdf");
// 	const result = await page.pdf({
// 		format: "A4",
// 		printBackground: true,
// 		margin: { left: "0px", top: "0px", right: "0px", bottom: "0px" },
// 	});
// 	await browser.close();
// 	return result;
// };
