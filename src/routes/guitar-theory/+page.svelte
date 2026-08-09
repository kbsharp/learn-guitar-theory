<script lang="ts">
	import { onMount } from 'svelte';
	import { Scale } from 'tonal';
	import Fretboard from '$lib/components/Fretboard/Fretboard.svelte';
	import ExplanationPanel from '$lib/components/ExplanationPanel.svelte';
	import HelpTip from '$lib/components/HelpTip.svelte';
	import Keys from './Keys.svelte';
	import Qualities from './Qualities.svelte';
	import { key, quality } from '../../stores';
	import {
		getClassName,
		currentTonic,
		getScaleDegree,
		convertFlatToSharp,
		computeScalePositions,
		type Quality as QualityType
	} from './helpers';
	import { scaleExplanations } from './explanations';
	import { playSequence, audioReady, preloadAudio } from '$lib/audio';

	let showDegrees = $state(false);
	let selectedPosition = $state<number | null>(null);
	let isPlaying = $state(false);

	// Begin downloading samples as soon as the page opens so they're ready
	// by the time the user clicks the Play button.
	onMount(() => {
		void preloadAudio();
	});

	$effect(() => {
		void $key;
		void $quality;
		selectedPosition = null;
	});

	let tonic = $derived(currentTonic($key));
	let positions = $derived(computeScalePositions($key, $quality));
	let positionRange = $derived(
		selectedPosition !== null && positions[selectedPosition - 1]
			? {
					start: positions[selectedPosition - 1].startFret,
					end: positions[selectedPosition - 1].endFret
				}
			: null
	);
	let getNoteClass = $derived((note: string) => getClassName(note, $key, tonic, $quality));
	let getNoteLabel = $derived((note: string) =>
		showDegrees ? getScaleDegree(note, tonic) : convertFlatToSharp(note)
	);
	let explanation = $derived(scaleExplanations[$quality as QualityType]);

	async function handlePlayScale() {
		// Start the scale at octave 3 so most scales sit comfortably in the
		// guitar's range, then append the upper tonic so the scale resolves.
		const scale = Scale.get(`${tonic}3 ${$quality}`);
		if (!scale.notes.length) return;
		const ascending = [...scale.notes, `${tonic}4`];
		isPlaying = true;
		try {
			await playSequence(ascending, 0.28);
			// Re-enable button after the sequence finishes.
			setTimeout(() => (isPlaying = false), ascending.length * 280 + 400);
		} catch {
			isPlaying = false;
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
			<button
				class="play-btn"
				class:playing={isPlaying}
				class:loading={!$audioReady}
				disabled={isPlaying || !$audioReady}
				onclick={handlePlayScale}
				aria-label="Play scale"
			>
				<svg
					width="10"
					height="10"
					viewBox="0 0 10 10"
					fill="currentColor"
					aria-hidden="true"
				>
					<path d="M2 1.5v7l6-3.5z" />
				</svg>
				<span
					>{!$audioReady ? 'Loading audio…' : isPlaying ? 'Playing…' : 'Play scale'}</span
				>
			</button>
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
		scale. Once a shape interests you, hit
		<a class="intro-link" href="/chord-scale">Chord-Scale</a> to see which chords it fits over.
	</p>

	<Fretboard {getNoteClass} {getNoteLabel} {positionRange} />

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

	.play-btn {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		font-family: inherit;
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		background: var(--accent-tonic);
		border: 1px solid var(--accent-tonic);
		color: var(--bg-base);
		border-radius: var(--radius-sm);
		padding: 6px 14px;
		cursor: pointer;
		transition:
			background-color 0.2s ease,
			border-color 0.2s ease,
			box-shadow 0.2s ease,
			opacity 0.2s ease;

		svg {
			flex-shrink: 0;
		}

		&:hover:not(:disabled) {
			box-shadow: 0 0 12px color-mix(in srgb, var(--accent-tonic) 50%, transparent);
		}

		&:disabled,
		&.playing {
			cursor: default;
			opacity: 0.75;
		}
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
