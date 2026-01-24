<script lang="ts">
	let {
		titleLeft,
		titleRight,
		textStyle,
	}: { titleLeft: string; titleRight: string; textStyle: string } = $props();
</script>

<div class="flex items-center justify-between bg-muted px-6 py-2" style={textStyle}>
	<div class="uppercase">{titleLeft}</div>
	<div class="uppercase">{titleRight}</div>
</div>
