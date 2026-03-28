import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	ssr: {
		external: ["@libsql/client", "@libsql/core", "drizzle-orm", "drizzle-orm/libsql", "libsql"],
	},
	build: {
		rollupOptions: {
			external: [
				/@libsql\/.*/,
				"@libsql/client",
				"@libsql/core",
				"drizzle-orm",
				"drizzle-orm/libsql",
				"libsql",
			],
		},
	},
	optimizeDeps: {
		exclude: ["@libsql/client", "@libsql/core", "drizzle-orm", "drizzle-orm/libsql", "libsql"],
	},
});
