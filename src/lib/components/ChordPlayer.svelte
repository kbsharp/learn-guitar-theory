<script lang="ts">
	/**
	 * Play/Stop control for strumming the chord currently on the board.
	 *
	 * Owns the playback state so the three chord tools don't each reinvent it.
	 * Bind `playingNotes` and hand it to `<Fretboard>`: strings light up one by
	 * one as the strum passes over them and stay lit while the chord rings, so
	 * the shape assembles in front of the guitarist at the speed it sounds.
	 */
	import { onDestroy, onMount } from 'svelte';
	import PlayButton from './PlayButton.svelte';
	import { playChord, stopPlayback, audioReady, preloadAudio } from '$lib/audio';
	import type { VoicingNote } from '$lib/voicing';

	interface Props {
		/** The voicing to strum, bass string first — from `computeChordVoicing`. */
		voicing: VoicingNote[];
		label?: string;
		/** Shown instead of the label when there's nothing to play. */
		hint?: string;
		/** Strings sounding right now. Bind it, pass it to `<Fretboard>`. */
		playingNotes?: VoicingNote[];
	}

	let {
		voicing,
		label = 'Play chord',
		hint = 'Select a chord',
		playingNotes = $bindable([])
	}: Props = $props();

	let isPlaying = $state(false);

	// Start the sample download on page open so the button is live by the time
	// anyone reaches for it.
	onMount(() => {
		void preloadAudio();
	});

	onDestroy(stopPlayback);

	// Any change to the chord on the board invalidates a strum in progress —
	// the strings it lit are no longer the ones on screen.
	$effect(() => {
		void voicing;
		stopStrum();
	});

	function stopStrum() {
		stopPlayback();
		isPlaying = false;
		playingNotes = [];
	}

	async function handleClick() {
		if (isPlaying) {
			stopStrum();
			return;
		}
		if (!voicing.length) return;
		isPlaying = true;
		playingNotes = [];
		try {
			await playChord(
				voicing.map((note) => note.pitch),
				{
					onStep: (i) => (playingNotes = voicing.slice(0, i + 1)),
					onEnd: () => {
						isPlaying = false;
						playingNotes = [];
					},
					// Another player took the audio — reset without calling
					// stopPlayback(), which would cancel the run that stole it.
					onCancel: () => {
						isPlaying = false;
						playingNotes = [];
					}
				}
			);
		} catch {
			stopStrum();
		}
	}
</script>

<PlayButton
	{label}
	{hint}
	playing={isPlaying}
	loading={!$audioReady}
	disabled={voicing.length === 0}
	onclick={handleClick}
/>
