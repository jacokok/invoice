<script lang="ts">
	import { toast } from "svelte-sonner";
	import { getDetail, updateDetail } from "./detail.remote";
	import { Button, Card, Input, Textarea, Field } from "@kayord/ui";

	const data = $derived(await getDetail());

	$effect(() => {
		if (data.item) updateDetail.fields.set(data.item);
	});
</script>

<div class="m-4 flex flex-col gap-2">
	<Card.Root>
		<Card.Header>
			<Card.Title>User Settings</Card.Title>
			<Card.Description>Additional settings required to generate invoice</Card.Description>
		</Card.Header>
		<Card.Content>
			<form
				class="flex flex-col gap-3"
				{...updateDetail.enhance(async ({ submit }) => {
					try {
						await submit();
						if (updateDetail.result?.success) {
							toast(updateDetail.result?.message);
						} else {
							toast.error(updateDetail.result?.message ?? "Error updating user details");
						}
					} catch {
						toast.error("Error updating user details");
					}
				})}
			>
				<Field.Set>
					<Field.Group>
						<Field.Field>
							<Field.Label {...updateDetail.fields.invoiceNumber}>Invoice Number</Field.Label>
							<Input {...updateDetail.fields.invoiceNumber.as("number")} />
							{#each updateDetail.fields.invoiceNumber.issues() as issue (issue)}
								<Field.Error>{issue.message}</Field.Error>
							{/each}
						</Field.Field>
						<Field.Field>
							<Field.Label {...updateDetail.fields.name}>Name</Field.Label>
							<Input {...updateDetail.fields.name.as("text")} />
							{#each updateDetail.fields.name.issues() as issue (issue)}
								<Field.Error>{issue.message}</Field.Error>
							{/each}
						</Field.Field>
						<Field.Field>
							<Field.Label {...updateDetail.fields.email}>Email</Field.Label>
							<Input {...updateDetail.fields.email.as("text")} />
							{#each updateDetail.fields.email.issues() as issue (issue)}
								<Field.Error>{issue.message}</Field.Error>
							{/each}
						</Field.Field>
						<Field.Field>
							<Field.Label {...updateDetail.fields.contactNumber}>Contact Number</Field.Label>
							<Input {...updateDetail.fields.contactNumber.as("text")} />
							{#each updateDetail.fields.contactNumber.issues() as issue (issue)}
								<Field.Error>{issue.message}</Field.Error>
							{/each}
						</Field.Field>
						<Field.Field>
							<Field.Label {...updateDetail.fields.address}>Address</Field.Label>
							<Textarea {...updateDetail.fields.address.as("text")} />
							{#each updateDetail.fields.address.issues() as issue (issue)}
								<Field.Error>{issue.message}</Field.Error>
							{/each}
						</Field.Field>
						<Field.Field>
							<Field.Label {...updateDetail.fields.bankName}>Bank Name</Field.Label>
							<Input {...updateDetail.fields.bankName.as("text")} />
							{#each updateDetail.fields.bankName.issues() as issue (issue)}
								<Field.Error>{issue.message}</Field.Error>
							{/each}
						</Field.Field>

						<Field.Field>
							<Field.Label {...updateDetail.fields.bankHolderName}>Holder Name</Field.Label>
							<Input {...updateDetail.fields.bankHolderName.as("text")} />
							{#each updateDetail.fields.bankHolderName.issues() as issue (issue)}
								<Field.Error>{issue.message}</Field.Error>
							{/each}
						</Field.Field>
						<Field.Field>
							<Field.Label {...updateDetail.fields.bankBranchCode}>Branch Code</Field.Label>
							<Input {...updateDetail.fields.bankBranchCode.as("text")} />
							{#each updateDetail.fields.bankBranchCode.issues() as issue (issue)}
								<Field.Error>{issue.message}</Field.Error>
							{/each}
						</Field.Field>
						<Field.Field>
							<Field.Label {...updateDetail.fields.bankAccountNumber}>Account Number</Field.Label>
							<Input {...updateDetail.fields.bankAccountNumber.as("text")} />
							{#each updateDetail.fields.bankAccountNumber.issues() as issue (issue)}
								<Field.Error>{issue.message}</Field.Error>
							{/each}
						</Field.Field>
					</Field.Group>
				</Field.Set>
				<Button type="submit" class="w-full">Save</Button>
			</form>
		</Card.Content>
	</Card.Root>
</div>
