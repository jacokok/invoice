<script lang="ts">
	import { Button } from "@kayord/ui";
	import type { PageData } from "./$types";

	export let data: PageData;

	console.log(data.detail);
</script>

Detail

{#each data.detail as item}
	<Button href={`/detail/${item.id}`}>{item.id}</Button>
{/each}

<Button href="/detail/0">Add New</Button>
