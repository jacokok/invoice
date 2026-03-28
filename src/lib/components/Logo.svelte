<script lang="ts">
	import { mode } from "mode-watcher";

	const logoSrc = $derived(mode.current == "light" ? "/icon-light.svg" : "/icon.svg");
</script>

<img src={logoSrc} alt="logo" class="size-5" />
