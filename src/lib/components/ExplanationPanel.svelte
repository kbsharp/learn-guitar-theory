<script lang="ts">
	let { context, body }: { context: string; body: string } = $props();
</script>

<div class="explanation-panel">
	<span class="context">{context}</span>
	<p class="body">{body}</p>
</div>

<style lang="scss">
	.explanation-panel {
		max-width: 640px;
		margin: 36px auto 0;
		padding-left: 16px;
		border-left: 2px solid var(--color-fret);
	}

	.context {
		display: block;
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--accent-tonic);
		margin-bottom: 10px;
	}

	.body {
		margin: 0;
		font-size: 13px;
		line-height: 1.75;
		color: var(--text-primary);
		opacity: 0.8;
	}
</style>
