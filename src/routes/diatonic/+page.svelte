<script lang="ts">
	import Fretboard from '$lib/components/Fretboard/Fretboard.svelte';
	import ExplanationPanel from '$lib/components/ExplanationPanel.svelte';
	import HelpTip from '$lib/components/HelpTip.svelte';
	import {
		diatonicKeys,
		getDiatonicChords,
		getScaleNotes,
		getDiatonicNoteClass,
		type DiatonicMode
	} from './helpers';
	import { diatonicExplanations } from './explanations';
	import { diatonicKey, diatonicMode, selectedDiatonicChord } from '../../stores';

	let chords = $derived(getDiatonicChords($diatonicKey, $diatonicMode as DiatonicMode));
	let scaleNotes = $derived(getScaleNotes($diatonicKey, $diatonicMode as DiatonicMode));
	let getNoteClass = $derived((note: string) =>
		getDiatonicNoteClass(note, $selectedDiatonicChord, scaleNotes)
	);
	const getNoteLabel = (note: string) => note;

	let selectedIndex = $derived(
		$selectedDiatonicChord ? chords.findIndex((c) => c.name === $selectedDiatonicChord) : -1
	);
	let explanation = $derived(diatonicExplanations[selectedIndex] ?? diatonicExplanations[-1]);

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

	<p class="page-intro">
		Every key has 7 chords that "belong" to it — the same pattern of majors, minors, and one
		diminished in every key. Click each in turn to feel which ones resolve home (I) and which
		demand movement (V). Then chain them into a four-chord song on the
		<a class="intro-link" href="/progressions">Progressions page</a>.
	</p>

	<Fretboard {getNoteClass} {getNoteLabel} />

	<div class="controls">
		<div class="control-group">
			<span class="group-label">Key</span>
			<div class="btn-row">
				{#each diatonicKeys as k}
					<button
						class="btn-key"
						class:active={$diatonicKey === k}
						onclick={() => {
							diatonicKey.set(k);
							selectedDiatonicChord.set(null);
						}}
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
			<div class="label-with-help">
				<span class="group-label">Chords</span>
				<HelpTip
					term="Diatonic chords"
					definition="Chords built only from notes in the key's scale. The quality of each chord (major, minor, diminished) is determined by the scale's interval pattern — it's the same in every key. Once you know the pattern, you know which chords 'belong' together in any key."
				/>
			</div>
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

	<ExplanationPanel
		context={explanation.context}
		body={explanation.body}
		next={explanation.next}
		practice={explanation.practice}
	/>

	<div class="legend">
		<div class="legend-item">
			<span class="legend-dot chord-tone"></span>
			<span>Chord tone</span>
			<HelpTip
				term="Chord tone"
				definition="A note belonging to the selected chord. These are the notes that define the chord's sound — anchor your phrases here and you'll always sound intentional."
			/>
		</div>
		<div class="legend-item">
			<span class="legend-dot scale-tone"></span>
			<span>Scale tone</span>
			<HelpTip
				term="Scale tone"
				definition="A note from the key's scale that isn't part of the selected chord. Use these to connect between chord tones — they work best as passing notes rather than resting points."
			/>
		</div>
	</div>
</div>

<style lang="scss">
	.container {
		max-width: 1250px;
		width: 100%;
		margin: 0 auto;
		padding-top: 48px;
		padding-bottom: 80px;

		@media (max-width: 1300px) {
			padding-left: 32px;
			padding-right: 32px;
			box-sizing: border-box;
		}

		@media (max-width: 768px) {
			padding: 24px 16px 48px;
		}
	}

	.page-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 40px;
		margin-bottom: 20px;
	}

	.page-intro {
		font-size: 12px;
		line-height: 1.7;
		color: var(--text-muted);
		margin: 0 0 28px;
	}

	.label-with-help {
		display: flex;
		align-items: center;
		margin-bottom: 14px;

		.group-label {
			margin-bottom: 0;
		}
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
		transition:
			background-color 0.2s ease,
			color 0.2s ease,
			box-shadow 0.2s ease;

		&:hover:not(.active) {
			background: color-mix(in srgb, var(--accent-note) 10%, transparent);
		}

		&.active {
			background: var(--accent-note);
			color: var(--bg-base);
			box-shadow: 0 0 12px 2px color-mix(in srgb, var(--accent-note) 30%, transparent);
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
			background: color-mix(in srgb, var(--text-primary) 6%, transparent);
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
		transition:
			background-color 0.2s ease,
			color 0.2s ease,
			box-shadow 0.2s ease;
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
			background: color-mix(in srgb, var(--accent-tonic) 10%, transparent);
		}

		&.active {
			background: var(--accent-tonic);
			color: var(--bg-base);
			box-shadow: 0 0 12px 2px color-mix(in srgb, var(--accent-tonic) 30%, transparent);
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

		:global(.help-tip) {
			margin-left: -2px;
		}
	}

	.legend-dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;

		&.chord-tone {
			background: var(--accent-tonic);
			box-shadow: 0 0 6px color-mix(in srgb, var(--accent-tonic) 50%, transparent);
		}

		&.scale-tone {
			background: var(--accent-note);
			box-shadow: 0 0 6px color-mix(in srgb, var(--accent-note) 40%, transparent);
		}
	}
</style>
