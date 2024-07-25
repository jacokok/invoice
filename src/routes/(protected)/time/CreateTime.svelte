<script lang="ts">
	import { Button, Calendar, Dialog, Form, Input, Textarea, toast } from "@kayord/ui";
	import type { PageData } from "./$types";
	import { superForm } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";
	import CreateIcon from "lucide-svelte/icons/plus";
	import { CalendarDate, getLocalTimeZone, parseDate, today } from "@internationalized/date";
	import { insertTimeSchema } from "$lib/dbSchemas";

	let { data }: { data: PageData } = $props();

	let open = $state(false);

	const form = superForm(data.form, {
		validators: zodClient(insertTimeSchema),
		onUpdated({ form }) {
			if (form.valid) {
				open = false;
				toast(form.message);
			}
		},
	});

	const { form: formData, enhance } = form;

	let placeholder = $state(today(getLocalTimeZone()));

	let value: CalendarDate | undefined = $state(undefined);
</script>

<div>
	<Button variant="outline" onclick={() => (open = true)}>
		<CreateIcon class="mr-2 size-5" />Create
	</Button>
	<Dialog.Root bind:open>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>Time</Dialog.Title>
				<Dialog.Description>Log time worked</Dialog.Description>
			</Dialog.Header>

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
									$formData.date = v.toDate("Africa/Johannesburg");
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
				<Button type="submit" class="mt-2 w-full">Create</Button>
			</form>
		</Dialog.Content>
	</Dialog.Root>
</div>
