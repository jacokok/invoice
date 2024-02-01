<script lang="ts">
	import { Button, Form } from "@kayord/ui";
	import type { SuperValidated } from "sveltekit-superforms";
	import { detailSchema } from "$lib/db/schema";
	export let form: SuperValidated<typeof detailSchema>;
</script>

<Form.Root method="POST" {form} schema={detailSchema} let:config>
	<Form.Field {config} name="name">
		<Form.Item>
			<Form.Label>Name</Form.Label>
			<Form.Input />
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Form.Field {config} name="contactNumber">
		<Form.Item>
			<Form.Label>Contact Number</Form.Label>
			<Form.Input />
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Form.Field {config} name="email">
		<Form.Item>
			<Form.Label>Email</Form.Label>
			<Form.Input />
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Form.Field {config} name="address">
		<Form.Item>
			<Form.Label>Address</Form.Label>
			<Form.Input />
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Form.Field {config} name="bankName">
		<Form.Item>
			<Form.Label>Bank Name</Form.Label>
			<Form.Input />
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Form.Field {config} name="bankAccountNumber">
		<Form.Item>
			<Form.Label>Bank Account Number</Form.Label>
			<Form.Input />
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Form.Field {config} name="bankBranchCode">
		<Form.Item>
			<Form.Label>Bank Branch Code</Form.Label>
			<Form.Input />
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Form.Field {config} name="bankHolderName">
		<Form.Item>
			<Form.Label>Bank Holder Name</Form.Label>
			<Form.Input />
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Form.Field {config} name="rate">
		<Form.Item>
			<Form.Label>Rate</Form.Label>
			<Form.Input type="number" />
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Form.Field {config} name="invoiceNumber">
		<Form.Item>
			<Form.Label>Invoice Number</Form.Label>
			<Form.Input type="number" />
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Form.Button type="submit">Submit</Form.Button>
</Form.Root>
