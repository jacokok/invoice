<script lang="ts">
	import { Card, Label, RadioGroup } from "@kayord/ui";
	import { setMode, userPrefersMode } from "@kayord/ui/mode-watcher";

	type Mode = "system" | "dark" | "light";

	const setTheme = (value: string) => {
		setMode(value as unknown as Mode);
	};
</script>

<div class="m-4">
	<h2 class="text-2xl font-bold tracking-tight">Settings</h2>
	<p class="text-muted-foreground">Personalize your settings</p>
</div>

<Card.Root class="m-4">
	<Card.Header>
		<Card.Title>Theme</Card.Title>
		<Card.Description>Toggle between light and dark mode</Card.Description>
	</Card.Header>
	<Card.Content>
		<RadioGroup.Root
			value={$userPrefersMode}
			onValueChange={(value) => {
				setTheme(value);
			}}
		>
			<div class="flex items-center space-x-2">
				<RadioGroup.Item value="system" id="system" />
				<Label for="system">System</Label>
			</div>
			<div class="flex items-center space-x-2">
				<RadioGroup.Item value="dark" id="dark" />
				<Label for="dark">Dark</Label>
			</div>
			<div class="flex items-center space-x-2">
				<RadioGroup.Item value="light" id="light" />
				<Label for="light">Light</Label>
			</div>
			<RadioGroup.Input name="theme" />
		</RadioGroup.Root>
	</Card.Content>
</Card.Root>
