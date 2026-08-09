import { Key, Chord, Scale } from 'tonal';
import { convertFlatToSharp } from '$lib/music';

export const diatonicKeys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export type DiatonicMode = 'major' | 'minor';

export const romanNumeralsMajor = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];
export const romanNumeralsMinor = ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'];

export interface DiatonicChord {
	roman: string;
	name: string;
}

export function getDiatonicChords(root: string, mode: DiatonicMode): DiatonicChord[] {
	try {
		const chords =
			mode === 'major' ? Key.majorKey(root).chords : Key.minorKey(root).natural.chords;
		const romans = mode === 'major' ? romanNumeralsMajor : romanNumeralsMinor;
		return chords.map((name: string, i: number) => ({
			roman: romans[i] ?? String(i + 1),
			name
		}));
	} catch {
		return [];
	}
}

export function getScaleNotes(root: string, mode: DiatonicMode): string[] {
	const scaleName = mode === 'major' ? 'major' : 'minor';
	return Scale.get(`${root} ${scaleName}`).notes.map(convertFlatToSharp);
}

/**
 * Notes of a diatonic chord by name (e.g. "Am", "Bdim"), root first — what
 * "Play chord" strums. Empty when nothing is selected.
 */
export function getChordTones(chordName: string | null): string[] {
	if (!chordName) return [];
	return Chord.get(chordName).notes.map(convertFlatToSharp);
}

export function getDiatonicNoteClass(
	note: string,
	selectedChord: string | null,
	scaleNotes: string[]
): string {
	if (selectedChord) {
		const chordTones = getChordTones(selectedChord);
		if (chordTones.includes(note)) return 'in-scale tonic';
		if (scaleNotes.includes(note)) return 'in-scale';
		return 'hide-note';
	}
	if (scaleNotes.includes(note)) return 'in-scale';
	return 'hide-note';
}
