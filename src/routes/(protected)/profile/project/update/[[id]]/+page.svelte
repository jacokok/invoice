<script lang="ts">
	import { Button, Card, Input, Textarea, Field } from "@kayord/ui";
	import { page } from "$app/state";
	import { toast } from "@kayord/ui/sonner";
	import { getProject, upsertProject } from "../../project.remote";

	const id = $derived(page.params?.id ? Number(page.params?.id) : undefined);
	const data = $derived(await getProject(id));

	$effect(() => {
		if (data?.item) {
			upsertProject.fields.set({
				id: data.item.id,
				name: data.item.name,
				billName: data.item.billName,
				billAddress: data.item.billAddress,
				rate: data.item.rate,
				primaryColorDark: data.item.primaryColorDark,
				primaryColorLight: data.item.primaryColorLight,
			});
		}
	});
</script>

<div class="m-4 flex flex-col gap-2">
	<Card.Root>
		<Card.Header>
			<Card.Title>Project</Card.Title>
			<Card.Description>Project Details</Card.Description>
		</Card.Header>
		<Card.Content>
			<form
				class="flex flex-col gap-3"
				{...upsertProject.enhance(async ({ submit }) => {
					try {
						await submit();
					} catch {
						toast.error("Error saving project");
					}
				})}
			>
				<input type="hidden" name="n:id" value={upsertProject.fields.id.value() ?? ""} />
				<Field.Set>
					<Field.Group>
						<Field.Field>
							<Field.Label {...upsertProject.fields.name}>Name</Field.Label>
							<Input {...upsertProject.fields.name.as("text")} />
							{#each upsertProject.fields.name.issues() as issue (issue)}
								<Field.Error>{issue.message}</Field.Error>
							{/each}
						</Field.Field>
						<Field.Field>
							<Field.Label {...upsertProject.fields.billName}>Bill Name</Field.Label>
							<Input {...upsertProject.fields.billName.as("text")} />
							{#each upsertProject.fields.billName.issues() as issue (issue)}
								<Field.Error>{issue.message}</Field.Error>
							{/each}
						</Field.Field>
						<Field.Field>
							<Field.Label {...upsertProject.fields.billAddress}>Bill Address</Field.Label>
							<Textarea {...upsertProject.fields.billAddress.as("text")} />
							{#each upsertProject.fields.billAddress.issues() as issue (issue)}
								<Field.Error>{issue.message}</Field.Error>
							{/each}
						</Field.Field>
						<Field.Field>
							<Field.Label {...upsertProject.fields.rate}>Rate</Field.Label>
							<Input {...upsertProject.fields.rate.as("number")} step="0.01" />
							<p class="text-sm text-muted-foreground">Rand per hour</p>
							{#each upsertProject.fields.rate.issues() as issue (issue)}
								<Field.Error>{issue.message}</Field.Error>
							{/each}
						</Field.Field>
						<Field.Field>
							<Field.Label {...upsertProject.fields.primaryColorDark}
								>Primary Color (dark theme)</Field.Label
							>

							<Input {...upsertProject.fields.primaryColorDark.as("color")} />
							{#each upsertProject.fields.primaryColorDark.issues() as issue (issue)}
								<Field.Error>{issue.message}</Field.Error>
							{/each}
						</Field.Field>
						<Field.Field>
							<Field.Label {...upsertProject.fields.primaryColorLight}
								>Primary Color (light theme)</Field.Label
							>
							<Input {...upsertProject.fields.primaryColorLight.as("color")} />
							{#each upsertProject.fields.primaryColorLight.issues() as issue (issue)}
								<Field.Error>{issue.message}</Field.Error>
							{/each}
						</Field.Field>
					</Field.Group>
				</Field.Set>
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
