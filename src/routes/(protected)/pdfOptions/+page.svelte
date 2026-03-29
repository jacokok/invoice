<script lang="ts">
	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";
	import { toPascalCase } from "$lib/util";
	import { Button, Card, Field, Label, Loader, Select, Switch } from "@kayord/ui";
	import { toast } from "@kayord/ui/sonner";
	import { dateToYM, type FormSchema } from "./schema";
	import { getProjects, submitPdfOptions } from "./options.remote";

	const projectData = $derived(await getProjects());

	let isLoading = $state(false);

	const getDates = () => {
		const now = new Date();
		const months = Array.from({ length: 12 }, (_, i) => {
			const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
			return { label: dateToYM(date), value: dateToYM(date, true) };
		});

		return months;
	};

	const dates = getDates();

	const getDefaultValues = (): FormSchema => ({
		userId: projectData.userId,
		date: dates[0]?.value ?? "",
		projectId: projectData.projects[0]?.id ?? 0,
		colorScheme: "light",
		isPreview: "false",
	});

	$effect(() => {
		submitPdfOptions.fields.set(getDefaultValues());
	});

	const downloadPDF = async (data: FormSchema) => {
		await preview(data);
		// try {
		// 	isLoading = true;
		// 	const params = {
		// 		userId: data.userId,
		// 		date: data.date,
		// 		projectId: data.projectId,
		// 		colorScheme: data.colorScheme,
		// 	};

		// 	const response = await fetch("/api/pdf", {
		// 		method: "POST",
		// 		body: JSON.stringify(params),
		// 	});

		// 	if (!response.ok) {
		// 		throw new Error("Network response was not ok");
		// 	}

		// 	const blob = await response.blob();
		// 	const downloadUrl = window.URL.createObjectURL(new Blob([blob]));
		// 	const link = document.createElement("a");
		// 	link.href = downloadUrl;
		// 	link.download = "file.pdf";
		// 	document.body.appendChild(link);
		// 	link.click();
		// 	link.parentNode?.removeChild(link);
		// } catch (err) {
		// 	const message = isError(err) ? err.message : "Unknown error";
		// 	toast.error(message);
		// } finally {
		// 	isLoading = false;
		// }
	};

	const preview = async (data: FormSchema) => {
		await goto(
			resolve(
				`/pdf/${data.userId}/${data.projectId}/${encodeURIComponent(data.date)}?theme=${data.colorScheme}`
			)
		);
	};

	const getProjectLabel = (id: number) => {
		const project = projectData.projects.find((item) => item.id === id);
		return project?.name ?? id.toString();
	};

	const dateValue = $derived(submitPdfOptions.fields.date.value() ?? "");
	const colorSchemeValue = $derived(submitPdfOptions.fields.colorScheme.value() ?? "dark");
	const projectIdValue = $derived(submitPdfOptions.fields.projectId.value() ?? 0);
	const isPreviewValue = $derived(
		(submitPdfOptions.fields.isPreview.value() ?? "false") === "true"
	);

	const selectedDate = $derived(
		dateValue
			? {
					label: dateToYM(new Date(dateValue)),
					value: dateValue,
				}
			: undefined
	);

	const selectedColorScheme = $derived(
		colorSchemeValue
			? {
					label: toPascalCase(colorSchemeValue),
					value: colorSchemeValue,
				}
			: undefined
	);

	const selectedProject = $derived(
		projectIdValue > 0
			? {
					label: getProjectLabel(projectIdValue),
					value: projectIdValue.toString(),
				}
			: undefined
	);
</script>

