<script lang="ts">
	/**
	 * A/B player: the same phrase, two ways, one note apart.
	 *
	 * The point isn't to play two scales — it's to make a single note audible
	 * by removing every other variable. So both variants must be the same
	 * phrase in the same window on the same root, and selecting one is meant to
	 * change what's on the fretboard too: you hear one dot move and see it move
	 * at the same time. The caller owns that swap (bind `selected`); this
	 * component owns the toggle, the playback, and the state that goes with it.
	 *
	 * Clicking the variant that's already sounding stops it. Clicking the other
	 * switches immediately — flipping back and forth mid-listen is the whole
	 * exercise, so there's no "stop first" step.
	 */
	import { onDestroy, onMount } from 'svelte';
	import HelpTip from './HelpTip.svelte';
	import { playSequence, stopPlayback, audioReady, preloadAudio } from '$lib/audio';

	interface ComparisonNote {
		string: number;
		fret: number;
		pitch: string;
	}

	interface ComparisonVariant {
		/** Short name for the toggle, e.g. 'Dorian'. */
		label: string;
		/** The phrase to play — same shape as the other variant. */
		notes: ComparisonNote[];
	}

	interface Props {
		/** The scale the user picked. Shown first, selected by default. */
		a: ComparisonVariant;
		/** The familiar reference it's being heard against. */
		b: ComparisonVariant;
		/** The degree that separates them, e.g. '♮6' — the thing being flagged. */
		degree: string;
		/** What the ear should be listening for. */
		listenFor: string;
		/** Index of the variant showing on the board. Bind it and swap accordingly. */
		selected?: number;
		/** Notes sounding right now. Bind it, pass it to `<Fretboard>`. */
		playingNotes?: ComparisonNote[];
		/** Seconds between notes — match the page's own scale run. */
		gapSec?: number;
	}

	let {
		a,
		b,
		degree,
		listenFor,
		selected = $bindable(0),
		playingNotes = $bindable([]),
		gapSec = 0.26
	}: Props = $props();

	let playingVariant = $state<number | null>(null);
	// Flipping A→B supersedes our *own* run, so the outgoing run's `onCancel`
	// fires while the incoming one is being scheduled. Without a token to tell
	// them apart, the old run tears down the state the new one just set and
	// both takes go silent — which is exactly the interaction this component
	// exists for.
	let runToken = 0;

	onMount(() => {
		void preloadAudio();
	});

	onDestroy(stopPlayback);

	let variants = $derived([a, b] as const);

	// A new pair means the old phrases are gone from the board — anything
	// mid-flight is now playing notes nobody can see.
	$effect(() => {
		void a;
		void b;
		stop();
	});

	function reset() {
		playingVariant = null;
		playingNotes = [];
	}

	function stop() {
		runToken++;
		stopPlayback();
		reset();
	}

	async function select(index: number) {
		if (playingVariant === index) {
			stop();
			return;
		}
		selected = index;
		const notes = variants[index]?.notes ?? [];
		if (!notes.length) {
			stop();
			return;
		}
		const token = ++runToken;
		const current = () => token === runToken;
		playingVariant = index;
		playingNotes = [];
		try {
			await playSequence(
				notes.map((note) => note.pitch),
				{
					gapSec,
					// One note at a time on a run — same as the page's Play scale.
					onStep: (i) => current() && (playingNotes = notes.slice(i, i + 1)),
					onEnd: () => current() && reset(),
					// Fires for whichever run we replaced — sometimes our own.
					onCancel: () => current() && reset()
				}
			);
		} catch {
			if (current()) stop();
		}
	}
</script>

