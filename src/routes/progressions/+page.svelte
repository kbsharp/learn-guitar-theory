<script lang="ts">
	import Fretboard from '$lib/components/Fretboard/Fretboard.svelte';
	import CircleOfFifths from './CircleOfFifths.svelte';
	import {
		PRESETS,
		getDiatonicChords,
		getSlotChord,
		getProgressionNoteClass,
		type Preset
	} from './helpers';

	let progKey = $state('C');
	let mode = $state<'major' | 'minor'>('major');
	let progression = $state<[string, string, string, string]>(['I', 'V', 'vi', 'IV']);
	let activeSlot = $state(0);
	let activePreset = $state<string>('Pop Standard');

	let diatonicChords = $derived(getDiatonicChords(progKey, mode));
	let visiblePresets = $derived(PRESETS.filter((p) => p.mode === mode));

	let activeChordName = $derived(getSlotChord(progression[activeSlot], progKey, mode));
	let activeRoman = $derived(progression[activeSlot]);

	let getNoteClass = $derived((note: string) =>
		getProgressionNoteClass(note, activeChordName, progKey, mode)
	);
	const getNoteLabel = (note: string) => note;

	function selectPreset(preset: Preset) {
		activePreset = preset.name;
		mode = preset.mode;
		progression = [...preset.romans];
		activeSlot = 0;
	}

	function setSlotRoman(slot: number, roman: string) {
		const next = [...progression] as [string, string, string, string];
		next[slot] = roman;
		progression = next;
		activeSlot = slot;
		activePreset = '';
	}

	function selectMajorKey(key: string) {
		progKey = key;
		mode = 'major';
		resetToFirstPreset('major');
	}

	function selectMinorKey(key: string) {
		progKey = key;
		mode = 'minor';
		resetToFirstPreset('minor');
	}

	function resetToFirstPreset(m: 'major' | 'minor') {
		const first = PRESETS.find((p) => p.mode === m);
		if (first) {
			activePreset = first.name;
			progression = [...first.romans];
			activeSlot = 0;
		}
	}

	function toggleMode(m: 'major' | 'minor') {
		mode = m;
		resetToFirstPreset(m);
	}
</script>

<svelte:head>
	<title>Progression Builder — Fretboard Lab</title>
</svelte:head>

