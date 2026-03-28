<script lang="ts">
	import { page } from "$app/state";
	let { children } = $props();

	$effect(() => {
		const isDark = page.url.searchParams.get("theme") === "dark";
		if (isDark) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	});
</script>

{@render children()}
