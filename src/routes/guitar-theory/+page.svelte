<script>
	import Fretboard from './Fretboard.svelte';
	import Keys from './Keys.svelte';
</script>

<svelte:head>
	<title>Guitar Theory</title>
	<meta name="Guitar Theory" content="Guitar theory" />
</svelte:head>

<div class="container">
	<h1>Guitar Theory</h1>

	<Fretboard />
	<Keys />
</div>

<style lang="scss">
	.container {
		margin: auto;
		width: 1250px;
	}
</style>
