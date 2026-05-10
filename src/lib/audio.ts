// Audio engine: plucked-string synth via Tone.js.
//
// Web Audio is browser-only, and SvelteKit is SSR by default — so Tone is
// dynamically imported on first use rather than loaded at module init. The
// AudioContext also can't start without a user gesture (browser policy), so
// every public entry point goes through `ensureAudio()` which calls
// `Tone.start()` the first time it runs.

type ToneModule = typeof import('tone');

let toneModulePromise: Promise<ToneModule> | null = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let synth: any = null;
let started = false;

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
	if (!synth) {
		// PluckSynth = Karplus-Strong physical model of a plucked string.
		// Monophonic, so a new note cuts the previous one off — which is also
		// how single-line guitar phrasing actually works.
		synth = new Tone.PluckSynth({
			attackNoise: 0.6,
			dampening: 4000,
			resonance: 0.85
		}).toDestination();
		synth.volume.value = -6;
	}
	return Tone;
}

/**
 * Play a single note (e.g. "E4", "C#5").
 */
export async function playNote(pitch: string, durationSec = 0.8): Promise<void> {
	if (typeof window === 'undefined') return;
	await ensureAudio();
	synth.triggerAttackRelease(pitch, durationSec);
}

/**
 * Play a sequence of pitches one after another (e.g. a scale or arpeggio).
 * Notes are scheduled relative to the current audio time so they stay tight.
 */
export async function playSequence(pitches: string[], gapSec = 0.25): Promise<void> {
	if (typeof window === 'undefined' || pitches.length === 0) return;
	const Tone = await ensureAudio();
	const start = Tone.now();
	pitches.forEach((p, i) => {
		synth.triggerAttackRelease(p, '8n', start + i * gapSec);
	});
}
