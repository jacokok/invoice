<!-- routes/+page.svelte -->
<script lang="ts">
	import { enhance } from "$app/forms";
	import { Button } from "@kayord/ui";
</script>

Welcome to application

<form method="post" action="/logout">
	<Button type="submit">Sign out</Button>
</form>
