import { describe, it, expect } from 'vitest';
import { getDiatonicChords, getScaleNotes, getDiatonicNoteClass } from './helpers';

describe('getDiatonicChords', () => {
	it('returns 7 chords for C major', () => {
		const chords = getDiatonicChords('C', 'major');
		expect(chords).toHaveLength(7);
	});

	it('assigns correct roman numerals for major', () => {
		const chords = getDiatonicChords('C', 'major');
		const romans = chords.map((c) => c.roman);
		expect(romans).toEqual(['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°']);
	});

	it('assigns correct roman numerals for minor', () => {
		const chords = getDiatonicChords('A', 'minor');
		const romans = chords.map((c) => c.roman);
		expect(romans).toEqual(['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII']);
	});

	it('returns chord names as strings', () => {
		const chords = getDiatonicChords('G', 'major');
		chords.forEach((c) => expect(typeof c.name).toBe('string'));
	});

	it('returns empty array for invalid root', () => {
		const chords = getDiatonicChords('Z', 'major');
		expect(chords).toEqual([]);
	});
});

describe('getScaleNotes', () => {
	it('returns 7 notes for C major', () => {
		const notes = getScaleNotes('C', 'major');
		expect(notes).toHaveLength(7);
	});

	it('returns all sharps (no flats) for C major', () => {
		const notes = getScaleNotes('C', 'major');
		expect(notes).toEqual(['C', 'D', 'E', 'F', 'G', 'A', 'B']);
	});

	it('converts flats to sharps in the output', () => {
		// Bb major scale contains Bb, Eb — should come back as A#, D#
		const notes = getScaleNotes('A#', 'major');
		notes.forEach((n) => expect(n).not.toMatch(/b/));
	});

	it('returns 7 notes for A minor', () => {
		const notes = getScaleNotes('A', 'minor');
		expect(notes).toHaveLength(7);
		expect(notes).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G']);
	});
});

describe('getDiatonicNoteClass', () => {
	const cMajorNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

	it('returns "in-scale" for scale notes when no chord is selected', () => {
		expect(getDiatonicNoteClass('C', null, cMajorNotes)).toBe('in-scale');
		expect(getDiatonicNoteClass('G', null, cMajorNotes)).toBe('in-scale');
	});

	it('returns "hide-note" for non-scale notes when no chord is selected', () => {
		expect(getDiatonicNoteClass('F#', null, cMajorNotes)).toBe('hide-note');
		expect(getDiatonicNoteClass('A#', null, cMajorNotes)).toBe('hide-note');
	});

	it('returns "in-scale tonic" for chord tones when a chord is selected', () => {
		// Cmaj7 chord tones: C E G B
		expect(getDiatonicNoteClass('C', 'Cmaj7', cMajorNotes)).toBe('in-scale tonic');
		expect(getDiatonicNoteClass('E', 'Cmaj7', cMajorNotes)).toBe('in-scale tonic');
	});

	it('returns "in-scale" for scale notes that are not chord tones', () => {
		expect(getDiatonicNoteClass('D', 'Cmaj7', cMajorNotes)).toBe('in-scale');
		expect(getDiatonicNoteClass('F', 'Cmaj7', cMajorNotes)).toBe('in-scale');
	});

	it('returns "hide-note" for non-scale notes even when chord is selected', () => {
		expect(getDiatonicNoteClass('F#', 'Cmaj7', cMajorNotes)).toBe('hide-note');
	});
});
