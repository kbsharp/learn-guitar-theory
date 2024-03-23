import { Scale } from 'tonal';

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
	Major = 'major',
	Minor = 'minor',
	Diminished = 'diminished',
	Mixolydian = 'mixolydian'
}

export const qualities: Quality[] = [
	Quality.Major,
	Quality.Minor,
	Quality.Diminished,
	Quality.Mixolydian
];

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
	let inScale = false;

	const isTonic = tonic === note;

	for (const scale of majorScales) {
		if (currentScale === scale) {
			inScale = incluesNoteInScale(note, Scale.get(`${scale} ${quality}`).notes);
		}
	}

	if (inScale && isTonic) return 'in-scale tonic';
	if (inScale) return 'in-scale';

	return 'hide-note';
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
	console.log(notes);

	return notes.map((note) => convertFlatToSharp(note));
}

function incluesNoteInScale(note: string, notes: string[]) {
	return convertFlatsToSharps(notes).includes(note);
}
