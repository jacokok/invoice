<script lang="ts">
	import { dateToString } from "$lib/util";
	import { Separator } from "@kayord/ui";

	let { date, description, hours }: { date: Date; description: string; hours: number } = $props();
</script>

<div class="flex break-inside-avoid flex-col">
	<div class="flex items-center justify-between px-6 py-4">
		<div class="flex flex-col">
			<div>{dateToString(date)}</div>
			<div class="whitespace-pre-line text-muted-foreground">{description}</div>
		</div>
		<div>{hours}</div>
	</div>
	<Separator />
</div>
