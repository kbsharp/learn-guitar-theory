<script lang="ts">
	import Fretboard from '$lib/components/Fretboard/Fretboard.svelte';
	import ExplanationPanel from '$lib/components/ExplanationPanel.svelte';
	import HelpTip from '$lib/components/HelpTip.svelte';
	import { diatonicKeys } from '../diatonic/helpers';
	import {
		PRESETS,
		ALL_MOOD_TAGS,
		getBorrowedChords,
		getDiatonicChords,
		getSlotChord,
		getProgressionNoteClass,
		getFunctionLabel,
		formatRoman,
		type Preset,
		type MoodTag
	} from './helpers';
	import {
		progressionExplanations,
		defaultExplanation,
		getChordExplanation
	} from './explanations';

	let progKey = $state('C');
	let mode = $state<'major' | 'minor'>('major');
	let progression = $state<[string, string, string, string]>(['I', 'V', 'vi', 'IV']);
	let activeSlot = $state(0);
	let activePreset = $state<string>('Pop Standard');
	let activeMoodTag = $state<MoodTag | null>(null);

	let diatonicChords = $derived(getDiatonicChords(progKey, mode));
	let borrowedChords = $derived(getBorrowedChords(mode));
	let availableMoodTags = $derived(
		ALL_MOOD_TAGS.filter((tag) => PRESETS.some((p) => p.mode === mode && p.moods.includes(tag)))
	);
	let visiblePresets = $derived(
		PRESETS.filter(
			(p) => p.mode === mode && (activeMoodTag === null || p.moods.includes(activeMoodTag))
		)
	);

	let activeChordName = $derived(getSlotChord(progression[activeSlot], progKey, mode));
	let activeRoman = $derived(progression[activeSlot]);

	let explanation = $derived(() => {
		if (activePreset) return progressionExplanations[activePreset] ?? defaultExplanation;
		return getChordExplanation(activeRoman, mode) ?? defaultExplanation;
	});

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

	function selectKey(key: string) {
		progKey = key;
		activeMoodTag = null;
		resetToFirstPreset(mode);
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
		activeMoodTag = null;
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
				<span class="active-roman">{formatRoman(activeRoman)}</span>
				<span class="active-chord">{activeChordName}</span>
			{/if}
		</div>
	</div>

	<p class="page-intro">
		Every mood has a progression behind it — dark, cinematic, uplifting, or tense. Choose a preset
		to learn why it sounds the way it does and what scale to reach for when you improvise. Then
		build your own using the diatonic and borrowed chord palettes below.
	</p>

	<Fretboard {getNoteClass} {getNoteLabel} />

	<!-- Key + Mode controls -->
	<div class="controls">
		<div class="control-group">
			<span class="group-label">Key</span>
			<div class="btn-row">
				{#each diatonicKeys as k}
					<button class="btn-key" class:active={progKey === k} onclick={() => selectKey(k)}>
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
	</div>

	<!-- Presets -->
	<div class="presets-section">
		<p class="section-label">Common Progressions</p>

		<div class="mood-filter">
			<button
				class="mood-pill"
				class:active={activeMoodTag === null}
				onclick={() => (activeMoodTag = null)}
			>
				All
			</button>
			{#each availableMoodTags as tag}
				<button
					class="mood-pill"
					class:active={activeMoodTag === tag}
					onclick={() => (activeMoodTag = activeMoodTag === tag ? null : tag)}
				>
					{tag}
				</button>
			{/each}
		</div>

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
							<span class="preset-roman">{formatRoman(roman)}</span>
						{/each}
					</div>
					<div class="preset-moods">
						{#each preset.moods as mood}
							<span class="preset-mood-tag">{mood}</span>
						{/each}
					</div>
				</button>
			{/each}
		</div>
	</div>

	<!-- Diatonic + Borrowed palettes -->
	<div class="palette-section">
		<p class="section-label">
			Diatonic Chords in {progKey}
			{mode === 'minor' ? 'Minor' : 'Major'}
		</p>
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

		<div class="borrowed-palette">
			<div class="label-with-help">
				<p class="section-label">Borrowed</p>
				<HelpTip
					term="Borrowed chords"
					definition="Chords taken from the parallel major or minor key. They introduce notes outside the diatonic scale, adding colour without fully changing key. The borrowed note lights up pink on the fretboard — that's the note that defines the chord's character."
				/>
			</div>
			<div class="palette">
				{#each borrowedChords as chord}
					<button
						class="palette-chord borrowed"
						onclick={() => setSlotRoman(activeSlot, chord.roman)}
						title={chord.descriptor}
					>
						<span class="palette-roman">{chord.label}</span>
						<span class="palette-name">{chord.descriptor}</span>
					</button>
				{/each}
			</div>
		</div>

		<p class="palette-hint">Click a chord to place it in the active slot</p>
	</div>

	<!-- Progression slots -->
	<div class="slots-section">
		<div class="label-with-help">
			<p class="section-label">Your Progression</p>
			<HelpTip
				term="Harmonic function"
				definition="T = Tonic (stable, home). PD = Pre-dominant (approach, building momentum). D = Dominant (maximum tension, pulls toward Tonic). The sequence of functions shapes the emotional arc of a progression."
			/>
		</div>
		<div class="slots">
			{#each progression as roman, i}
				{@const chordName = getSlotChord(roman, progKey, mode)}
				{@const fnLabel = getFunctionLabel(roman)}
				<button
					class="slot"
					class:active={activeSlot === i}
					onclick={() => (activeSlot = i)}
					aria-pressed={activeSlot === i}
					aria-label="Slot {i + 1}: {chordName}"
				>
					<div class="slot-top">
						<span class="slot-number">{i + 1}</span>
						<span class="slot-function" data-fn={fnLabel}>{fnLabel}</span>
					</div>
					<span class="slot-roman">{formatRoman(roman)}</span>
					<span class="slot-chord">{chordName}</span>
				</button>
			{/each}
		</div>
	</div>

	<!-- Explanation + Practice tip -->
	<ExplanationPanel context={explanation().context} body={explanation().body} />

	{#if explanation().practice}
		<div class="practice-tip">
			<span class="practice-label">What to practice</span>
			<p class="practice-body">{explanation().practice}</p>
		</div>
	{/if}

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

	.page-intro {
		font-size: 12px;
		line-height: 1.7;
		color: var(--text-muted);
		margin: 0 0 28px;
		opacity: 0.75;
		max-width: 680px;
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

	// ─── Key + Mode controls ──────────────────────────────────────────────────────

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

	// ─── Presets ──────────────────────────────────────────────────────────────────

	.presets-section {
		margin-top: 48px;
	}

	.mood-filter {
		display: flex;
		flex-wrap: wrap;
		gap: 5px;
		margin-bottom: 14px;
	}

	.mood-pill {
		background: transparent;
		border: 1px solid color-mix(in srgb, var(--text-primary) 10%, transparent);
		color: var(--text-muted);
		border-radius: 100px;
		padding: 3px 10px;
		font-family: inherit;
		font-size: 9px;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		cursor: pointer;
		transition: all 0.15s ease;

		&:hover:not(.active) {
			border-color: var(--text-muted);
			color: var(--text-primary);
		}

		&.active {
			background: color-mix(in srgb, var(--accent-note) 12%, transparent);
			border-color: var(--accent-note);
			color: var(--accent-note);
		}
	}

	.section-label {
		font-size: 10px;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--text-muted);
		font-weight: 600;
		margin: 0 0 14px;
	}

	.label-with-help {
		display: flex;
		align-items: center;
		margin-bottom: 14px;

		.section-label {
			margin-bottom: 0;
		}
	}

	.preset-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
		gap: 10px;
	}

	.preset-card {
		display: flex;
		flex-direction: column;
		gap: 8px;
		background: var(--bg-surface);
		border: 1px solid color-mix(in srgb, var(--text-primary) 6%, transparent);
		border-radius: var(--radius-md);
		padding: 14px 16px;
		cursor: pointer;
		text-align: left;
		font-family: inherit;
		color: inherit;
		transition:
			border-color 0.2s ease,
			background 0.2s ease,
			box-shadow 0.2s ease;

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
	}

	.preset-moods {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
	}

	.preset-mood-tag {
		font-size: 8px;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--text-muted);
		border: 1px solid color-mix(in srgb, var(--text-primary) 8%, transparent);
		border-radius: 100px;
		padding: 1px 6px;
	}

	// ─── Diatonic + Borrowed palettes ─────────────────────────────────────────────

	.palette-section {
		margin-top: 48px;
	}

	.borrowed-palette {
		margin-top: 28px;
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
		transition:
			border-color 0.2s ease,
			background 0.2s ease;

		&:hover {
			border-color: var(--accent-tonic);
			background: color-mix(in srgb, var(--accent-tonic) 6%, transparent);
		}

		&.borrowed {
			border-color: color-mix(in srgb, var(--accent-tonic) 20%, transparent);

			.palette-roman {
				color: color-mix(in srgb, var(--accent-tonic) 80%, var(--text-muted) 20%);
			}

			&:hover {
				border-color: var(--accent-tonic);
				background: color-mix(in srgb, var(--accent-tonic) 6%, transparent);
			}
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

	// ─── Progression slots ────────────────────────────────────────────────────────

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
		gap: 6px;
		background: var(--bg-surface);
		border: 1px solid rgba(255, 255, 255, 0.06);
		border-radius: var(--radius-md);
		padding: 18px 20px;
		cursor: pointer;
		text-align: left;
		font-family: inherit;
		color: inherit;
		transition:
			border-color 0.2s ease,
			box-shadow 0.2s ease,
			background 0.2s ease;

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

	.slot-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.slot-number {
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	.slot-function {
		font-size: 9px;
		font-weight: 700;
		letter-spacing: 0.1em;
		border-radius: 4px;
		padding: 2px 5px;

		&[data-fn='T'] {
			color: var(--accent-tonic);
			background: color-mix(in srgb, var(--accent-tonic) 10%, transparent);
		}

		&[data-fn='PD'] {
			color: var(--accent-note);
			background: color-mix(in srgb, var(--accent-note) 10%, transparent);
		}

		&[data-fn='D'] {
			color: var(--text-muted);
			background: color-mix(in srgb, var(--text-primary) 7%, transparent);
		}
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

	// ─── Practice tip ─────────────────────────────────────────────────────────────

	.practice-tip {
		max-width: 640px;
		margin: 16px auto 0;
		padding: 14px 18px;
		background: color-mix(in srgb, var(--accent-tonic) 4%, transparent);
		border: 1px solid color-mix(in srgb, var(--accent-tonic) 12%, transparent);
		border-radius: var(--radius-sm);
	}

	.practice-label {
		display: block;
		font-size: 9px;
		font-weight: 700;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--accent-tonic);
		margin-bottom: 8px;
	}

	.practice-body {
		margin: 0;
		font-size: 12px;
		line-height: 1.7;
		color: var(--text-primary);
		opacity: 0.85;
	}

	// ─── Legend ───────────────────────────────────────────────────────────────────

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
