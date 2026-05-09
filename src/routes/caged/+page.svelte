<script lang="ts">
	import Fretboard from '$lib/components/Fretboard/Fretboard.svelte';
	import ExplanationPanel from '$lib/components/ExplanationPanel.svelte';
	import HelpTip from '$lib/components/HelpTip.svelte';
	import {
		cagedRoots,
		computeCAGEDShapes,
		getChordTones,
		getCAGEDNoteClass,
		type CAGEDQuality
	} from './helpers';
	import { cagedExplanations } from './explanations';
	import { cagedKey, cagedQuality } from '../../stores';

	let selectedShape = $state<string | null>(null);

	$effect(() => {
		$cagedKey;
		$cagedQuality;
		selectedShape = null;
	});

	let shapes = $derived(computeCAGEDShapes($cagedKey));
	let chordTones = $derived(getChordTones($cagedKey, $cagedQuality as CAGEDQuality));
	let positionRange = $derived(
		selectedShape !== null
			? (() => {
					const s = shapes.find((sh) => sh.name === selectedShape);
					return s ? { start: s.fret, end: s.fret + 4 } : null;
				})()
			: null
	);
	let getNoteClass = $derived((note: string) =>
		getCAGEDNoteClass(note, $cagedKey, chordTones));
	const getNoteLabel = (note: string) => note;

	let chordName = $derived(`${$cagedKey}${$cagedQuality === 'minor' ? 'm' : ''}`);
	let explanation = $derived(
		cagedExplanations[selectedShape?.toLowerCase() ?? 'all'] ?? cagedExplanations['all']
	);
</script>

<svelte:head>
	<title>CAGED System — Fretboard Lab</title>
</svelte:head>

<div class="container">
	<div class="page-header">
		<p class="page-title">CAGED System</p>
		<div class="chord-summary">
			<span class="chord-name">{chordName}</span>
			{#if selectedShape}
				<span class="shape-badge">{selectedShape} shape</span>
			{/if}
		</div>
	</div>

	<p class="page-intro">
		Every major or minor chord can be played in 5 positions across the neck, each based on a
		familiar open chord shape. The shapes connect end-to-end with no gaps — learning them means
		you always have chord tones nearby, no matter where you are on the fretboard.
	</p>

	<Fretboard {getNoteClass} {getNoteLabel} {positionRange} />

	<div class="controls">
		<div class="control-group">
			<span class="group-label">Root</span>
			<div class="btn-row">
				{#each cagedRoots as root}
					<button
						class="btn-root"
						class:active={$cagedKey === root}
						onclick={() => cagedKey.set(root)}
					>
						{root}
					</button>
				{/each}
			</div>
		</div>

		<div class="control-group">
			<span class="group-label">Quality</span>
			<div class="btn-row">
				<button
					class="btn-quality"
					class:active={$cagedQuality === 'major'}
					onclick={() => cagedQuality.set('major')}
				>
					Major
				</button>
				<button
					class="btn-quality"
					class:active={$cagedQuality === 'minor'}
					onclick={() => cagedQuality.set('minor')}
				>
					Minor
				</button>
			</div>
		</div>

		<div class="control-group">
			<div class="label-with-help">
				<span class="group-label">Shape</span>
				<HelpTip
					term="CAGED shapes"
					definition="Each shape is named after an open chord (C, A, G, E, D) whose fingering it resembles when moved up the neck. Five shapes cover the entire fretboard — there are no gaps between them. Select one to focus on that position and see the highlighted fret range."
				/>
			</div>
			<div class="btn-row">
				<button
					class="btn-shape all"
					class:active={selectedShape === null}
					onclick={() => (selectedShape = null)}
				>
					All
				</button>
				{#each shapes as shape}
					<button
						class="btn-shape"
						class:active={selectedShape === shape.name}
						onclick={() => (selectedShape = shape.name)}
					>
						<span class="shape-letter">{shape.name}</span>
						<span class="shape-fret">fr {shape.fret === 0 ? 'open' : shape.fret}</span>
					</button>
				{/each}
			</div>
		</div>
	</div>

	<ExplanationPanel context={explanation.context} body={explanation.body} />

	<div class="legend">
		<div class="legend-item">
			<span class="legend-dot root"></span>
			<span>Root</span>
			<HelpTip
				term="Root note"
				definition="The note the chord is named after and built from. In the CAGED system, locating the root within each shape is key — once you know where the root sits, you can move any shape to any key instantly."
			/>
		</div>
		<div class="legend-item">
			<span class="legend-dot chord-tone"></span>
			<span>Chord tone</span>
			<HelpTip
				term="Chord tone"
				definition="The 3rd and 5th of the chord. Together with the root they define the chord's sound. When soloing, targeting these notes — especially the 3rd — is what makes a line sound like it belongs over the chord rather than just being scale notes."
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
		opacity: 0.75;
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

	.chord-summary {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.chord-name {
		font-size: 14px;
		font-weight: 700;
		color: var(--text-primary);
		letter-spacing: 0.04em;
	}

	.shape-badge {
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--accent-note);
		background: color-mix(in srgb, var(--accent-note) 10%, transparent);
		border: 1px solid color-mix(in srgb, var(--accent-note) 30%, transparent);
		border-radius: var(--radius-sm);
		padding: 3px 10px;
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
			background: color-mix(in srgb, var(--accent-note) 10%, transparent);
		}

		&.active {
			background: var(--accent-note);
			color: var(--bg-base);
			box-shadow: 0 0 12px 2px color-mix(in srgb, var(--accent-note) 30%, transparent);
		}
	}

	.btn-quality {
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

	.btn-shape {
		display: flex;
		flex-direction: column;
		align-items: center;
		background: transparent;
		border: 1px solid var(--accent-tonic);
		color: var(--accent-tonic);
		border-radius: var(--radius-sm);
		padding: 10px 20px;
		font-family: inherit;
		cursor: pointer;
		transition: background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
		min-width: 80px;

		&.all {
			border-color: var(--color-fret);
			color: var(--text-muted);
			font-size: 13px;
			font-weight: 600;
			letter-spacing: 0.05em;

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

		.shape-letter {
			font-size: 18px;
			font-weight: 700;
			letter-spacing: 0.02em;
			line-height: 1;
			margin-bottom: 4px;
		}

		.shape-fret {
			font-size: 10px;
			font-weight: 500;
			letter-spacing: 0.06em;
		}

		&:hover:not(.active):not(.all) {
			background: color-mix(in srgb, var(--accent-tonic) 10%, transparent);
		}

		&.active:not(.all) {
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

		&.root {
			background: var(--accent-tonic);
			box-shadow: 0 0 6px color-mix(in srgb, var(--accent-tonic) 50%, transparent);
		}

		&.chord-tone {
			background: var(--accent-note);
			box-shadow: 0 0 6px color-mix(in srgb, var(--accent-note) 40%, transparent);
		}
	}
</style>
