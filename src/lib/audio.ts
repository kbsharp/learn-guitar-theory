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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let sampler: any = null;
let samplerLoadPromise: Promise<void> | null = null;
let started = false;

// Public reactive store: subscribe to know whether audio is ready to play.
// Pages can use this to disable Play buttons or show a "loading…" state.
const audioReadyStore = writable(false);
export const audioReady: Readable<boolean> = { subscribe: audioReadyStore.subscribe };

async function loadTone(): Promise<ToneModule> {
	if (!toneModulePromise) {
		toneModulePromise = import('tone');
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

/**
 * Play a sequence of pitches ascending in time. Notes are scheduled
 * relative to the current audio time so timing stays tight even on slow
 * frames.
 */
export async function playSequence(pitches: string[], gapSec = 0.32): Promise<void> {
	if (typeof window === 'undefined' || pitches.length === 0) return;
	const Tone = await ensureAudio();
	const start = Tone.now();
	pitches.forEach((p, i) => {
		sampler.triggerAttackRelease(p, gapSec * 1.8, start + i * gapSec);
	});
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
