import { describe, it, expect } from 'vitest';
import { Scale, Note } from 'tonal';
import { convertFlatsToSharps } from '$lib/music';
import { scaleComparisons } from './comparisons';
import { Quality, noteAtSemitones } from './helpers';

const qualities = Object.values(Quality);

/** Semitone offsets from the root that a scale actually contains, in C. */
function semitonesOf(quality: Quality): number[] {
	return convertFlatsToSharps(Scale.get(`C ${quality}`).notes).map(
		(note) => Note.chroma(note) as number
	);
}

describe('scaleComparisons', () => {
	it('pairs every quality the Explorer offers', () => {
		qualities.forEach((quality) => expect(scaleComparisons[quality]).toBeDefined());
	});

	it('never compares a scale against itself', () => {
		qualities.forEach((quality) => expect(scaleComparisons[quality].against).not.toBe(quality));
	});

	// The whole exercise is a lie if the flagged note isn't actually in the
	// scale being flagged — these two assertions are what a wrong semitone
	// number trips over.
	it('flags a note the scale really contains', () => {
		qualities.forEach((quality) => {
			expect(semitonesOf(quality)).toContain(scaleComparisons[quality].characteristic);
		});
	});

	it('flags a note the reference scale does not contain', () => {
		qualities.forEach((quality) => {
			const { against, characteristic } = scaleComparisons[quality];
			expect(semitonesOf(against)).not.toContain(characteristic);
		});
	});

	it('points at where that degree sits in the reference scale', () => {
		qualities.forEach((quality) => {
			const { against, reference } = scaleComparisons[quality];
			if (reference === null) return;
			expect(semitonesOf(against)).toContain(reference);
		});
	});

	it('moves the characteristic note by a single fret', () => {
		qualities.forEach((quality) => {
			const { characteristic, reference } = scaleComparisons[quality];
			if (reference === null) return;
			expect(Math.abs(characteristic - reference)).toBe(1);
		});
	});

	it('has only the blue note added rather than moved', () => {
		// Blues is minor pentatonic plus one note, so there is no note in the
		// reference to move — it's the one pair where `reference` is null.
		const nullReferences = qualities.filter((q) => scaleComparisons[q].reference === null);
		expect(nullReferences).toEqual([Quality.Blues]);
	});

	it('gives every pair copy that says what to listen for', () => {
		qualities.forEach((quality) => {
			expect(scaleComparisons[quality].listenFor.length).toBeGreaterThan(40);
			expect(scaleComparisons[quality].degree).toMatch(/^[♮♭♯][1-7]$/);
		});
	});

	// The board shows whichever variant is selected, so the badge has to name
	// that variant's degree — a label describing the take you aren't hearing
	// is worse than no label.
	it('labels both sides of the pair, and only where a note exists', () => {
		qualities.forEach((quality) => {
			const { referenceDegree, reference } = scaleComparisons[quality];
			if (reference === null) {
				expect(referenceDegree).toBeNull();
				return;
			}
			expect(referenceDegree).toMatch(/^[♮♭♯][1-7]$/);
			// Same degree number on both sides — only the accidental moves.
			expect(referenceDegree?.slice(1)).toBe(scaleComparisons[quality].degree.slice(1));
		});
	});
});

describe('noteAtSemitones', () => {
	it('names the characteristic note of each pair on the fretboard', () => {
		// D Dorian's ♮6 is B; A Aeolian's ♭6 is F.
		expect(noteAtSemitones('D', scaleComparisons[Quality.Dorian].characteristic)).toBe('B');
		expect(noteAtSemitones('A', scaleComparisons[Quality.Aeolian].characteristic)).toBe('F');
		expect(noteAtSemitones('C', scaleComparisons[Quality.Lydian].characteristic)).toBe('F#');
	});

	it('wraps past the octave in sharps', () => {
		expect(noteAtSemitones('A#', 3)).toBe('C#');
		expect(noteAtSemitones('B', 1)).toBe('C');
		expect(noteAtSemitones('C', 0)).toBe('C');
	});

	it('agrees with the scale it was derived from', () => {
		qualities.forEach((quality) => {
			const scaleNotes = convertFlatsToSharps(Scale.get(`G ${quality}`).notes);
			expect(scaleNotes).toContain(
				noteAtSemitones('G', scaleComparisons[quality].characteristic)
			);
		});
	});
});
