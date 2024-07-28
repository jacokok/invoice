import type { RequestHandler } from "./$types";
import { CHROMIUM_PATH } from "$env/static/private";
import { chromium } from "playwright";

interface Params {
	userId: string;
	date: string;
}

export const POST: RequestHandler = async ({ request }) => {
	const params = (await request.json()) as Params;
	// const result = JSON.stringify(params);
	const pdf = await htmlToPDF(params);
	return new Response(pdf);
};

const htmlToPDF = async (params: Params) => {
	const browser = await chromium.launch({
		executablePath: CHROMIUM_PATH,
		// TODO: Remove headless
		headless: false,
	});
	const page = await browser.newPage();

	await page.goto(`http://localhost:5173/pdf/${params.userId}/${params.date}`);
	const result = await page.pdf({
		format: "A4",
		printBackground: true,
		margin: { left: "0px", top: "0px", right: "0px", bottom: "0px" },
	});
	await browser.close();
	return result;
};
