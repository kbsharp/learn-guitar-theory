import { Chord, Scale } from 'tonal';
import { convertFlatToSharp } from '$lib/music';

export const chordRoots = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export type ChordType = 'maj7' | '7' | 'm7' | 'm7b5' | 'maj' | 'm' | 'dim';

export const chordTypes: ChordType[] = ['maj7', '7', 'm7', 'm7b5', 'maj', 'm', 'dim'];

export const chordTypeLabels: Record<ChordType, string> = {
	maj7: 'Maj7',
	'7': 'Dom7',
	m7: 'm7',
	m7b5: 'm7♭5',
	maj: 'Major',
	m: 'Minor',
	dim: 'Dim'
};

const chordToScale: Record<ChordType, string> = {
	maj7: 'lydian',
	'7': 'mixolydian',
	m7: 'dorian',
	m7b5: 'locrian',
	maj: 'major pentatonic',
	m: 'minor pentatonic',
	dim: 'diminished'
};

/**
 * The notes of the chord itself, root first — what "Play chord" strums, and
 * what gets the chord-tone highlight on the board.
 */
export function getChordNotes(root: string, chordType: ChordType): string[] {
	return Chord.get(`${root}${chordType}`).notes.map(convertFlatToSharp);
}

export function getChordScaleClass(note: string, root: string, chordType: ChordType): string {
	const chordNotes = getChordNotes(root, chordType);
	const scaleType = chordToScale[chordType];
	const scaleNotes = Scale.get(`${root} ${scaleType}`).notes.map(convertFlatToSharp);

	if (chordNotes.includes(note)) return 'in-scale tonic';
	if (scaleNotes.includes(note)) return 'in-scale';
	return 'hide-note';
}

export function getChordName(root: string, chordType: ChordType): string {
	return `${root}${chordTypeLabels[chordType]}`;
}

export function getRecommendedScaleName(chordType: ChordType): string {
	const names: Record<ChordType, string> = {
		maj7: 'Lydian',
		'7': 'Mixolydian',
		m7: 'Dorian',
		m7b5: 'Locrian',
		maj: 'Major Pentatonic',
		m: 'Minor Pentatonic',
		dim: 'Diminished'
	};
	return names[chordType];
}
