<script lang="ts">
	import { Button } from "@kayord/ui";
	import type { PageData } from "./$types";
	import SetupForm from "./SetupForm.svelte";

	export let data: PageData;
</script>

<div class="m-8">
	<SetupForm form={data.form} />
</div>

<Button href="/">Home</Button>
