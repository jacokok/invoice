<script lang="ts">
	import { Avatar, Badge, Button, Card, Form, Input, Textarea, toast } from "@kayord/ui";
	import type { PageData } from "./$types";
	import { defaults, superForm } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";
	import { insertUserDetailSchema } from "$lib/dbSchemas";

	export let data: PageData;

	const form = superForm(data.form, {
		validators: zodClient(insertUserDetailSchema),
		resetForm: false,
		onUpdated({ form }) {
			console.log("on updated", form);
			if (form.valid) {
				toast(form.message);
			}
		},
	});
	const { form: formData, enhance } = form;
</script>

<div class="m-4 flex flex-col gap-2">
	<Card.Root>
		<Card.Header class="flex gap-2">
			<Avatar.Root>
				<Avatar.Fallback class="bg-primary text-primary-foreground">KJ</Avatar.Fallback>
				<Avatar.Image src={data.user?.avatar} />
			</Avatar.Root>
			<div>
				<Card.Title>{data.user?.name}</Card.Title>
				<Card.Description>{data.user?.email}</Card.Description>
				<Badge>{data.user?.role}</Badge>
			</div>
		</Card.Header>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Title>User Settings</Card.Title>
			<Card.Description>Additional settings required to generate invoice</Card.Description>
		</Card.Header>
		<Card.Content>
			<form use:enhance method="POST" action="?/update" class="flex flex-col gap-3">
				<Form.Field {form} name="invoiceNumber">
					<Form.Control let:attrs>
						<Form.Label>Invoice Number</Form.Label>
						<Input type="number" {...attrs} bind:value={$formData.invoiceNumber} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="name">
					<Form.Control let:attrs>
						<Form.Label>Name</Form.Label>
						<Input {...attrs} bind:value={$formData.name} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="email">
					<Form.Control let:attrs>
						<Form.Label>Email</Form.Label>
						<Input {...attrs} bind:value={$formData.email} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="contactNumber">
					<Form.Control let:attrs>
						<Form.Label>Contact Number</Form.Label>
						<Input {...attrs} bind:value={$formData.contactNumber} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="address">
					<Form.Control let:attrs>
						<Form.Label>Address</Form.Label>
						<Textarea {...attrs} bind:value={$formData.address} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="bankName">
					<Form.Control let:attrs>
						<Form.Label>Bank Name</Form.Label>
						<Input {...attrs} bind:value={$formData.bankName} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="bankHolderName">
					<Form.Control let:attrs>
						<Form.Label>Bank Holder Name</Form.Label>
						<Input {...attrs} bind:value={$formData.bankHolderName} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="bankBranchCode">
					<Form.Control let:attrs>
						<Form.Label>Bank Branch Code</Form.Label>
						<Input {...attrs} bind:value={$formData.bankBranchCode} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="bankAccountNumber">
					<Form.Control let:attrs>
						<Form.Label>Bank Account Number</Form.Label>
						<Input {...attrs} bind:value={$formData.bankAccountNumber} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Button type="submit" class="w-full">Save</Button>
			</form>
		</Card.Content>
	</Card.Root>
</div>