<div class="ab-comparison">
	<div class="ab-head">
		<div class="ab-title">
			<span class="ab-label">One note makes the colour</span>
			<HelpTip
				term="Characteristic note"
				definition="The one note that separates a scale from the familiar scale next door — Dorian's natural 6th, Lydian's sharp 4th. It's ringed in amber on the board. Target it deliberately over a chord and the scale's flavour appears; avoid it and you're just playing the scale you already knew. Learning a new scale is really learning where its characteristic note sits and what it sounds like landed on."
			/>
		</div>
		<span class="ab-degree">{degree}</span>
	</div>

	<div class="ab-toggle" role="group" aria-label="Compare two scales">
		{#each variants as variant, i}
			<button
				type="button"
				class="ab-btn"
				class:active={selected === i}
				class:sounding={playingVariant === i}
				disabled={!$audioReady || variant.notes.length === 0}
				aria-pressed={selected === i}
				onclick={() => select(i)}
			>
				<span class="ab-slot">{i === 0 ? 'A' : 'B'}</span>
				<span class="ab-name">{variant.label}</span>
			</button>
		{/each}
	</div>

	<p class="ab-listen">
		{#if !$audioReady}
			Loading audio…
		{:else}
			{listenFor}
		{/if}
	</p>

	<!-- The fretboard sits above this panel and the scale selector below it, so
	     say plainly which of the two the board is currently drawing. -->
	<p class="ab-showing">
		On the board: <strong>{variants[selected]?.label ?? a.label}</strong>
	</p>
</div>

<style lang="scss">
	.ab-comparison {
		max-width: 640px;
		margin: 28px auto 0;
		padding: 16px 18px;
		background: color-mix(in srgb, var(--accent-characteristic) 5%, transparent);
		border: 1px solid color-mix(in srgb, var(--accent-characteristic) 25%, transparent);
		border-radius: var(--radius-sm);
	}

	.ab-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 12px;
	}

	.ab-title {
		display: flex;
		align-items: center;
	}

	.ab-label {
		font-size: 9px;
		font-weight: 700;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	/*
	 * The degree being flagged. The amber is carried by the border and fill,
	 * not the glyph — the accent reads fine as a ring on the always-dark
	 * fretboard, but as small text on the light theme's white surface it
	 * would fall under AA contrast.
	 */
	.ab-degree {
		font-size: 12px;
		font-weight: 700;
		line-height: 1;
		color: var(--text-primary);
		background: color-mix(in srgb, var(--accent-characteristic) 14%, transparent);
		border: 1px solid var(--accent-characteristic);
		border-radius: 999px;
		padding: 4px 10px;
	}

	.ab-toggle {
		display: flex;
		gap: 6px;
	}

	.ab-btn {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		font-family: inherit;
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.06em;
		background: transparent;
		border: 1px solid var(--color-fret);
		color: var(--text-muted);
		border-radius: var(--radius-sm);
		padding: 9px 14px;
		cursor: pointer;
		transition:
			background-color 0.2s ease,
			border-color 0.2s ease,
			color 0.2s ease,
			box-shadow 0.2s ease;

		&:hover:not(:disabled):not(.active) {
			border-color: var(--accent-note);
			color: var(--accent-note);
		}

		&:disabled {
			cursor: default;
			opacity: 0.5;
		}

		// Accent on the border and fill, text left at full contrast — the
		// accent-on-tint combination lands just under AA on the light theme.
		&.active {
			background: color-mix(in srgb, var(--accent-note) 12%, transparent);
			border-color: var(--accent-note);
			color: var(--text-primary);
		}

		// Sounding right now: the same bright ring the playing note gets on the
		// board, so eye and ear agree on which take you're hearing.
		&.sounding {
			box-shadow: 0 0 0 1px var(--text-primary);
		}

		&:focus-visible {
			outline: 2px solid var(--text-primary);
			outline-offset: 2px;
		}
	}

	.ab-slot {
		font-size: 9px;
		font-weight: 700;
		letter-spacing: 0.1em;
		opacity: 0.6;
	}

	.ab-listen {
		margin: 12px 0 0;
		font-size: 12px;
		line-height: 1.7;
		color: var(--text-primary);
		opacity: 0.85;
	}

	.ab-showing {
		margin: 10px 0 0;
		font-size: 10px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-muted);

		strong {
			color: var(--text-primary);
			font-weight: 700;
		}
	}
</style>
