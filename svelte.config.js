import adapter from "@sveltejs/adapter-node";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		alias: {
			$lib: "./src/lib",
		},
		adapter: adapter({
			routes: {
				include: ["/*"],
				exclude: ["<all>"],
			},
		}),
	},
};

export default config;
