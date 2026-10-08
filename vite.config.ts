import adapter from "@sveltejs/adapter-node";
import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			adapter: adapter(),
			experimental: {
				remoteFunctions: true,
			},
			compilerOptions: {
				experimental: {
					async: true,
				},
			},
			inspector: {
				showToggleButton: "never",
			},
		}),
	],
	ssr: {
		external: ["@libsql/client"],
	},
	optimizeDeps: {
		exclude: ["@libsql/client"],
	},
});
