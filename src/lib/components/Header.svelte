<script lang="ts">
	import { goto } from "$app/navigation";
	import { Avatar, DropdownMenu } from "@kayord/ui";
	import Logo from "./Logo.svelte";
	import { authClient, type Session } from "$lib/auth-client";
	import { getInitials } from "$lib/util";
	import { resolve } from "$app/paths";

	interface Props {
		session: Session | null;
	}

	let { session }: Props = $props();

	const logout = async () => {
		await authClient.signOut({ fetchOptions: { onSuccess: () => goto(resolve("/login")) } });
	};
</script>

<div class="flex w-full items-center justify-between bg-secondary p-2">
	<a href={resolve("/")}>
		<div class="flex items-center gap-2">
			<Logo />
			Invoice
		</div>
	</a>
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			<Avatar.Root>
				<Avatar.Fallback class="bg-primary text-primary-foreground">
					{getInitials(session?.user.name ?? "")}
				</Avatar.Fallback>
				<Avatar.Image src={session?.user.image} />
			</Avatar.Root>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content>
			<DropdownMenu.Group>
				<DropdownMenu.Label>My Account</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.Item onclick={() => goto(resolve("/profile/userDetail"))}
					>Profile</DropdownMenu.Item
				>
				<DropdownMenu.Item onclick={() => goto(resolve("/settings"))}>Settings</DropdownMenu.Item>
				<DropdownMenu.Item onclick={logout}>Logout</DropdownMenu.Item>
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</div>
