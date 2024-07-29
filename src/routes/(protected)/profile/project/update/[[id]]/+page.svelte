<script lang="ts">
	import { Button, Card, Form, Input, Textarea, toast } from "@kayord/ui";
	import { superForm } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";
	import { insertProjectSchema } from "$lib/dbSchemas";
	import { page } from "$app/stores";
	import { goto } from "$app/navigation";

	let { data } = $props();

	const form = superForm(data.form, {
		validators: zodClient(insertProjectSchema),
		resetForm: false,
		onUpdated({ form }) {
			if (form.valid) {
				goto("/profile/project");
				toast(form.message);
			}
		},
	});
	const { form: formData, enhance } = form;

	const id = $derived($page.params?.id ? Number($page.params?.id) : undefined);
</script>

<div class="m-4 flex flex-col gap-2">
	<Card.Root>
		<Card.Header>
			<Card.Title>Project</Card.Title>
			<Card.Description>Project Details</Card.Description>
		</Card.Header>
		<Card.Content>
			<form use:enhance method="POST" action="?/upsert" class="flex flex-col gap-3">
				<input type="hidden" name="id" bind:value={$formData.id} />
				<Form.Field {form} name="name">
					<Form.Control let:attrs>
						<Form.Label>Name</Form.Label>
						<Input {...attrs} bind:value={$formData.name} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="billName">
					<Form.Control let:attrs>
						<Form.Label>Bill Name</Form.Label>
						<Input {...attrs} bind:value={$formData.billName} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="billAddress">
					<Form.Control let:attrs>
						<Form.Label>Bill Address</Form.Label>
						<Textarea {...attrs} bind:value={$formData.billAddress} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="rate">
					<Form.Control let:attrs>
						<Form.Label>Rate</Form.Label>
						<Input type="number" step="0.01" {...attrs} bind:value={$formData.rate} />
					</Form.Control>
					<Form.Description>Rand per hour</Form.Description>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="primaryColorDark">
					<Form.Control let:attrs>
						<Form.Label>Primary Color (dark theme)</Form.Label>
						<Input type="color" {...attrs} bind:value={$formData.primaryColorDark} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="primaryColorLight">
					<Form.Control let:attrs>
						<Form.Label>Primary Color (light theme)</Form.Label>
						<Input type="color" {...attrs} bind:value={$formData.primaryColorLight} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<div class="flex items-center justify-between">
					<Button variant="secondary" href="/profile/project">Cancel</Button>
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
