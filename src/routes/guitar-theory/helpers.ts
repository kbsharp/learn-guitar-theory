import { Scale, Note } from 'tonal';
import { convertFlatToSharp, convertFlatsToSharps } from '$lib/music';
import { strings, stringPitches } from '$lib/strings';

const LOW_E = ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#'];
const CHROMATIC = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const frets = new Array(25).fill(null);

export enum Key {
	Ab = 'Ab',
	A = 'A',
	Bb = 'Bb',
	B = 'B',
	C = 'C',
	Db = 'Db',
	D = 'D',
	Eb = 'Eb',
	E = 'E',
	F = 'F',
	Gb = 'Gb',
	G = 'G'
}

export const majorScales: Key[] = [
	Key.Ab,
	Key.A,
	Key.Bb,
	Key.B,
	Key.C,
	Key.Db,
	Key.D,
	Key.Eb,
	Key.E,
	Key.F,
	Key.Gb,
	Key.G
];

export enum Quality {
	// Modes
	Ionian = 'major',
	Dorian = 'dorian',
	Phrygian = 'phrygian',
	Lydian = 'lydian',
	Mixolydian = 'mixolydian',
	Aeolian = 'minor',
	Locrian = 'locrian',
	// Pentatonic & Blues
	MajorPentatonic = 'major pentatonic',
	MinorPentatonic = 'minor pentatonic',
	Blues = 'blues'
}

export const modes: Quality[] = [
	Quality.Ionian,
	Quality.Dorian,
	Quality.Phrygian,
	Quality.Lydian,
	Quality.Mixolydian,
	Quality.Aeolian,
	Quality.Locrian
];

export const pentatonics: Quality[] = [
	Quality.MajorPentatonic,
	Quality.MinorPentatonic,
	Quality.Blues
];

export const qualityLabels: Record<Quality, string> = {
	[Quality.Ionian]: 'Ionian',
	[Quality.Dorian]: 'Dorian',
	[Quality.Phrygian]: 'Phrygian',
	[Quality.Lydian]: 'Lydian',
	[Quality.Mixolydian]: 'Mixolydian',
	[Quality.Aeolian]: 'Aeolian',
	[Quality.Locrian]: 'Locrian',
	[Quality.MajorPentatonic]: 'Maj Penta',
	[Quality.MinorPentatonic]: 'Min Penta',
	[Quality.Blues]: 'Blues'
};

export function currentTonic(currentScale: Key): string {
	switch (currentScale) {
		case Key.Ab:
			return 'G#';
		case Key.Bb:
			return 'A#';
		case Key.Db:
			return 'C#';
		case Key.Eb:
			return 'D#';
		case Key.Gb:
			return 'F#';
		default:
			return currentScale;
	}
}

export function getClassName(note: string, currentScale: Key, tonic: string, quality: Quality) {
	const isTonic = tonic === note;
	const inScale = incluesNoteInScale(note, Scale.get(`${currentScale} ${quality}`).notes);

	if (inScale && isTonic) return 'in-scale tonic';
	if (inScale) return 'in-scale';
	return 'hide-note';
}

export function getScaleDegree(note: string, tonic: string): string {
	const labels = ['1', 'b2', '2', 'b3', '3', '4', 'b5', '5', 'b6', '6', 'b7', '7'];
	const tonicChroma = Note.chroma(tonic);
	const noteChroma = Note.chroma(note);
	if (tonicChroma === undefined || noteChroma === undefined) return note;
	const semitones = (noteChroma - tonicChroma + 12) % 12;
	return labels[semitones];
}

/**
 * The note a given number of semitones above a root, named in sharps to match
 * the fretboard. The inverse of `getScaleDegree` — used to locate a scale's
 * characteristic note (Dorian's ♮6 is 9 semitones up) so it can be flagged on
 * the board.
 */
export function noteAtSemitones(tonic: string, semitones: number): string {
	const chroma = Note.chroma(tonic);
	if (chroma === undefined) return tonic;
	return CHROMATIC[(((chroma + semitones) % 12) + 12) % 12];
}

export { convertFlatToSharp } from '$lib/music';

function incluesNoteInScale(note: string, notes: string[]) {
	return convertFlatsToSharps(notes).includes(note);
}

export interface ScalePosition {
	number: number;
	startFret: number;
	endFret: number;
}

export function computeScalePositions(key: Key, quality: Quality): ScalePosition[] {
	const tonic = currentTonic(key);
	const scaleNotes = Scale.get(`${key} ${quality}`).notes.map(convertFlatToSharp);
	const tonicFret = LOW_E.indexOf(tonic);
	if (tonicFret === -1) return [];

	const anchors: number[] = [];
	for (let fret = tonicFret; anchors.length < scaleNotes.length && fret <= 24; fret++) {
		if (scaleNotes.includes(LOW_E[fret % 12])) {
			anchors.push(fret);
		}
	}

	return anchors.map((startFret, i) => ({
		number: i + 1,
		startFret,
		endFret: startFret + 4
	}));
}

export interface ScaleRunNote {
	/** String index — 0 is high e, 5 is low E (matches Strings.svelte). */
	string: number;
	fret: number;
	/** Pitch with octave, e.g. "E2" — what gets sent to the sampler. */
	pitch: string;
}

/**
 * Build a playable ascending run of the scale inside one 4-fret box.
 *
 * Hearing a scale as an abstract list of pitches teaches nothing about the
 * neck — the point is to hear the shape you're looking at. So the run walks
 * the real string/fret positions inside the window, lowest pitch to highest,
 * and is trimmed root-to-root so the scale resolves instead of stopping
 * somewhere arbitrary.
 *
 * With no position selected we run position 1 (the box anchored on the lowest
 * tonic on the low E string) rather than the whole 24 frets.
 */
export function computeScaleRun(
	key: Key,
	quality: Quality,
	positionRange: { start: number; end: number } | null
): ScaleRunNote[] {
	const scaleNotes = Scale.get(`${key} ${quality}`).notes.map(convertFlatToSharp);
	if (!scaleNotes.length) return [];

	const fallback = computeScalePositions(key, quality)[0];
	const start = positionRange ? positionRange.start : (fallback?.startFret ?? 0);
	const end = positionRange ? positionRange.end : (fallback?.endFret ?? 4);

	const candidates: (ScaleRunNote & { midi: number })[] = [];
	for (let s = 0; s < strings.length; s++) {
		const lastFret = Math.min(end, strings[s].length - 1);
		for (let f = Math.max(0, start); f <= lastFret; f++) {
			if (!scaleNotes.includes(strings[s][f])) continue;
			const pitch = stringPitches[s][f];
			const midi = Note.midi(pitch);
			if (midi === null) continue;
			candidates.push({ string: s, fret: f, pitch, midi });
		}
	}

	// Ascending by pitch. Unisons (the same pitch available on two strings)
	// collapse to the lower string — the one your hand reaches first on the
	// way up the box.
	candidates.sort((a, b) => a.midi - b.midi || b.string - a.string);
	const ascending: typeof candidates = [];
	for (const note of candidates) {
		if (ascending.length && ascending[ascending.length - 1].midi === note.midi) continue;
		ascending.push(note);
	}

	const tonicChroma = Note.chroma(currentTonic(key));
	const roots = ascending.reduce<number[]>((acc, note, i) => {
		if (Note.chroma(note.pitch) === tonicChroma) acc.push(i);
		return acc;
	}, []);
	const run =
		roots.length >= 2 ? ascending.slice(roots[0], roots[roots.length - 1] + 1) : ascending;

	return run.map(({ string, fret, pitch }) => ({ string, fret, pitch }));
}
