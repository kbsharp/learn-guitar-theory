// Audio engine: sampled acoustic guitar via Tone.js.
//
// Software synthesis can't produce a believable acoustic guitar at our scale,
// so we play back real recordings. 13 samples cover the playable range with
// at most ~1-2 semitones of pitch shift in any direction (Tone.Sampler
// interpolates). See `static/samples/guitar-acoustic/README.md`.
//
// Web Audio is browser-only and SvelteKit is SSR by default, so Tone is
// dynamically imported on first use. The AudioContext also can't start
// without a user gesture, so every public entry point goes through
// `ensureAudio()` which calls `Tone.start()` the first time it runs.

import { writable, type Readable } from 'svelte/store';

type ToneModule = typeof import('tone');

// Sample notes available on disk in static/samples/guitar-acoustic/.
// File names follow tonejs-instruments convention: '#' → 's'.
const SAMPLE_URLS: Record<string, string> = {
	E2: 'E2.mp3',
	G2: 'G2.mp3',
	'A#2': 'As2.mp3',
	'C#3': 'Cs3.mp3',
	E3: 'E3.mp3',
	G3: 'G3.mp3',
	'A#3': 'As3.mp3',
	'C#4': 'Cs4.mp3',
	E4: 'E4.mp3',
	G4: 'G4.mp3',
	'A#4': 'As4.mp3',
	'C#5': 'Cs5.mp3',
	D5: 'D5.mp3'
};

let toneModulePromise: Promise<ToneModule> | null = null;
// Synchronous handle on the module once it has loaded, so `stopPlayback()`
// can cancel without being async (it's called from teardown paths).
let toneModule: ToneModule | null = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let sampler: any = null;
let samplerLoadPromise: Promise<void> | null = null;
let started = false;
// Bumped whenever playback starts or stops, so callbacks already queued for
// a cancelled run identify themselves as stale and do nothing.
let playbackGeneration = 0;

// Public reactive store: subscribe to know whether audio is ready to play.
// Pages can use this to disable Play buttons or show a "loading…" state.
const audioReadyStore = writable(false);
export const audioReady: Readable<boolean> = { subscribe: audioReadyStore.subscribe };

async function loadTone(): Promise<ToneModule> {
	if (!toneModulePromise) {
		toneModulePromise = import('tone').then((mod) => {
			toneModule = mod;
			return mod;
		});
	}
	return toneModulePromise;
}

async function ensureAudio(): Promise<ToneModule> {
	const Tone = await loadTone();
	if (!started) {
		await Tone.start();
		started = true;
	}
	if (!sampler) {
		sampler = new Tone.Sampler({
			urls: SAMPLE_URLS,
			baseUrl: '/samples/guitar-acoustic/',
			release: 1.4
		}).toDestination();
		sampler.volume.value = -3;
		samplerLoadPromise = Tone.loaded().then(() => {
			audioReadyStore.set(true);
		});
	}
	if (samplerLoadPromise) await samplerLoadPromise;
	return Tone;
}

/**
 * Play a single note (e.g. "E4", "C#5"). Resolves once the note has been
 * scheduled — the sound continues to ring after this returns.
 */
export async function playNote(pitch: string, durationSec = 1.5): Promise<void> {
	if (typeof window === 'undefined') return;
	await ensureAudio();
	sampler.triggerAttackRelease(pitch, durationSec);
}

export interface SequenceOptions {
	/** Seconds between note onsets. */
	gapSec?: number;
	/**
	 * Fired on the animation frame nearest to each note actually sounding —
	 * use this to light the note up on screen. Scheduled through Tone's Draw
	 * so the visual lands with the sound, not before it.
	 */
	onStep?: (index: number) => void;
	/** Fired once the last note has been triggered. */
	onEnd?: () => void;
}

/**
 * Play a sequence of pitches in time, optionally reporting each note as it
 * sounds. Scheduled on Tone's Transport rather than raw audio-time offsets so
 * the whole run stays cancellable — see `stopPlayback()`.
 *
 * Only one sequence plays at a time; starting a new one cancels the old.
 */
export async function playSequence(
	pitches: string[],
	{ gapSec = 0.32, onStep, onEnd }: SequenceOptions = {}
): Promise<void> {
	if (typeof window === 'undefined' || pitches.length === 0) return;
	const Tone = await ensureAudio();

	stopPlayback();

	const transport = Tone.getTransport();
	const draw = Tone.getDraw();
	const generation = playbackGeneration;
	transport.position = 0;

	pitches.forEach((pitch, i) => {
		transport.scheduleOnce((time) => {
			sampler.triggerAttackRelease(pitch, gapSec * 1.8, time);
			if (!onStep) return;
			// Draw lands the highlight on the animation frame nearest the
			// sound, but it silently drops events it misses and never runs at
			// all while the tab is hidden. Back it with a timer so the visual
			// can't disappear — whichever fires first wins.
			let fired = false;
			const fire = () => {
				if (fired || generation !== playbackGeneration) return;
				fired = true;
				onStep(i);
			};
			draw.schedule(fire, time);
			setTimeout(fire, Math.max(0, (time - Tone.now()) * 1000));
		}, i * gapSec);
	});

	// End is driven off the Transport rather than Draw for the same reason: a
	// stuck "playing" button is worse than resetting a lookahead-tick early.
	transport.scheduleOnce(() => {
		transport.stop();
		if (generation === playbackGeneration) onEnd?.();
	}, pitches.length * gapSec);

	transport.start();
}

/**
 * Cancel any sequence in progress and silence ringing notes. Safe to call
 * before audio has ever loaded.
 */
export function stopPlayback(): void {
	playbackGeneration++;
	if (typeof window === 'undefined' || !toneModule) return;
	const transport = toneModule.getTransport();
	transport.stop();
	transport.cancel();
	transport.position = 0;
	toneModule.getDraw().cancel(0);
	sampler?.releaseAll();
}

/**
 * Begin loading samples in the background (without waiting for a click).
 * Safe to call on mount — it triggers a user-gesture-less context start
 * attempt, which will fail silently in browsers; the real start happens
 * on the first user click via `ensureAudio()`. Call this to begin sample
 * download as soon as a tool page opens so audio is ready when needed.
 */
export async function preloadAudio(): Promise<void> {
	if (typeof window === 'undefined') return;
	const Tone = await loadTone();
	if (!sampler) {
		sampler = new Tone.Sampler({
			urls: SAMPLE_URLS,
			baseUrl: '/samples/guitar-acoustic/',
			release: 1.4
		}).toDestination();
		sampler.volume.value = -3;
		samplerLoadPromise = Tone.loaded().then(() => {
			audioReadyStore.set(true);
		});
	}
}
