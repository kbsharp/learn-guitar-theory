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
	<p class="page-title">Guitar Theory</p>

	<Fretboard />

	<div class="controls">
		<div class="control-group">
			<span class="group-label">Key</span>
			<Keys />
		</div>
		<div class="control-group">
			<span class="group-label">Mode</span>
			<Qualities />
		</div>
	</div>
</div>

<style lang="scss">
	.container {
		margin: auto;
		width: 1250px;
		padding-top: 48px;
	}

	.page-title {
		font-size: 11px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--text-muted);
		margin: 0 0 28px 0;
		font-weight: 500;
	}

	.controls {
		display: flex;
		flex-direction: column;
		gap: 16px;
		margin-top: 40px;
	}

	.control-group {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.group-label {
		font-size: 10px;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--text-muted);
		margin-bottom: 10px;
		font-weight: 600;
	}
</style>
