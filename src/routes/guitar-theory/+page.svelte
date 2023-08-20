<script>
	import Fretboard from './Fretboard/Fretboard.svelte';
	import Keys from './Keys.svelte';
	import Qualities from './Qualities.svelte';
</script>

<svelte:head>
	<title>Guitar Theory</title>
	<meta name="Guitar Theory" content="Guitar theory" />
</svelte:head>

<div class="container">
	<h1>Guitar Theory</h1>

	<Fretboard />
	<Keys />
	<Qualities />
</div>

<style lang="scss">
	.container {
		margin: auto;
		width: 1250px;
	}
</style>
