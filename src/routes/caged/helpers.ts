export const cagedRoots = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export type CAGEDQuality = 'major' | 'minor';

export interface CAGEDShape {
	name: string;
	fret: number;
}

const SHAPE_OFFSETS: Record<string, number> = { E: 0, D: 2, C: 4, A: 7, G: 9 };
const ROOT_FRETS: Record<string, number> = {
	C: 8,
	'C#': 9,
	D: 10,
	'D#': 11,
	E: 0,
	F: 1,
	'F#': 2,
	G: 3,
	'G#': 4,
	A: 5,
	'A#': 6,
	B: 7
};
const ALL_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export function computeCAGEDShapes(root: string): CAGEDShape[] {
	const rootFret = ROOT_FRETS[root] ?? 0;
	return Object.entries(SHAPE_OFFSETS)
		.map(([name, offset]) => ({ name, fret: (rootFret + offset) % 12 }))
		.sort((a, b) => a.fret - b.fret);
}

export function getChordTones(root: string, quality: CAGEDQuality): string[] {
	const rootIdx = ALL_NOTES.indexOf(root);
	if (rootIdx === -1) return [];
	const thirdInterval = quality === 'major' ? 4 : 3;
	return [
		ALL_NOTES[rootIdx],
		ALL_NOTES[(rootIdx + thirdInterval) % 12],
		ALL_NOTES[(rootIdx + 7) % 12]
	];
}

export function getCAGEDNoteClass(note: string, root: string, chordTones: string[]): string {
	if (note === root) return 'in-scale tonic';
	if (chordTones.includes(note)) return 'in-scale';
	return 'hide-note';
}
