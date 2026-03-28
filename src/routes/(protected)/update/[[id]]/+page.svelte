<script lang="ts">
	import { Button, Card, Field, Input, Select, Textarea } from "@kayord/ui";
	import { Calendar } from "@kayord/ui/calendar";
	import type { DateValue } from "@internationalized/date";
	import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
	// import { insertTimeSchema } from "$lib/dbSchemas";
	import { page } from "$app/state";
	import { updateTime, getUpdate } from "./update.remote";
	import { toast } from "svelte-sonner";
	import { goto } from "$app/navigation";
	type UpdateTimeResult = { success: boolean; message: string };

	const id = $derived(page.params?.id ? Number(page.params?.id) : undefined);
	const data = $derived(await getUpdate(id));

	const selectedProjectName = $derived.by(() => {
		const projectId = updateTime.fields.projectId.value();
		if (!projectId) return "Select a project";
		const project = data.projects.find((p) => p.id === Number(projectId));
		return project?.name ?? "Select a project";
	});

	const defaultProjectId = $derived.by(() => {
		const projectId = Number(updateTime.fields.projectId.value());
		if (Number.isFinite(projectId) && projectId > 0) {
			return projectId;
		}
		return data?.projects?.[0]?.id ?? 1;
	});

	const normalizeDateString = (value: unknown) => {
		if (typeof value !== "string") return "";
		return value.slice(0, 10);
	};

	const calendarValue = $derived.by(() => {
		const value = normalizeDateString(updateTime.fields.date.value());
		return value ? parseDate(value) : undefined;
	});

	let placeholder = $state(today(getLocalTimeZone()));

	$effect(() => {
		if (data?.item) {
			const dateString =
				data.item.date instanceof Date
					? data.item.date.toISOString().split("T")[0]
					: normalizeDateString(String(data.item.date));

			updateTime.fields.set({
				id: data.item.id || 0,
				description: data.item.description || "",
				date: dateString || "",
				hours: data.item.hours || 1,
				projectId: data.item.projectId || data.projects[0]?.id || 0,
				userId: data.item.userId || "",
			});
		}
	});
</script>

<div class="m-4 flex flex-col gap-2">
	<Card.Root>
		<Card.Header>
			<Card.Title>Time</Card.Title>
			<Card.Description>Capture time</Card.Description>
		</Card.Header>
		<Card.Content>
			<form
				class="flex flex-col gap-3"
				{...updateTime.enhance(async ({ submit }) => {
					try {
						await submit();
						const result = updateTime.result as UpdateTimeResult | undefined;
						if (result?.success) {
							toast(result.message);
							goto("/");
						} else {
							toast.error(result?.message ?? "Error updating user details");
						}
					} catch {
						toast.error("Error updating user details");
					}
				})}
			>
				<input type="hidden" name="id" value={updateTime.fields.id.value() ?? 0} />
				<input type="hidden" name="userId" value={updateTime.fields.userId.value() ?? ""} />
				<input
					type="hidden"
					name="date"
					value={normalizeDateString(updateTime.fields.date.value()) ||
						new Date().toISOString().split("T")[0]}
				/>
				<Field.Set>
					<Field.Group>
						<Field.Field>
							<Field.Label {...updateTime.fields.date}>Date</Field.Label>
							<div class="flex">
								<Calendar
									value={calendarValue}
									bind:placeholder
									type="single"
									class="rounded-md border"
									onValueChange={(value: DateValue | undefined) =>
										updateTime.fields.date.set(value?.toString() ?? "")}
								/>
							</div>
							{#each updateTime.fields.date.issues() as issue (issue)}
								<Field.Error>{issue.message}</Field.Error>
							{/each}
						</Field.Field>

						<Field.Field>
							<Field.Label {...updateTime.fields.projectId}>Project</Field.Label>
							<input type="hidden" name="projectId" value={defaultProjectId} />
							<Select.Root
								value={updateTime.fields.projectId.value()?.toString() ?? ""}
								type="single"
								allowDeselect={false}
								onValueChange={(val) => updateTime.fields.projectId.set(Number(val))}
							>
								<Select.Trigger>
									{selectedProjectName}
								</Select.Trigger>
								<Select.Content>
									{#each data.projects as project (project)}
										<Select.Item value={project.id.toString()} label={project.name} />
									{/each}
								</Select.Content>
							</Select.Root>
							{#each updateTime.fields.projectId.issues() as issue (issue)}
								<Field.Error>{issue.message}</Field.Error>
							{/each}
						</Field.Field>

						<Field.Field>
							<Field.Label {...updateTime.fields.description}>Description</Field.Label>
							<Textarea {...updateTime.fields.description.as("text")} />
							{#each updateTime.fields.description.issues() as issue (issue)}
								<Field.Error>{issue.message}</Field.Error>
							{/each}
						</Field.Field>
						<Field.Field>
							<Field.Label {...updateTime.fields.hours}>Hours</Field.Label>
							<Input {...updateTime.fields.hours.as("number")} />
							{#each updateTime.fields.hours.issues() as issue (issue)}
								<Field.Error>{issue.message}</Field.Error>
							{/each}
						</Field.Field>
					</Field.Group>
				</Field.Set>

				<div class="flex items-center justify-between">
					<Button variant="secondary" href="/">Cancel</Button>
					<Button type="submit">
						{#if id}
							Update
						{:else}
							Create
						{/if}
					</Button>
				</div>
			</form>
			<!-- <form use:enhance method="POST" action="?/upsert" class="flex flex-col gap-3">
				<input type="hidden" name="id" bind:value={$formData.id} />
				<Form.Field {form} name="date">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Date</Form.Label>
							<div class="flex">
								<Calendar
									{value}
									bind:placeholder
									class="rounded-md border"
									onValueChange={(v: CalendarDate) => {
										$formData.date = v.toDate("Africa/Johannesburg");
									}}
								/>
							</div>
							<input hidden value={$formData.date} name={props.name} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="projectId">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Project</Form.Label>
							<Select.Root bind:value={$formData.projectId} type="single" allowDeselect={false}>
								<Select.Trigger {...props}>
									{selectedProject ? selectedProject.label : "Select a project"}
								</Select.Trigger>
								<Select.Content>
									{#each data.projects as project}
										<Select.Item value={project.id} label={project.name} />
									{/each}
								</Select.Content>
							</Select.Root>
							<input hidden bind:value={$formData.projectId} name={props.name} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="description">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Description</Form.Label>
							<Textarea {...props} bind:value={$formData.description} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="hours">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Hours</Form.Label>
							<Input type="number" {...props} bind:value={$formData.hours} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<div class="flex items-center justify-between">
					<Button variant="secondary" href="/">Cancel</Button>
					<Button type="submit">
						{#if id}
							Update
						{:else}
							Create
						{/if}
					</Button>
				</div>
			</form> -->
		</Card.Content>
	</Card.Root>
</div>
