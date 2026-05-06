<script lang="ts">
	import Fretboard from '$lib/components/Fretboard/Fretboard.svelte';
	import Keys from './Keys.svelte';
	import Qualities from './Qualities.svelte';
	import { key, quality } from '../../stores';
	import { getClassName, currentTonic, getScaleDegree, convertFlatToSharp } from './helpers';

	let showDegrees = $state(false);

	let tonic = $derived(currentTonic($key));
	let getNoteClass = $derived((note: string) => getClassName(note, $key, tonic, $quality));
	let getNoteLabel = $derived((note: string) =>
		showDegrees ? getScaleDegree(note, tonic) : convertFlatToSharp(note));
</script>

<svelte:head>
	<title>Fretboard Explorer — Fretboard Lab</title>
</svelte:head>

<div class="container">
	<div class="page-header">
		<p class="page-title">Fretboard Explorer</p>
		<button
			class="toggle-btn"
			class:active={showDegrees}
			onclick={() => (showDegrees = !showDegrees)}
		>
			{showDegrees ? 'Degrees' : 'Notes'}
		</button>
	</div>

	<Fretboard {getNoteClass} {getNoteLabel} />

	<div class="controls">
		<div class="control-group">
			<span class="group-label">Key</span>
			<Keys />
		</div>
		<div class="control-group">
			<span class="group-label">Scale</span>
			<Qualities />
		</div>
	</div>
</div>

<style lang="scss">
	.container {
		margin: auto;
		width: 1250px;
		padding-top: 48px;
		padding-bottom: 64px;
	}

	.page-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 28px;
	}

	.page-title {
		font-size: 11px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--text-muted);
		margin: 0;
		font-weight: 500;
	}

	.toggle-btn {
		font-family: inherit;
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		background: transparent;
		border: 1px solid var(--color-fret);
		color: var(--text-muted);
		border-radius: var(--radius-sm);
		padding: 6px 14px;
		cursor: pointer;
		transition: all 0.2s ease;

		&:hover {
			border-color: var(--accent-note);
			color: var(--accent-note);
		}

		&.active {
			background: rgba(12, 207, 223, 0.1);
			border-color: var(--accent-note);
			color: var(--accent-note);
		}
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
