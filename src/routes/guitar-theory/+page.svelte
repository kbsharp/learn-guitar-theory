<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import Fretboard from '$lib/components/Fretboard/Fretboard.svelte';
	import ExplanationPanel from '$lib/components/ExplanationPanel.svelte';
	import HelpTip from '$lib/components/HelpTip.svelte';
	import PlayButton from '$lib/components/PlayButton.svelte';
	import ABComparison from '$lib/components/ABComparison.svelte';
	import Keys from './Keys.svelte';
	import Qualities from './Qualities.svelte';
	import { key, quality } from '../../stores';
	import {
		getClassName,
		currentTonic,
		getScaleDegree,
		convertFlatToSharp,
		computeScalePositions,
		computeScaleRun,
		noteAtSemitones,
		qualityLabels,
		type Quality as QualityType,
		type ScaleRunNote
	} from './helpers';
	import { scaleExplanations } from './explanations';
	import { scaleComparisons } from './comparisons';
	import { playSequence, stopPlayback, audioReady, preloadAudio } from '$lib/audio';

	// Seconds between notes in a scale run. Slow enough to hear each interval
	// against the last, fast enough that two octaves up and down isn't a chore.
	const RUN_GAP_SEC = 0.26;

	let showDegrees = $state(false);
	let selectedPosition = $state<number | null>(null);
	let isPlaying = $state(false);
	let playingStep = $state<number | null>(null);
	// 0 = the scale the user picked, 1 = the reference it's compared against.
	let comparedVariant = $state(0);
	let comparisonNotes = $state<ScaleRunNote[]>([]);

	// Begin downloading samples as soon as the page opens so they're ready
	// by the time the user clicks the Play button.
	onMount(() => {
		void preloadAudio();
	});

	onDestroy(stopPlayback);

	$effect(() => {
		void $key;
		void $quality;
		selectedPosition = null;
	});

	// A new scale means a new comparison pair — drop back to showing the
	// scale the user actually picked.
	$effect(() => {
		void $key;
		void $quality;
		comparedVariant = 0;
	});

	// Any change to what's on the board invalidates a run in progress — the
	// notes it was walking through are no longer the ones on screen.
	// Deliberately not watching `comparedVariant`: flipping A/B starts its own
	// playback, and that supersession already resets this button via onCancel.
	// Stopping here too would race with — and kill — the run just started.
	$effect(() => {
		void $key;
		void $quality;
		void selectedPosition;
		stopRun();
	});

	let tonic = $derived(currentTonic($key));
	let comparison = $derived(scaleComparisons[$quality as QualityType]);
	// Selecting variant B shows the reference scale on the board. The fret
	// window stays anchored to the user's own scale (below), so switching
	// moves the characteristic note by a fret instead of moving the whole box
	// out from under them — seeing that one dot shift is the lesson.
	let shownQuality = $derived(
		comparedVariant === 1 && comparison ? comparison.against : ($quality as QualityType)
	);
	// The colour note of whichever scale is showing — for B that's the note A's
	// characteristic moved away from, so the ring visibly shifts a fret rather
	// than disappearing. Blues is the exception: its ♭5 has no counterpart in
	// minor pentatonic, so on B the ring simply isn't there, which is the point.
	let shownDegree = $derived(
		comparedVariant === 1 && comparison
			? (comparison.referenceDegree ?? comparison.degree)
			: comparison?.degree
	);
	let characteristicNote = $derived(
		!comparison
			? null
			: noteAtSemitones(
					tonic,
					comparedVariant === 1
						? (comparison.reference ?? comparison.characteristic)
						: comparison.characteristic
				)
	);

	let positions = $derived(computeScalePositions($key, $quality));
	let positionRange = $derived(
		selectedPosition !== null && positions[selectedPosition - 1]
			? {
					start: positions[selectedPosition - 1].startFret,
					end: positions[selectedPosition - 1].endFret
				}
			: null
	);
	let getNoteClass = $derived((note: string) => {
		const base = getClassName(note, $key, tonic, shownQuality);
		if (base === 'hide-note' || note !== characteristicNote) return base;
		return `${base} characteristic`;
	});
	let getNoteLabel = $derived((note: string) =>
		showDegrees ? getScaleDegree(note, tonic) : convertFlatToSharp(note)
	);
	let explanation = $derived(scaleExplanations[$quality as QualityType]);

	// The run walks the selected box (or position 1 when showing the whole
	// neck) up and back down — the way you'd actually practise it.
	let ascendingRun = $derived(computeScaleRun($key, shownQuality, positionRange));
	let runSteps = $derived(
		ascendingRun.length ? [...ascendingRun, ...ascendingRun.slice(0, -1).reverse()] : []
	);
	// Both variants walk the same window, so they come out the same phrase
	// with one note a fret apart — the only variable left is the colour note.
	let variantA = $derived({
		label: qualityLabels[$quality as QualityType],
		notes: computeScaleRun($key, $quality as QualityType, positionRange)
	});
	let variantB = $derived({
		label: comparison ? qualityLabels[comparison.against] : '',
		notes: comparison ? computeScaleRun($key, comparison.against, positionRange) : []
	});
	// One note at a time on a run — the fretboard takes a list either way.
	// Only one player can be sounding, so whichever has notes is the live one.
	let runNotes = $derived(
		playingStep === null ? [] : runSteps.slice(playingStep, playingStep + 1)
	);
	let playingNotes = $derived(comparisonNotes.length ? comparisonNotes : runNotes);

	function resetRun() {
		isPlaying = false;
		playingStep = null;
	}

	function stopRun() {
		stopPlayback();
		resetRun();
	}

	async function handlePlayScale() {
		if (isPlaying) {
			stopRun();
			return;
		}
		if (!runSteps.length) return;
		isPlaying = true;
		playingStep = null;
		try {
			await playSequence(
				runSteps.map((step) => step.pitch),
				{
					gapSec: RUN_GAP_SEC,
					onStep: (i) => (playingStep = i),
					onEnd: resetRun,
					// The A/B player took the audio — reset without calling
					// stopPlayback(), which would cancel the run that took it.
					onCancel: resetRun
				}
			);
		} catch {
			stopRun();
		}
	}
