<script lang="ts">
	import { Button, Card, Field, Input, Select, Skeleton, Textarea } from "@kayord/ui";
	import { Calendar } from "@kayord/ui/calendar";
	import type { DateValue } from "@internationalized/date";
	import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";
	import { page } from "$app/state";
	import { updateTime, getUpdate } from "./update.remote";
	import { toast } from "svelte-sonner";
	type UpdateTimeResult = { success: boolean; message: string };

	const id = $derived(page.params?.id ? Number(page.params?.id) : undefined);
	const updateQuery = $derived(getUpdate(id));
	const data = $derived(updateQuery.current);

	const selectedProjectName = $derived.by(() => {
		const projectId = updateTime.fields.projectId.value();
		if (!projectId) return "Select a project";
		const project = data?.projects.find((p) => p.id === Number(projectId));
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
			{#if updateQuery.error}
				<div role="alert" class="flex flex-col gap-3">
					<p>Could not load time entry. Please try again.</p>
					<div class="flex items-center justify-between">
						<Button variant="secondary" href={resolve("/(protected)")}>Cancel</Button>
						<Button onclick={() => updateQuery.refresh().catch(() => {})}>Retry</Button>
					</div>
				</div>
			{:else if data}
				<form
					class="flex flex-col gap-3"
					{...updateTime.enhance(async ({ submit }) => {
						try {
							await submit();
							const result = updateTime.result as UpdateTimeResult | undefined;
							if (result?.success) {
								toast(result.message);
								goto(resolve("/(protected)"));
							} else {
								toast.error(result?.message ?? "Error updating user details");
							}
						} catch {
							toast.error("Error updating user details");
						}
					})}
				>
					<input
						{...updateTime.fields.id.as("hidden", Number(updateTime.fields.id.value() ?? 0))}
					/>
					<input
						{...updateTime.fields.userId.as("hidden", updateTime.fields.userId.value() ?? "")}
					/>
					<input
						{...updateTime.fields.date.as(
							"hidden",
							normalizeDateString(updateTime.fields.date.value()) ||
								new Date().toISOString().split("T")[0]
						)}
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
								<input {...updateTime.fields.projectId.as("hidden", defaultProjectId)} />
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
						<Button type="submit" disabled={updateTime.pending > 0}>
							{#if id}
								Update
							{:else}
								Create
							{/if}
						</Button>
					</div>
				</form>
			{:else}
				<div role="status" aria-label="Loading time entry" aria-busy="true">
					<span class="sr-only">Loading time entry…</span>
					<div aria-hidden="true" class="flex flex-col gap-6">
						<div class="flex flex-col gap-3">
							<Skeleton class="h-4 w-12" />
							<Skeleton class="h-80 w-72 max-w-full rounded-md" />
						</div>
						<div class="flex flex-col gap-3">
							<Skeleton class="h-4 w-16" />
							<Skeleton class="h-9 w-full" />
						</div>
						<div class="flex flex-col gap-3">
							<Skeleton class="h-4 w-24" />
							<Skeleton class="h-20 w-full" />
						</div>
						<div class="flex flex-col gap-3">
							<Skeleton class="h-4 w-12" />
							<Skeleton class="h-9 w-full" />
						</div>
						<div class="flex items-center justify-between">
							<Skeleton class="h-9 w-20" />
							<Skeleton class="h-9 w-20" />
						</div>
					</div>
				</div>
			{/if}
		</Card.Content>
	</Card.Root>
</div>