<div class="container">
	<div class="page-header">
		<p class="page-title">Progression Builder</p>
		<div class="active-info">
			{#if activeChordName}
				<span class="slot-indicator">Slot {activeSlot + 1}</span>
				<span class="active-roman">{activeRoman}</span>
				<span class="active-chord">{activeChordName}</span>
			{/if}
		</div>
	</div>

	<Fretboard {getNoteClass} {getNoteLabel} />

	<!-- Key selector + presets -->
	<div class="builder">
		<div class="circle-column">
			<CircleOfFifths
				selectedKey={progKey}
				{mode}
				onSelectMajor={selectMajorKey}
				onSelectMinor={selectMinorKey}
			/>
			<div class="mode-toggle">
				<button
					class="btn-mode"
					class:active={mode === 'major'}
					onclick={() => toggleMode('major')}
				>
					Major
				</button>
				<button
					class="btn-mode"
					class:active={mode === 'minor'}
					onclick={() => toggleMode('minor')}
				>
					Minor
				</button>
			</div>
		</div>

		<div class="presets-column">
			<p class="section-label">Common Progressions</p>
			<div class="preset-grid">
				{#each visiblePresets as preset}
					<button
						class="preset-card"
						class:active={activePreset === preset.name}
						onclick={() => selectPreset(preset)}
					>
						<div class="preset-top">
							<span class="preset-name">{preset.name}</span>
							<span class="preset-feel">{preset.feel}</span>
						</div>
						<div class="preset-romans">
							{#each preset.romans as roman}
								<span class="preset-roman">{roman}</span>
							{/each}
						</div>
					</button>
				{/each}
			</div>
		</div>
	</div>

	<!-- Diatonic palette -->
	<div class="palette-section">
		<p class="section-label">Diatonic Chords in {progKey} {mode === 'minor' ? 'Minor' : 'Major'}</p>
		<div class="palette">
			{#each diatonicChords as chord}
				<button
					class="palette-chord"
					onclick={() => setSlotRoman(activeSlot, chord.roman)}
					title="Set slot {activeSlot + 1} to {chord.name}"
				>
					<span class="palette-roman">{chord.roman}</span>
					<span class="palette-name">{chord.name}</span>
				</button>
			{/each}
		</div>
		<p class="palette-hint">Click a chord to place it in the active slot</p>
	</div>

	<!-- 4 progression slots -->
	<div class="slots-section">
		<p class="section-label">Your Progression</p>
		<div class="slots">
			{#each progression as roman, i}
				{@const chordName = getSlotChord(roman, progKey, mode)}
				<button
					class="slot"
					class:active={activeSlot === i}
					onclick={() => (activeSlot = i)}
					aria-pressed={activeSlot === i}
					aria-label="Slot {i + 1}: {chordName}"
				>
					<span class="slot-number">{i + 1}</span>
					<span class="slot-roman">{roman}</span>
					<span class="slot-chord">{chordName}</span>
				</button>
			{/each}
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

	.active-info {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.slot-indicator {
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	.active-roman {
		font-size: 12px;
		font-weight: 700;
		color: var(--accent-note);
		letter-spacing: 0.06em;
	}

	.active-chord {
		font-size: 14px;
		font-weight: 700;
		color: var(--text-primary);
		letter-spacing: 0.04em;
	}

	// ─── Builder row ────────────────────────────────────────────
	.builder {
		display: flex;
		gap: 52px;
		margin-top: 52px;
		align-items: flex-start;
	}

	.circle-column {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20px;
		flex-shrink: 0;
	}

	.mode-toggle {
		display: flex;
		gap: 6px;
	}

	.btn-mode {
		background: transparent;
		border: 1px solid var(--color-fret);
		color: var(--text-muted);
		border-radius: var(--radius-sm);
		padding: 7px 22px;
		font-family: inherit;
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.06em;
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

	.presets-column {
		flex: 1;
		min-width: 0;
	}

	.section-label {
		font-size: 10px;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--text-muted);
		font-weight: 600;
		margin: 0 0 14px;
	}

	.preset-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
		gap: 10px;
	}

	.preset-card {
		display: flex;
		flex-direction: column;
		gap: 10px;
		background: var(--bg-surface);
		border: 1px solid color-mix(in srgb, var(--text-primary) 6%, transparent);
		border-radius: var(--radius-md);
		padding: 14px 16px;
		cursor: pointer;
		text-align: left;
		font-family: inherit;
		color: inherit;
		transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;

		&:hover:not(.active) {
			border-color: color-mix(in srgb, var(--text-primary) 14%, transparent);
			background: color-mix(in srgb, var(--text-primary) 2%, transparent);
		}

		&.active {
			border-color: var(--accent-note);
			box-shadow: 0 0 14px color-mix(in srgb, var(--accent-note) 10%, transparent);
		}
	}

	.preset-top {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 8px;
	}

	.preset-name {
		font-size: 13px;
		font-weight: 700;
		color: var(--text-primary);
		letter-spacing: 0.01em;
	}

	.preset-feel {
		font-size: 9px;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--text-muted);
		white-space: nowrap;
	}

	.preset-romans {
		display: flex;
		gap: 8px;
	}

	.preset-roman {
		font-size: 13px;
		font-weight: 700;
		color: var(--accent-note);
		letter-spacing: 0.04em;
		min-width: 24px;
		text-align: center;

		.preset-card.active & {
			color: var(--accent-note);
		}
	}

	// ─── Diatonic palette ────────────────────────────────────────
	.palette-section {
		margin-top: 48px;
	}

	.palette {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.palette-chord {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 5px;
		background: transparent;
		border: 1px solid color-mix(in srgb, var(--text-primary) 10%, transparent);
		border-radius: var(--radius-sm);
		padding: 10px 18px;
		cursor: pointer;
		font-family: inherit;
		color: inherit;
		transition: border-color 0.2s ease, background 0.2s ease;

		&:hover {
			border-color: var(--accent-tonic);
			background: color-mix(in srgb, var(--accent-tonic) 6%, transparent);
		}
	}

	.palette-roman {
		font-size: 13px;
		font-weight: 700;
		color: var(--accent-tonic);
		letter-spacing: 0.04em;
		line-height: 1;
	}

	.palette-name {
		font-size: 11px;
		font-weight: 500;
		color: var(--text-muted);
		letter-spacing: 0.02em;
	}

	.palette-hint {
		margin: 10px 0 0;
		font-size: 10px;
		color: var(--text-muted);
		letter-spacing: 0.06em;
		opacity: 0.7;
	}

	// ─── Progression slots ───────────────────────────────────────
	.slots-section {
		margin-top: 48px;
	}

	.slots {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 12px;
	}

	.slot {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 6px;
		background: var(--bg-surface);
		border: 1px solid rgba(255, 255, 255, 0.06);
		border-radius: var(--radius-md);
		padding: 20px 22px;
		cursor: pointer;
		text-align: left;
		font-family: inherit;
		color: inherit;
		transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;

		&:hover:not(.active) {
			border-color: rgba(255, 255, 255, 0.12);
			background: rgba(255, 255, 255, 0.02);
		}

		&.active {
			border-color: var(--accent-note);
			box-shadow: 0 0 16px color-mix(in srgb, var(--accent-note) 12%, transparent);
		}

		&:focus-visible {
			outline: 2px solid var(--accent-note);
			outline-offset: -2px;
		}
	}

	.slot-number {
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	.slot-roman {
		font-size: 28px;
		font-weight: 700;
		color: var(--accent-note);
		letter-spacing: 0.02em;
		line-height: 1;
	}

	.slot-chord {
		font-size: 13px;
		font-weight: 600;
		color: var(--text-primary);
		letter-spacing: 0.02em;
	}

	// ─── Legend ──────────────────────────────────────────────────
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
			box-shadow: 0 0 6px color-mix(in srgb, var(--accent-tonic) 50%, transparent);
		}

		&.scale-tone {
			background: var(--accent-note);
			box-shadow: 0 0 6px color-mix(in srgb, var(--accent-note) 40%, transparent);
		}
	}
</style>
