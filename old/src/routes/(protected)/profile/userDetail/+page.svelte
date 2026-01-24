<script lang="ts">
	import { Button, Card, Form, Input, Textarea, toast } from "@kayord/ui";
	import type { PageData } from "./$types";
	import { superForm } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";
	import { insertUserDetailSchema } from "$lib/dbSchemas";

	let { data } = $props();

	const form = superForm(data.form, {
		validators: zodClient(insertUserDetailSchema),
		resetForm: false,
		onUpdated({ form }) {
			if (form.valid) {
				toast(form.message);
			}
		},
	});
	const { form: formData, enhance } = form;
</script>

<div class="m-4 flex flex-col gap-2">
	<Card.Root>
		<Card.Header>
			<Card.Title>User Settings</Card.Title>
			<Card.Description>Additional settings required to generate invoice</Card.Description>
		</Card.Header>
		<Card.Content>
			<form use:enhance method="POST" action="?/update" class="flex flex-col gap-3">
				<Form.Field {form} name="invoiceNumber">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Invoice Number</Form.Label>
							<Input type="number" {...props} bind:value={$formData.invoiceNumber} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="name">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Name</Form.Label>
							<Input {...props} bind:value={$formData.name} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="email">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Email</Form.Label>
							<Input {...props} bind:value={$formData.email} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="contactNumber">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Contact Number</Form.Label>
							<Input {...props} bind:value={$formData.contactNumber} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="address">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Address</Form.Label>
							<Textarea {...props} bind:value={$formData.address} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="bankName">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Bank Name</Form.Label>
							<Input {...props} bind:value={$formData.bankName} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="bankHolderName">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Bank Holder Name</Form.Label>
							<Input {...props} bind:value={$formData.bankHolderName} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="bankBranchCode">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Bank Branch Code</Form.Label>
							<Input {...props} bind:value={$formData.bankBranchCode} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="bankAccountNumber">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Bank Account Number</Form.Label>
							<Input {...props} bind:value={$formData.bankAccountNumber} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Button type="submit" class="w-full">Save</Button>
			</form>
		</Card.Content>
	</Card.Root>
</div>
