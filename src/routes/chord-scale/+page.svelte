<script lang="ts">
	import Fretboard from '$lib/components/Fretboard/Fretboard.svelte';
	import ExplanationPanel from '$lib/components/ExplanationPanel.svelte';
	import {
		chordRoots,
		chordTypes,
		chordTypeLabels,
		getChordScaleClass,
		getChordName,
		getRecommendedScaleName,
		type ChordType
	} from './helpers';
	import { explanations } from './explanations';
	import { chordRoot, chordQuality } from '../../stores';

	let getNoteClass = $derived((note: string) =>
		getChordScaleClass(note, $chordRoot, $chordQuality as ChordType));
	const getNoteLabel = (note: string) => note;
	let chordName = $derived(getChordName($chordRoot, $chordQuality as ChordType));
	let scaleName = $derived(getRecommendedScaleName($chordQuality as ChordType));
	let explanation = $derived(explanations[$chordQuality as ChordType]);
</script>

<svelte:head>
	<title>Chord-Scale — Fretboard Lab</title>
</svelte:head>

<div class="container">
	<div class="page-header">
		<p class="page-title">Chord-Scale</p>
		<div class="chord-summary">
			<span class="chord-name">{chordName}</span>
			<span class="scale-label">→ {scaleName}</span>
		</div>
	</div>

	<Fretboard {getNoteClass} {getNoteLabel} />

	<div class="controls">
		<div class="control-group">
			<span class="group-label">Root</span>
			<div class="btn-row">
				{#each chordRoots as root}
					<button
						class="btn-root"
						class:active={$chordRoot === root}
						onclick={() => chordRoot.set(root)}
					>
						{root}
					</button>
				{/each}
			</div>
		</div>

		<div class="control-group">
			<span class="group-label">Chord</span>
			<div class="btn-row">
				{#each chordTypes as ct}
					<button
						class="btn-chord"
						class:active={$chordQuality === ct}
						onclick={() => chordQuality.set(ct)}
					>
						{chordTypeLabels[ct]}
					</button>
				{/each}
			</div>
		</div>
	</div>

	<ExplanationPanel context={explanation.context} body={explanation.body} />

	<div class="legend">
		<div class="legend-item">
			<span class="legend-dot chord-tone"></span>
			<span>Chord tone</span>
		</div>
		<div class="legend-item">
			<span class="legend-dot scale-tone"></span>
			<span>Scale tone</span>
		</div>
	</div>
</div>

<style lang="scss">
	.container {
		margin: auto;
		width: 1250px;
		padding-top: 48px;
		padding-bottom: 80px;
	}

	.page-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 40px;
		margin-bottom: 32px;
	}

	.page-title {
		font-size: 11px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--text-muted);
		margin: 0;
		font-weight: 500;
	}

	.chord-summary {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.chord-name {
		font-size: 14px;
		font-weight: 700;
		color: var(--text-primary);
		letter-spacing: 0.04em;
	}

	.scale-label {
		font-size: 12px;
		color: var(--text-muted);
		letter-spacing: 0.06em;
	}

	.controls {
		display: flex;
		flex-direction: column;
		gap: 28px;
		margin-top: 52px;
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
		margin-bottom: 14px;
		font-weight: 600;
	}

	.btn-row {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px;
	}

	.btn-root {
		background: transparent;
		border: 1px solid var(--accent-note);
		color: var(--accent-note);
		border-radius: var(--radius-sm);
		padding: 8px 18px;
		font-family: inherit;
		font-size: 13px;
		font-weight: 600;
		letter-spacing: 0.05em;
		cursor: pointer;
		transition: background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;

		&:hover:not(.active) {
			background: rgba(12, 207, 223, 0.1);
		}

		&.active {
			background: var(--accent-note);
			color: var(--bg-base);
			box-shadow: 0 0 12px 2px rgba(12, 207, 223, 0.3);
		}
	}

	.btn-chord {
		background: transparent;
		border: 1px solid var(--accent-tonic);
		color: var(--accent-tonic);
		border-radius: var(--radius-sm);
		padding: 8px 18px;
		font-family: inherit;
		font-size: 13px;
		font-weight: 600;
		letter-spacing: 0.05em;
		cursor: pointer;
		transition: background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;

		&:hover:not(.active) {
			background: rgba(240, 56, 96, 0.1);
		}

		&.active {
			background: var(--accent-tonic);
			color: var(--bg-base);
			box-shadow: 0 0 12px 2px rgba(240, 56, 96, 0.3);
		}
	}

	.legend {
		display: flex;
		justify-content: center;
		gap: 24px;
		margin-top: 36px;
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 11px;
		color: var(--text-muted);
		letter-spacing: 0.06em;
	}

	.legend-dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;

		&.chord-tone {
			background: var(--accent-tonic);
			box-shadow: 0 0 6px rgba(240, 56, 96, 0.5);
		}

		&.scale-tone {
			background: var(--accent-note);
			box-shadow: 0 0 6px rgba(12, 207, 223, 0.4);
		}
	}
</style>
