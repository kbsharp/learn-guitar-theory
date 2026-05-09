<script lang="ts">
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

	let showDegrees = $state(false);
	let selectedPosition = $state<number | null>(null);

	$effect(() => {
		$key;
		$quality;
		selectedPosition = null;
	});

	let tonic = $derived(currentTonic($key));
	let positions = $derived(computeScalePositions($key, $quality));
	let positionRange = $derived(
		selectedPosition !== null && positions[selectedPosition - 1]
			? { start: positions[selectedPosition - 1].startFret, end: positions[selectedPosition - 1].endFret }
			: null
	);
	let getNoteClass = $derived((note: string) => getClassName(note, $key, tonic, $quality));
	let getNoteLabel = $derived((note: string) =>
		showDegrees ? getScaleDegree(note, tonic) : convertFlatToSharp(note));
	let explanation = $derived(scaleExplanations[$quality as QualityType]);
</script>

<svelte:head>
	<title>Fretboard Explorer — Fretboard Lab</title>
</svelte:head>

<div class="container">
	<div class="page-header">
		<p class="page-title">Fretboard Explorer</p>
		<div class="header-right">
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
		Select a key and scale to see every available note across the neck. Use the position buttons to
		focus on a 4-fret box — the way you'd actually practise. <strong>Pink</strong> is the root,
		<strong>cyan</strong> notes are in the scale.
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
		<ExplanationPanel context={explanation.context} body={explanation.body} />
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
	}

	.page-intro {
		font-size: 12px;
		line-height: 1.7;
		color: var(--text-muted);
		margin: 0 0 28px;
		opacity: 0.75;

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
			background: rgba(12, 207, 223, 0.1);
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
			background: rgba(12, 207, 223, 0.12);
			border-color: var(--accent-note);
			color: var(--accent-note);
			box-shadow: 0 0 8px 1px rgba(12, 207, 223, 0.2);
		}
	}
</style>
