// Turning a chord (a set of note names) into something a guitar can strum.
//
// Playing a chord back as an abstract stack of pitches teaches the harmony but
// nothing about the instrument. What a guitarist needs to hear is the chord as
// it sits under the hand: a bass root, one note per string above it, all inside
// a reachable window. So we build a real voicing on the real neck and strum it
// low string to high — which is also what lets the fretboard light up the notes
// that are sounding.
//
// The rule is deliberately simple: put the root in the bass, then on every
// higher string take the *lowest* chord tone within the hand's reach. That one
// rule reproduces the canonical shapes a guitarist already knows — open E
// (022100), open Am (x02210), the E-shape barre (G = 355433) and the A-shape
// barre (C = x35553) all fall out of it (see voicing.test.ts).

import { Note } from 'tonal';
import { strings, stringPitches } from '$lib/strings';

export interface VoicingNote {
	/** String index — 0 is high e, 5 is low E (matches Strings.svelte). */
	string: number;
	fret: number;
	/** Pitch with octave, e.g. "C3" — what gets sent to the sampler. */
	pitch: string;
}

export interface FretWindow {
	start: number;
	end: number;
}

/** How far above the bass root the fretting hand reaches. */
const HAND_SPAN = 4;
/** Strings a root may sit on when we choose the position ourselves: low E, then A. */
const BASS_STRINGS = [5, 4];

/**
 * Build a strummable voicing of a chord on the neck.
 *
 * `chordTones` may be spelled any way tonal spells them (Bb, E#, Cb) — notes
 * are matched by pitch class, not by name, so no flat/sharp normalisation is
 * needed at the call site.
 *
 * Pass `window` to keep the voicing inside a highlighted box (a CAGED shape,
 * a scale position); the bass is then the lowest root in that box, and every
 * note sounds from inside it, so nothing lights up outside what's on screen.
 * With no window we pick the lowest comfortable position for the chord.
 *
 * Returns notes in strum order: bass string first.
 */
export function computeChordVoicing(
	root: string,
	chordTones: string[],
	window: FretWindow | null = null
): VoicingNote[] {
	const rootChroma = Note.chroma(root);
	const toneChromas = new Set(
		chordTones.map((note) => Note.chroma(note)).filter((c): c is number => c !== undefined)
	);
	if (rootChroma === undefined || toneChromas.size === 0) return [];

	const bass = window
		? findBassInWindow(rootChroma, toneChromas, window)
		: findLowestRoot(rootChroma);
	if (!bass) return [];

	// Inside a window the whole voicing stays in the box; otherwise the bass
	// root anchors it and the hand reaches four frets up from there.
	const reach = window ?? { start: bass.fret, end: bass.fret + HAND_SPAN };

	const voicing = [noteAt(bass.string, bass.fret)];
	for (let string = bass.string - 1; string >= 0; string--) {
		const fret = lowestToneFret(string, toneChromas, reach);
		if (fret !== null) voicing.push(noteAt(string, fret));
	}
	return voicing;
}

/** Lowest fret on the low E or A string that gives the root — the bass note. */
function findLowestRoot(rootChroma: number): { string: number; fret: number } | null {
	let best: { string: number; fret: number } | null = null;
	for (const string of BASS_STRINGS) {
		for (let fret = 0; fret < 12; fret++) {
			if (Note.chroma(strings[string][fret]) !== rootChroma) continue;
			// Lowest fret wins; a tie goes to the lower string (fatter, darker bass).
			if (!best || fret < best.fret) best = { string, fret };
			break;
		}
	}
	return best;
}

/**
 * Lowest-pitched root inside the window. Falls back to the lowest chord tone
 * for windows that happen to contain no root at all, so a box always plays
 * something rather than falling silent.
 */
function findBassInWindow(
	rootChroma: number,
	toneChromas: Set<number>,
	window: FretWindow
): { string: number; fret: number } | null {
	let fallback: { string: number; fret: number } | null = null;
	for (let string = strings.length - 1; string >= 0; string--) {
		const rootFret = lowestToneFret(string, new Set([rootChroma]), window);
		if (rootFret !== null) return { string, fret: rootFret };
		if (fallback) continue;
		const toneFret = lowestToneFret(string, toneChromas, window);
		if (toneFret !== null) fallback = { string, fret: toneFret };
	}
	return fallback;
}

function lowestToneFret(string: number, chromas: Set<number>, window: FretWindow): number | null {
	const start = Math.max(0, window.start);
	const end = Math.min(window.end, strings[string].length - 1);
	for (let fret = start; fret <= end; fret++) {
		const chroma = Note.chroma(strings[string][fret]);
		if (chroma !== undefined && chromas.has(chroma)) return fret;
	}
	return null;
}

function noteAt(string: number, fret: number): VoicingNote {
	return { string, fret, pitch: stringPitches[string][fret] };
}
