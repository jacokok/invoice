import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	build: {
		rollupOptions: {
			external: [
				// Mark @libsql/* modules as external so they use node_modules at runtime
				/@libsql\/.*/,
				"libsql",
			],
		},
	},
});
