<script lang="ts">
	import { Button, Calendar, Card, Form, Input, Select, Textarea, toast } from "@kayord/ui";
	import type { PageData } from "./$types";
	import { superForm } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";
	import { CalendarDate, getLocalTimeZone, parseDate, today } from "@internationalized/date";
	import { insertTimeSchema } from "$lib/dbSchemas";
	import { page } from "$app/stores";
	import { goto } from "$app/navigation";

	let { data }: { data: PageData } = $props();

	let open = $state(false);

	const form = superForm(data.form, {
		validators: zodClient(insertTimeSchema),
		resetForm: false,
		onUpdated({ form }) {
			if (form.valid) {
				open = false;
				goto("/time");
				toast(form.message);
			}
		},
	});

	const { form: formData, enhance } = form;

	let placeholder = $state(today(getLocalTimeZone()));

	let value: CalendarDate | undefined = $state(undefined);

	const getProjectLabel = (id: number) => {
		const project = data.projects.filter((x) => x.id === id);
		if (project.length > 0) {
			return project[0].name;
		}
		return id.toString();
	};

	const selectedProject = $derived(
		$formData.projectId > 0
			? {
					label: getProjectLabel($formData.projectId),
					value: $formData.projectId.toString(),
				}
			: undefined
	);

	const id = $derived($page.params?.id ? Number($page.params?.id) : undefined);
</script>

<div class="m-4 flex flex-col gap-2">
	<Card.Root>
		<Card.Header>
			<Card.Title>Time</Card.Title>
			<Card.Description>Capture time</Card.Description>
		</Card.Header>
		<Card.Content>
			<form use:enhance method="POST" action="?/upsert" class="flex flex-col gap-3">
				<input type="hidden" name="id" bind:value={$formData.id} />
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
				<Form.Field {form} name="projectId">
					<Form.Control let:attrs>
						<Form.Label>Project</Form.Label>
						<Select.Root
							selected={selectedProject}
							onSelectedChange={(v) => {
								v && ($formData.projectId = Number(v.value));
							}}
						>
							<Select.Trigger {...attrs}>
								<Select.Value placeholder="Select a project" />
							</Select.Trigger>
							<Select.Content>
								{#each data.projects as project}
									<Select.Item value={project.id} label={project.name} />
								{/each}
							</Select.Content>
						</Select.Root>
						<input hidden bind:value={$formData.projectId} name={attrs.name} />
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
				<div class="flex items-center justify-between">
					<Button variant="secondary" href="/time">Cancel</Button>
					<Button type="submit">
						{#if id}
							Update
						{:else}
							Create
						{/if}
					</Button>
				</div>
			</form>
		</Card.Content>
	</Card.Root>
</div>