</script>

<svelte:head>
	<title>Fretboard Explorer — Fretboard Lab</title>
</svelte:head>

<div class="container">
	<div class="page-header">
		<p class="page-title">Fretboard Explorer</p>
		<div class="header-right">
			<PlayButton
				label="Play scale"
				playing={isPlaying}
				loading={!$audioReady}
				onclick={handlePlayScale}
			/>
			<button
				class="toggle-btn"
				class:active={showDegrees}
				onclick={() => (showDegrees = !showDegrees)}
			>
				{showDegrees ? 'Degrees' : 'Notes'}
			</button>
			<HelpTip
				term="Scale degrees"
				definition="Interval numbers relative to the root: 1 (root), b3, 3, b7, 7, etc. Seeing degrees instead of note names shows you why a scale has its character — the b7 is what makes Mixolydian bluesy, the ♯4 is what makes Lydian float. Useful for applying the scale in any key."
			/>
		</div>
	</div>

	<p class="page-intro">
		Every scale is a pattern of intervals — see them all at once, or narrow to one 4-fret box
		you can actually play. <strong>Pink</strong> is the root, <strong>cyan</strong> is in the
		scale, and the <strong>amber ring</strong> is the one note this scale's whole character
		hangs on. Hit <strong>Play scale</strong> to hear the box run root-to-root and back, then
		use <strong>A/B</strong> below to hear that one note move — same phrase, same box, one fret
		of difference. Once a shape interests you, hit
		<a class="intro-link" href="/chord-scale">Chord-Scale</a> to see which chords it fits over.
	</p>

	<Fretboard {getNoteClass} {getNoteLabel} {positionRange} {playingNotes} />

	{#if comparison}
		<ABComparison
			a={variantA}
			b={variantB}
			degree={shownDegree ?? comparison.degree}
			listenFor={comparison.listenFor}
			gapSec={RUN_GAP_SEC}
			bind:selected={comparedVariant}
			bind:playingNotes={comparisonNotes}
		/>
	{/if}

	<div class="controls">
		<div class="control-group">
			<span class="group-label">Key</span>
			<Keys />
		</div>
		<div class="control-group">
			<span class="group-label">Scale</span>
			<Qualities />
		</div>
		<div class="control-group">
			<div class="label-with-help">
				<span class="group-label">Position</span>
				<HelpTip
					term="Positions"
					definition="A 4-fret window that shows one manageable chunk of the scale. Every scale has 5 positions that together cover the whole neck without gaps. Practise each one until you can move between them without thinking — that's when the neck stops feeling like separate boxes."
				/>
			</div>
			<div class="btn-row">
				<button
					class="btn-position"
					class:active={selectedPosition === null}
					onclick={() => (selectedPosition = null)}
				>
					All
				</button>
				{#each positions as pos}
					<button
						class="btn-position"
						class:active={selectedPosition === pos.number}
						onclick={() => (selectedPosition = pos.number)}
					>
						{pos.number}
					</button>
				{/each}
			</div>
		</div>
	</div>

	{#if explanation}
		<ExplanationPanel
			context={explanation.context}
			body={explanation.body}
			next={explanation.next}
			practice={explanation.practice}
		/>
	{/if}
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

	.page-title {
		font-size: 11px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--text-muted);
		margin: 0;
		font-weight: 500;
	}

	.header-right {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.page-intro {
		font-size: 12px;
		line-height: 1.7;
		color: var(--text-muted);
		margin: 0 0 28px;

		strong {
			color: var(--text-primary);
			font-weight: 600;
		}
	}

	.label-with-help {
		display: flex;
		align-items: center;
		margin-bottom: 14px;

		.group-label {
			margin-bottom: 0;
		}
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
			background: color-mix(in srgb, var(--accent-note) 10%, transparent);
			border-color: var(--accent-note);
			color: var(--accent-note);
		}
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

	.btn-position {
		background: transparent;
		border: 1px solid var(--color-fret);
		color: var(--text-muted);
		border-radius: var(--radius-sm);
		padding: 6px 16px;
		font-family: inherit;
		font-size: 13px;
		font-weight: 600;
		letter-spacing: 0.06em;
		cursor: pointer;
		transition: all 0.2s ease;

		&:hover:not(.active) {
			border-color: var(--accent-note);
			color: var(--accent-note);
		}

		&.active {
			background: var(--accent-note);
			border-color: var(--accent-note);
			color: var(--bg-base);
			box-shadow: 0 0 8px 1px color-mix(in srgb, var(--accent-note) 40%, transparent);
		}
	}
</style>
