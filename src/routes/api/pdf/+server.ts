import type { RequestHandler } from "./$types";
import { env } from "$env/dynamic/private";
import puppeteer from "puppeteer-core";

interface Params {
	userId: string;
	projectId: string;
	date: string;
	colorScheme: "light" | "dark";
}

export const POST: RequestHandler = async ({ request, fetch }) => {
	const params = (await request.json()) as Params;

	let html: string = "";
	const resp = await fetch(
		`${env.APP_URL}/pdf/${params.userId}/${params.projectId}/${encodeURIComponent(params.date)}`
	);
	if (resp.ok) {
		html = await resp.text();
		if (params.colorScheme === "light") {
			html = html.replace('class="dark"', "");
		}
	}

	const pdf = await htmlToPDF(html);
	return new Response(pdf);
};

const htmlToPDF = async (html: string) => {
	const browser = await puppeteer.connect({ browserWSEndpoint: env.BROWSERLESS_ENDPOINT ?? "" });
	const page = await browser.newPage();
	page.emulateMediaType("screen");
	await page.setContent(html);
	const result = await page.pdf({
		printBackground: true,
	});
	await browser.close();
	return result;
};
