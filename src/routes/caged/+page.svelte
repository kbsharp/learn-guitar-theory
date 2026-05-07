<script lang="ts">
	import Fretboard from '$lib/components/Fretboard/Fretboard.svelte';
	import {
		cagedRoots,
		computeCAGEDShapes,
		getChordTones,
		getCAGEDNoteClass,
		type CAGEDQuality
	} from './helpers';
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
			<span class="group-label">Shape</span>
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

	<div class="legend">
		<div class="legend-item">
			<span class="legend-dot root"></span>
			<span>Root</span>
		</div>
		<div class="legend-item">
			<span class="legend-dot chord-tone"></span>
			<span>Chord tone</span>
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
		background: rgba(12, 207, 223, 0.1);
		border: 1px solid rgba(12, 207, 223, 0.3);
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
			background: rgba(12, 207, 223, 0.1);
		}

		&.active {
			background: var(--accent-note);
			color: var(--bg-base);
			box-shadow: 0 0 12px 2px rgba(12, 207, 223, 0.3);
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
			background: rgba(240, 56, 96, 0.1);
		}

		&.active:not(.all) {
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

		&.root {
			background: var(--accent-tonic);
			box-shadow: 0 0 6px rgba(240, 56, 96, 0.5);
		}

		&.chord-tone {
			background: var(--accent-note);
			box-shadow: 0 0 6px rgba(12, 207, 223, 0.4);
		}
	}
</style>
