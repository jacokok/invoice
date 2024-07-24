<script lang="ts">
	import { Button, Calendar, Card, Form, Input, Textarea, toast } from "@kayord/ui";
	import type { PageData } from "./$types";
	import SuperDebug, { superForm, superValidate } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";
	import { createTimeSchema } from "./schema";
	import { CalendarDate, getLocalTimeZone, parseDate, today } from "@internationalized/date";

	let { data }: { data: PageData } = $props();

	const form = superForm(data.form, {
		validators: zodClient(createTimeSchema),
	});

	const { form: formData, enhance } = form;

	let placeholder = $state(today(getLocalTimeZone()));

	let value: CalendarDate | undefined = $state(undefined);
</script>

<Card.Root class="mx-auto w-full max-w-xl">
	<Card.Header>
		<Card.Title>Time</Card.Title>
		<Card.Description>Log time worked</Card.Description>
	</Card.Header>
	<Card.Content>
		<form use:enhance method="POST" action="?/create" class="flex flex-col gap-3">
			<Form.Field {form} name="date">
				<Form.Control let:attrs>
					<Form.Label>Date</Form.Label>
					<div class="flex">
						<Calendar
							{value}
							bind:placeholder
							class="rounded-md border"
							onValueChange={(v: CalendarDate) => {
								$formData.date = v.toString();
								value = parseDate(v.toString());
							}}
						/>
					</div>
					<input hidden value={$formData.date} name={attrs.name} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="description">
				<Form.Control let:attrs>
					<Form.Label>Description</Form.Label>
					<Textarea {...attrs} bind:value={$formData.description} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="hours">
				<Form.Control let:attrs>
					<Form.Label>Hours</Form.Label>
					<Input type="number" {...attrs} bind:value={$formData.hours} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<SuperDebug data={$formData} />
			<Button type="submit" class="mt-2 self-start">Create</Button>
		</form>
	</Card.Content>
</Card.Root>

<div class="m-4">
	<form method="POST" action="?/create">
		<Button type="submit">Create</Button>
	</form>
</div>

{#each data.data as d}
	<Card.Root class="m-4">
		<Card.Header>
			<Card.Title>{d.id}</Card.Title>
			<Card.Description>{d.description}</Card.Description>
		</Card.Header>
		<Card.Content>
			Date: {d.date}
		</Card.Content>
		<Card.Footer>
			<form method="POST" action="?/delete">
				<input type="hidden" name="id" value={d.id} />
				<Button type="submit" variant="destructive">Delete</Button>
			</form>
		</Card.Footer>
	</Card.Root>
{/each}
