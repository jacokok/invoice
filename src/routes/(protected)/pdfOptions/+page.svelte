<script lang="ts">
	import { Button, Card, Form, Input, Select, Switch, toast } from "@kayord/ui";
	import type { PageData } from "./$types";
	import { defaults, superForm } from "sveltekit-superforms";
	import { zod, zodClient } from "sveltekit-superforms/adapters";
	import { z } from "zod";
	import { isError } from "$lib/types";
	import { toPascalCase } from "$lib/util";
	import { dateToYM, schema, type FormSchema } from "./schema";
	import { goto } from "$app/navigation";

	let { data }: { data: PageData } = $props();

	const downloadPDF = async (data: FormSchema) => {
		try {
			const params = {
				userId: data.userId,
				date: data.date,
				projectId: data.projectId,
				colorScheme: data.colorScheme,
			};

			const response = await fetch("/api/pdf", {
				method: "POST",
				body: JSON.stringify(params),
			});
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}

			const blob = await response.blob();
			const downloadUrl = window.URL.createObjectURL(new Blob([blob]));
			const link = document.createElement("a");
			link.href = downloadUrl;
			link.download = "file.pdf";
			document.body.appendChild(link);
			link.click();
			link.parentNode?.removeChild(link);
		} catch (err) {
			const message = isError(err) ? err.message : "Unknown error";
			toast.error(message);
		}
	};

	const preview = async (data: FormSchema) => {
		await goto(`/pdf/${data.userId}/${data.projectId}/${encodeURIComponent(data.date)}`);
	};

	const onSubmit = async (data: FormSchema) => {
		if (data.isPreview) {
			await preview(data);
		} else {
			await downloadPDF(data);
		}
	};

	const getDates = () => {
		const months = Array.from({ length: 12 }, (_, i) => {
			const date = new Date();
			date.setMonth(date.getMonth() - i);
			return { label: dateToYM(date), value: dateToYM(date, true) };
		});

		return months;
	};

	const form = superForm(data.form, {
		validators: zodClient(schema),
		resetForm: false,
		onUpdated({ form }) {
			if (form.valid) {
				onSubmit(form.data);
			}
		},
	});

	const { form: formData, enhance } = form;

	let dates = getDates();

	const selectedDate = $derived(
		$formData.date
			? {
					label: dateToYM(new Date($formData.date)),
					value: $formData.date,
				}
			: undefined
	);

	const selectedColorScheme = $derived({
		label: toPascalCase($formData.colorScheme),
		value: $formData.colorScheme,
	});

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
</script>

<div class="m-4 flex flex-col gap-2">
	<Card.Root>
		<Card.Header>
			<Card.Title>Invoice</Card.Title>
			<Card.Description>Click Download to download the invoice</Card.Description>
		</Card.Header>
		<Card.Content>
			<form use:enhance method="POST" action="?/validate" class="flex flex-col gap-3">
				<input type="hidden" name="userId" bind:value={$formData.userId} />
				<Form.Field {form} name="date">
					<Form.Control let:attrs>
						<Form.Label>Date</Form.Label>
						<Select.Root
							selected={selectedDate}
							onSelectedChange={(v) => {
								console.log(v);
								v && ($formData.date = v.value);
							}}
						>
							<Select.Trigger {...attrs}>
								<Select.Value placeholder="Select a date" />
							</Select.Trigger>
							<Select.Content>
								{#each dates as d}
									<Select.Item value={d.value} label={d.label} />
								{/each}
							</Select.Content>
						</Select.Root>
						<input hidden bind:value={$formData.date} name={attrs.name} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="colorScheme">
					<Form.Control let:attrs>
						<Form.Label>Color Scheme</Form.Label>
						<Select.Root
							selected={selectedColorScheme}
							onSelectedChange={(v) => {
								v && ($formData.colorScheme = v.value);
							}}
						>
							<Select.Trigger {...attrs}>
								<Select.Value placeholder="Select scheme" />
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="dark" label="Dark" />
								<Select.Item value="light" label="Light" />
							</Select.Content>
						</Select.Root>
						<input hidden bind:value={$formData.colorScheme} name={attrs.name} />
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

				<Form.Field
					{form}
					name="isPreview"
					class="flex flex-row items-center justify-between rounded-lg border p-4"
				>
					<Form.Control let:attrs>
						<div class="space-y-0.5">
							<Form.Label>Show Preview</Form.Label>
						</div>
						<Switch includeInput {...attrs} bind:checked={$formData.isPreview} />
					</Form.Control>
				</Form.Field>

				<div class="flex items-center justify-between">
					<Button variant="secondary" href="/time">Cancel</Button>
					<div>
						<Button type="submit">{$formData.isPreview ? "Preview" : "Download"}</Button>
					</div>
				</div>
			</form>
		</Card.Content>
	</Card.Root>
</div>