<div class="m-4 flex flex-col gap-2">
	<Card.Root>
		<Card.Header>
			<Card.Title>Invoice</Card.Title>
			<Card.Description>Click Download to download the invoice</Card.Description>
		</Card.Header>
		<Card.Content>
			<form
				class="flex flex-col gap-3"
				{...submitPdfOptions.enhance(async ({ submit }) => {
					try {
						isLoading = true;
						await submit();

						const result = submitPdfOptions.result as
							| { success: boolean; message: string }
							| undefined;
						if (!result?.success) {
							toast.error(result?.message ?? "Could not process invoice options");
							return;
						}

						const values = submitPdfOptions.fields.value();
						const isPreview = values.isPreview === "true";

						if (isPreview) {
							await preview(values as FormSchema);
						} else {
							await downloadPDF(values as FormSchema);
						}
					} catch (err) {
						console.error("Form handler error:", err);
						toast.error("Could not process invoice options");
					} finally {
						isLoading = false;
					}
				})}
			>
				<input {...submitPdfOptions.fields.userId.as("hidden", projectData.userId)} />
				<input {...submitPdfOptions.fields.date.as("text")} class="hidden" />
				<input {...submitPdfOptions.fields.colorScheme.as("text")} class="hidden" />
				<input {...submitPdfOptions.fields.projectId.as("number")} class="hidden" />
				<input {...submitPdfOptions.fields.isPreview.as("text")} class="hidden" />

				<Field.Set>
					<Field.Group>
						<Field.Field>
							<Field.Label>Date</Field.Label>
							<Select.Root
								type="single"
								allowDeselect={false}
								value={dateValue}
								onValueChange={(value) => {
									submitPdfOptions.fields.date.set(value);
								}}
							>
								<Select.Trigger>
									{selectedDate ? selectedDate.label : "Select a date"}
								</Select.Trigger>
								<Select.Content>
									{#each dates as date (date.value)}
										<Select.Item value={date.value} label={date.label} />
									{/each}
								</Select.Content>
							</Select.Root>
							{#each submitPdfOptions.fields.date.issues() ?? [] as issue (issue.message)}
								<Field.Error>{issue.message}</Field.Error>
							{/each}
						</Field.Field>

						<Field.Field>
							<Field.Label>Color Scheme</Field.Label>
							<Select.Root
								type="single"
								allowDeselect={false}
								value={selectedColorScheme?.value}
								onValueChange={(value) => {
									submitPdfOptions.fields.colorScheme.set(value);
								}}
							>
								<Select.Trigger>
									{selectedColorScheme ? selectedColorScheme.label : "Select scheme"}
								</Select.Trigger>
								<Select.Content>
									<Select.Item value="dark" label="Dark" />
									<Select.Item value="light" label="Light" />
								</Select.Content>
							</Select.Root>
							{#each submitPdfOptions.fields.colorScheme.issues() ?? [] as issue (issue.message)}
								<Field.Error>{issue.message}</Field.Error>
							{/each}
						</Field.Field>

						<Field.Field>
							<Field.Label>Project</Field.Label>
							<Select.Root
								type="single"
								allowDeselect={false}
								value={selectedProject?.value}
								onValueChange={(value) => {
									submitPdfOptions.fields.projectId.set(Number(value));
								}}
							>
								<Select.Trigger>
									{selectedProject ? selectedProject.label : "Select a project"}
								</Select.Trigger>
								<Select.Content>
									{#each projectData.projects as project (project.id)}
										<Select.Item value={project.id.toString()} label={project.name} />
									{/each}
								</Select.Content>
							</Select.Root>
							{#each submitPdfOptions.fields.projectId.issues() ?? [] as issue (issue.message)}
								<Field.Error>{issue.message}</Field.Error>
							{/each}
						</Field.Field>
						<Field.Field
							class="flex w-full flex-row items-center justify-between rounded-lg border  p-4"
						>
							<Label for="isPreview">Show Preview</Label>
							<div class="flex flex-0">
								<Switch
									class="flex-1"
									id="isPreview"
									checked={isPreviewValue}
									onCheckedChange={(checked) => {
										submitPdfOptions.fields.isPreview.set(checked ? "true" : "false");
									}}
								/>
							</div>
						</Field.Field>
					</Field.Group>
				</Field.Set>

				<div class="flex items-center justify-between">
					<Button variant="secondary" href="/">Cancel</Button>
					<Button disabled={isLoading} type="submit">
						<Loader class="size-4" {isLoading} />
						{isPreviewValue ? "Preview" : "Download"}
					</Button>
				</div>
			</form>
		</Card.Content>
	</Card.Root>
</div>
