import type { RequestHandler } from "./$types";
import { env } from "$env/dynamic/private";
import { chromium } from "playwright-core";

interface Params {
	userId: string;
	projectId: string;
	date: string;
	colorScheme: "light" | "dark";
}

export const POST: RequestHandler = async ({ request }) => {
	console.log("received request and starting");
	const params = (await request.json()) as Params;

	const browser = await chromium.launch({
		executablePath: env.CHROMIUM_PATH ?? "",
	});
	const page = await browser.newPage({ screen: { height: 1080, width: 1920 } });

	console.log("New page created");
	await page.emulateMedia({ media: "screen" });

	console.log("Emulate Media screen");
	await page.emulateMedia({ colorScheme: params.colorScheme });
	await page.goto(
		`${env.ORIGIN}/pdf/${params.userId}/${params.projectId}/${encodeURIComponent(params.date)}`
	);

	console.log("Goto the page mans url:");
	console.log(
		`${env.ORIGIN}/pdf/${params.userId}/${params.projectId}/${encodeURIComponent(params.date)}`
	);

	const pdf = await page.pdf({
		printBackground: true,
		preferCSSPageSize: true,
	});
	await browser.close();
	return new Response(pdf);
};
