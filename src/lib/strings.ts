import { Range } from 'tonal';

function removeOctaves(notes: string[]) {
	return notes.map((note) => note.replace(/[0-9]/g, ''));
}

// Full pitches with octave (e.g. "E2", "F2", "F#2") — used for audio playback.
const EStringPitches = Range.chromatic(['E2', 'E4'], { sharps: true });
const AStringPitches = Range.chromatic(['A2', 'A4'], { sharps: true });
const DStringPitches = Range.chromatic(['D3', 'D5'], { sharps: true });
const GStringPitches = Range.chromatic(['G3', 'G5'], { sharps: true });
const BStringPitches = Range.chromatic(['B3', 'B5'], { sharps: true });
const eStringPitches = Range.chromatic(['E4', 'E6'], { sharps: true });

// Indexed high-e (0) → low-E (5) to match the fretboard layout used by Strings.svelte.
export const stringPitches = [
	eStringPitches,
	BStringPitches,
	GStringPitches,
	DStringPitches,
	AStringPitches,
	EStringPitches
];

// Display names (no octave) — what gets passed to getNoteClass / getNoteLabel callbacks.
export const strings = stringPitches.map(removeOctaves);
