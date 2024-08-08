import type { RequestHandler } from "./$types";
import { CHROMIUM_PATH, APP_URL } from "$env/static/private";
import { chromium } from "playwright-core";

interface Params {
	userId: string;
	projectId: string;
	date: string;
	colorScheme: "light" | "dark";
}

export const POST: RequestHandler = async ({ request }) => {
	// sleep for 5 seconds TODO: Remove this
	await new Promise((resolve) => setTimeout(resolve, 5000));
	const params = (await request.json()) as Params;
	const pdf = await htmlToPDF(params);
	return new Response(pdf);
};

const htmlToPDF = async (params: Params) => {
	const browser = await chromium.launch({
		executablePath: CHROMIUM_PATH,
		// TODO: Remove headless
		headless: true,
	});
	const page = await browser.newPage();
	await page.emulateMedia({ media: "screen" });
	await page.emulateMedia({ colorScheme: params.colorScheme });
	await page.goto(
		`${APP_URL}/pdf/${params.userId}/${params.projectId}/${encodeURIComponent(params.date)}`
	);
	const result = await page.pdf({
		// format: "",
		// preferCSSPageSize: true,
		// height: "100wh",
		printBackground: true,
		// margin: { left: "0px", top: "20px", right: "0px", bottom: "0px" },
	});
	await browser.close();
	return result;
};
