<script lang="ts">
	import { cubicInOut } from "svelte/easing";
	import { crossfade } from "svelte/transition";
	import { page } from "$app/stores";
	import { Button } from "@kayord/ui";
	import { cn } from "@kayord/ui/utils";

	const [send, receive] = crossfade({
		duration: 250,
		easing: cubicInOut,
	});

	let { children } = $props();

	const items = [
		{ href: "/profile/userDetail", title: "User Detail" },
		{ href: "/profile/project", title: "Projects" },
	];
</script>

<nav class={"m-2 flex justify-center space-x-2"}>
	<div class="rounded-md bg-muted p-1">
		{#each items as item}
			{@const isActive = $page.url.pathname === item.href}

			<Button
				href={item.href}
				variant="ghost"
				class={cn(
					!isActive && "hover:underline",
					"relative h-8 justify-start hover:bg-transparent"
				)}
				data-sveltekit-noscroll
			>
				{#if isActive}
					<div
						class="absolute inset-0 rounded-md bg-background"
						in:send={{ key: "active-sidebar-tab" }}
						out:receive={{ key: "active-sidebar-tab" }}
					></div>
				{/if}
				<div class="relative">
					{item.title}
				</div>
			</Button>
		{/each}
	</div>
</nav>

{@render children()}
