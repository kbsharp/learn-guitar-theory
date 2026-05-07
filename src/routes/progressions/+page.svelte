<script lang="ts">
	import Fretboard from '$lib/components/Fretboard/Fretboard.svelte';
	import {
		chordRoots,
		chordTypes,
		chordTypeLabels,
		getChordScaleClass,
		getChordName,
		getRecommendedScaleName,
		type ChordType
	} from '../chord-scale/helpers';

	interface Slot {
		root: string;
		quality: ChordType;
	}

	let progression = $state<Slot[]>([
		{ root: 'C', quality: 'maj7' },
		{ root: 'A', quality: 'm7' },
		{ root: 'F', quality: 'maj7' },
		{ root: 'G', quality: '7' }
	]);

	let activeSlot = $state(0);

	let active = $derived(progression[activeSlot]);
	let activeChordName = $derived(getChordName(active.root, active.quality));
	let suggestedScale = $derived(getRecommendedScaleName(active.quality));
	let getNoteClass = $derived((note: string) =>
		getChordScaleClass(note, active.root, active.quality)
	);
	const getNoteLabel = (note: string) => note;

	function setRoot(index: number, root: string) {
		progression[index] = { ...progression[index], root };
	}
	function setQuality(index: number, quality: ChordType) {
		progression[index] = { ...progression[index], quality };
	}
</script>

<svelte:head>
	<title>Progression Builder — Fretboard Lab</title>
</svelte:head>

<div class="container">
	<div class="page-header">
		<p class="page-title">Progression Builder</p>
		<div class="active-info">
			<span class="active-chord">{activeChordName}</span>
			<span class="active-scale">→ {suggestedScale}</span>
		</div>
	</div>

	<Fretboard {getNoteClass} {getNoteLabel} />

	<div class="progression">
		{#each progression as slot, i}
			<button
				class="chord-card"
				class:active={activeSlot === i}
				onclick={() => (activeSlot = i)}
			>
				<span class="slot-number">{i + 1}</span>
				<span class="chord-label">{getChordName(slot.root, slot.quality)}</span>
				<span class="scale-label">→ {getRecommendedScaleName(slot.quality)}</span>

				<div class="slot-controls" role="presentation" onclick={(e) => e.stopPropagation()}>
					<select
						class="select-root"
						value={slot.root}
						onchange={(e) => setRoot(i, (e.target as HTMLSelectElement).value)}
					>
						{#each chordRoots as root}
							<option value={root}>{root}</option>
						{/each}
					</select>
					<select
						class="select-quality"
						value={slot.quality}
						onchange={(e) => setQuality(i, (e.target as HTMLSelectElement).value as ChordType)}
					>
						{#each chordTypes as ct}
							<option value={ct}>{chordTypeLabels[ct]}</option>
						{/each}
					</select>
				</div>
			</button>
		{/each}
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

	.active-info {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.active-chord {
		font-size: 14px;
		font-weight: 700;
		color: var(--text-primary);
		letter-spacing: 0.04em;
	}

	.active-scale {
		font-size: 12px;
		color: var(--text-muted);
		letter-spacing: 0.06em;
	}

	.progression {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 12px;
		margin-top: 40px;
	}

	.chord-card {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 6px;
		background: var(--bg-surface);
		border: 1px solid rgba(255, 255, 255, 0.06);
		border-radius: var(--radius-md);
		padding: 20px;
		cursor: pointer;
		transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
		text-align: left;
		font-family: inherit;
		color: inherit;
		width: 100%;
		box-sizing: border-box;

		&:hover:not(.active) {
			border-color: rgba(255, 255, 255, 0.12);
			background: rgba(255, 255, 255, 0.02);
		}

		&.active {
			border-color: var(--accent-note);
			box-shadow: 0 0 16px rgba(12, 207, 223, 0.12);
		}
	}

	.slot-number {
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--text-muted);
		margin-bottom: 4px;
	}

	.chord-label {
		font-size: 22px;
		font-weight: 700;
		color: var(--text-primary);
		letter-spacing: 0.02em;
		line-height: 1;
	}

	.scale-label {
		font-size: 11px;
		color: var(--text-muted);
		letter-spacing: 0.04em;
		margin-bottom: 12px;
	}

	.slot-controls {
		display: flex;
		gap: 6px;
		width: 100%;
		margin-top: auto;
	}

	.select-root,
	.select-quality {
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: var(--radius-sm);
		color: var(--text-primary);
		font-family: inherit;
		font-size: 12px;
		font-weight: 600;
		padding: 6px 8px;
		cursor: pointer;
		transition: border-color 0.2s ease;
		appearance: none;
		-webkit-appearance: none;

		&:hover,
		&:focus {
			border-color: var(--accent-note);
			outline: none;
		}

		option {
			background: var(--bg-surface);
		}
	}

	.select-root {
		width: 72px;
	}

	.select-quality {
		flex: 1;
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
