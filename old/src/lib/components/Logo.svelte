<script lang="ts">
	import { mode } from "@kayord/ui/mode-watcher";

	const logoSrc = $derived($mode == "light" ? "/icon-light.svg" : "/icon.svg");
</script>

<img src={logoSrc} alt="logo" class="size-5" />
