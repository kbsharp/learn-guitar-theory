import { Scale, Note } from 'tonal';

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

export function convertFlatToSharp(note: string): string {
	switch (note) {
		case 'Ab':
			return 'G#';
		case 'Bb':
		case 'Bbb':
			return 'A#';
		case 'Cb':
			return 'B';
		case 'Db':
			return 'C#';
		case 'Eb':
		case 'Ebb':
			return 'D#';
		case 'Gb':
			return 'F#';
		default:
			return note;
	}
}

function convertFlatsToSharps(notes: string[]) {
	return notes.map((note) => convertFlatToSharp(note));
}

function incluesNoteInScale(note: string, notes: string[]) {
	return convertFlatsToSharps(notes).includes(note);
}
