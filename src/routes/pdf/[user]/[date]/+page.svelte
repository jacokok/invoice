<script lang="ts">
	import type { PageData } from "../../$types";
	import Header from "./Header.svelte";

	export let data: PageData;
</script>

<Header />
<div>Text</div>
<div class="size-5 bg-green-400">a</div>

<div class="text-red-500">More</div>
