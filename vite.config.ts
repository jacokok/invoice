import adapter from "@sveltejs/adapter-node";
import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "PUBLIC_");

	return {
		plugins: [
			tailwindcss(),
			sveltekit({
				adapter: adapter(),
				paths: {
					origin: env.PUBLIC_ORIGIN || undefined,
				},
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
			external: ["@libsql/client", "@formepdf/html"],
		},
		optimizeDeps: {
			exclude: ["@libsql/client"],
		},
	};
});
