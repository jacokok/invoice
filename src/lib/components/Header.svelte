<script lang="ts">
	import { invalidateAll } from "$app/navigation";
	import { Avatar, DropdownMenu } from "@kayord/ui";
	import type { User } from "lucia";
	import Logo from "./Logo.svelte";

	interface Props {
		user?: User;
	}

	let { user }: Props = $props();

	const logout = async () => {
		await fetch("/logout", { method: "POST" });
		await invalidateAll();
	};
</script>

<div class="flex w-full items-center justify-between bg-secondary p-2">
	<a href="/">
		<div class="flex items-center gap-2">
			<Logo />
			Invoice
		</div>
	</a>
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			<Avatar.Root>
				<Avatar.Fallback class="bg-primary text-primary-foreground">KJ</Avatar.Fallback>
				<Avatar.Image src={user?.avatar} />
			</Avatar.Root>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content>
			<DropdownMenu.Group>
				<DropdownMenu.Label>My Account</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.Item href="/profile/userDetail">Profile</DropdownMenu.Item>
				<DropdownMenu.Item href="/settings">Settings</DropdownMenu.Item>
				<DropdownMenu.Item on:click={logout}>Logout</DropdownMenu.Item>
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</div>
