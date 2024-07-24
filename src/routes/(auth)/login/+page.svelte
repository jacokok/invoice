<script>
	import { Button, Card } from "@kayord/ui";
	import CodeIcon from "lucide-svelte/icons/code";
</script>

<Card.Root class="m-8">
	<Card.Header>
		<Card.Title>Github</Card.Title>
		<Card.Description>Sign in with Github</Card.Description>
	</Card.Header>
	<Card.Footer>
		<Button href="/login/github">
			<CodeIcon class="mr-2 size-5" /> Github
		</Button>
	</Card.Footer>
</Card.Root>
