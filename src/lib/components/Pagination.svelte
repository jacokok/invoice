<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { Pagination } from "@kayord/ui";
	import ChevronLeft from "lucide-svelte/icons/chevron-left";
	import ChevronRight from "lucide-svelte/icons/chevron-right";

	interface Props {
		count: number;
		perPage?: number;
		siblingCount?: number;
	}

	let { count, perPage, siblingCount }: Props = $props();

	const setPage = (p: number) => {
		const newUrl = new URL($page.url);
		newUrl?.searchParams?.set("page", String(p));
		goto(newUrl);
	};
</script>

{#if count > 0}
	<Pagination.Root
		{count}
		{perPage}
		{siblingCount}
		onPageChange={(p) => {
			setPage(p);
		}}
	>
		{#snippet children({ pages, currentPage })}
			<Pagination.Content>
				<Pagination.Item>
					<Pagination.PrevButton>
						<ChevronLeft class="h-4 w-4" />
						<span class="hidden sm:block">Previous</span>
					</Pagination.PrevButton>
				</Pagination.Item>
				{#each pages as page (page.key)}
					{#if page.type === "ellipsis"}
						<Pagination.Item>
							<Pagination.Ellipsis />
						</Pagination.Item>
					{:else}
						<Pagination.Item>
							<Pagination.Link {page} isActive={currentPage === page.value}>
								{page.value}
							</Pagination.Link>
						</Pagination.Item>
					{/if}
				{/each}
				<Pagination.Item>
					<Pagination.NextButton>
						<span class="hidden sm:block">Next</span>
						<ChevronRight class="h-4 w-4" />
					</Pagination.NextButton>
				</Pagination.Item>
			</Pagination.Content>
		{/snippet}
	</Pagination.Root>
{/if}
