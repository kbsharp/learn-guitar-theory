import { Key, Chord, Scale } from 'tonal';

export const diatonicKeys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export type DiatonicMode = 'major' | 'minor';

export const romanNumeralsMajor = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];
export const romanNumeralsMinor = ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'];

export interface DiatonicChord {
	roman: string;
	name: string;
}

function convertFlatToSharp(note: string): string {
	switch (note) {
		case 'Ab': return 'G#';
		case 'Bb': return 'A#';
		case 'Bbb': return 'A#';
		case 'Cb': return 'B';
		case 'Db': return 'C#';
		case 'Eb': return 'D#';
		case 'Ebb': return 'D#';
		case 'Fb': return 'E';
		case 'Gb': return 'F#';
		default: return note;
	}
}

export function getDiatonicChords(root: string, mode: DiatonicMode): DiatonicChord[] {
	try {
		const chords =
			mode === 'major' ? Key.majorKey(root).chords : Key.minorKey(root).natural.chords;
		const romans = mode === 'major' ? romanNumeralsMajor : romanNumeralsMinor;
		return chords.map((name: string, i: number) => ({ roman: romans[i] ?? String(i + 1), name }));
	} catch {
		return [];
	}
}

export function getScaleNotes(root: string, mode: DiatonicMode): string[] {
	const scaleName = mode === 'major' ? 'major' : 'minor';
	return Scale.get(`${root} ${scaleName}`).notes.map(convertFlatToSharp);
}

export function getDiatonicNoteClass(
	note: string,
	selectedChord: string | null,
	scaleNotes: string[]
): string {
	if (selectedChord) {
		const chordTones = Chord.get(selectedChord).notes.map(convertFlatToSharp);
		if (chordTones.includes(note)) return 'in-scale tonic';
		if (scaleNotes.includes(note)) return 'in-scale';
		return 'hide-note';
	}
	if (scaleNotes.includes(note)) return 'in-scale';
	return 'hide-note';
}
