import { Scale, Note } from 'tonal';
import { convertFlatToSharp, convertFlatsToSharps } from '$lib/music';

const LOW_E = ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#'];

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
