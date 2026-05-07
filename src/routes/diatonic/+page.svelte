<script lang="ts">
	import Fretboard from '$lib/components/Fretboard/Fretboard.svelte';
	import {
		diatonicKeys,
		getDiatonicChords,
		getScaleNotes,
		getDiatonicNoteClass,
		type DiatonicMode
	} from './helpers';
	import { diatonicKey, diatonicMode, selectedDiatonicChord } from '../../stores';

	let chords = $derived(getDiatonicChords($diatonicKey, $diatonicMode as DiatonicMode));
	let scaleNotes = $derived(getScaleNotes($diatonicKey, $diatonicMode as DiatonicMode));
	let getNoteClass = $derived((note: string) =>
		getDiatonicNoteClass(note, $selectedDiatonicChord, scaleNotes));
	const getNoteLabel = (note: string) => note;

	function selectChord(chordName: string) {
		selectedDiatonicChord.set($selectedDiatonicChord === chordName ? null : chordName);
	}

	function switchMode(mode: DiatonicMode) {
		diatonicMode.set(mode);
		selectedDiatonicChord.set(null);
	}
</script>

<svelte:head>
	<title>Diatonic Chords — Fretboard Lab</title>
</svelte:head>

<div class="container">
	<div class="page-header">
		<p class="page-title">Diatonic Chords</p>
		{#if $selectedDiatonicChord}
			<span class="selected-label">{$selectedDiatonicChord}</span>
		{/if}
	</div>

	<Fretboard {getNoteClass} {getNoteLabel} />

	<div class="controls">
		<div class="control-group">
			<span class="group-label">Key</span>
			<div class="btn-row">
				{#each diatonicKeys as k}
					<button
						class="btn-key"
						class:active={$diatonicKey === k}
						onclick={() => { diatonicKey.set(k); selectedDiatonicChord.set(null); }}
					>
						{k}
					</button>
				{/each}
			</div>
		</div>

		<div class="control-group">
			<span class="group-label">Mode</span>
			<div class="btn-row">
				<button
					class="btn-mode"
					class:active={$diatonicMode === 'major'}
					onclick={() => switchMode('major')}
				>
					Major
				</button>
				<button
					class="btn-mode"
					class:active={$diatonicMode === 'minor'}
					onclick={() => switchMode('minor')}
				>
					Minor
				</button>
			</div>
		</div>

		<div class="control-group">
			<span class="group-label">Chords</span>
			<div class="chord-grid">
				{#each chords as chord}
					<button
						class="btn-chord"
						class:active={$selectedDiatonicChord === chord.name}
						onclick={() => selectChord(chord.name)}
					>
						<span class="roman">{chord.roman}</span>
						<span class="chord-name">{chord.name}</span>
					</button>
				{/each}
			</div>
		</div>
	</div>

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

	.selected-label {
		font-size: 14px;
		font-weight: 700;
		color: var(--text-primary);
		letter-spacing: 0.04em;
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

	.btn-row {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px;
	}

	.btn-key {
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

	.btn-mode {
		background: transparent;
		border: 1px solid var(--color-fret);
		color: var(--text-muted);
		border-radius: var(--radius-sm);
		padding: 8px 24px;
		font-family: inherit;
		font-size: 13px;
		font-weight: 600;
		letter-spacing: 0.05em;
		cursor: pointer;
		transition: all 0.2s ease;

		&:hover:not(.active) {
			border-color: var(--text-muted);
			color: var(--text-primary);
		}

		&.active {
			background: rgba(255, 255, 255, 0.06);
			border-color: var(--text-primary);
			color: var(--text-primary);
		}
	}

	.chord-grid {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 8px;
	}

	.btn-chord {
		display: flex;
		flex-direction: column;
		align-items: center;
		background: transparent;
		border: 1px solid var(--accent-tonic);
		color: var(--accent-tonic);
		border-radius: var(--radius-sm);
		padding: 10px 16px;
		font-family: inherit;
		cursor: pointer;
		transition: background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
		min-width: 80px;

		.roman {
			font-size: 15px;
			font-weight: 700;
			letter-spacing: 0.04em;
			line-height: 1;
			margin-bottom: 4px;
		}

		.chord-name {
			font-size: 10px;
			font-weight: 500;
			letter-spacing: 0.04em;
		}

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
		margin-top: 24px;
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
