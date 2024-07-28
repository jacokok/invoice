<script lang="ts">
	import { Button, Card, toast } from "@kayord/ui";

	import type { PageData } from "./$types";
	import { isError } from "$lib/types";

	let { data }: { data: PageData } = $props();

	const downloadPDF = async () => {
		try {
			const params = { userId: 123, date: 123 };

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

	// const downloadPDF = () => {
	// 	fetch("/api/pdf", {
	// 		data: {
	// 			userId: 123,
	// 			date: 123,
	// 		},
	// 		method: "POST",
	// 	}).then((res) => {
	// 		return res
	// 			.arrayBuffer()
	// 			.then((res) => {
	// 				const blob = new Blob([res], { type: "application/pdf" });
	// 				saveAs(blob, "invoice.pdf");
	// 			})
	// 			.catch((e) => alert(e));
	// 	});
	// };
</script>

<div class="m-4 flex items-center gap-2">
	<Button href="/kv">KV</Button>
	<Button href="/time">Time</Button>
	<Button onclick={downloadPDF}>PDF</Button>
</div>
