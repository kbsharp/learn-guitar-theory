import { describe, it, expect } from 'vitest';
import { computeCAGEDShapes, getChordTones, getCAGEDNoteClass } from './helpers';

describe('computeCAGEDShapes', () => {
	it('returns exactly 5 shapes', () => {
		expect(computeCAGEDShapes('C')).toHaveLength(5);
		expect(computeCAGEDShapes('E')).toHaveLength(5);
		expect(computeCAGEDShapes('G#')).toHaveLength(5);
	});

	it('shapes are sorted by ascending fret number', () => {
		const shapes = computeCAGEDShapes('C');
		for (let i = 1; i < shapes.length; i++) {
			expect(shapes[i].fret).toBeGreaterThanOrEqual(shapes[i - 1].fret);
		}
	});

	it('E root: E shape is on fret 0', () => {
		const shapes = computeCAGEDShapes('E');
		const eShape = shapes.find((s) => s.name === 'E');
		expect(eShape?.fret).toBe(0);
	});

	it('all fret numbers are within 0–11 (modulo 12)', () => {
		for (const root of ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']) {
			computeCAGEDShapes(root).forEach((s) => {
				expect(s.fret).toBeGreaterThanOrEqual(0);
				expect(s.fret).toBeLessThan(12);
			});
		}
	});
});

describe('getChordTones', () => {
	it('C major: C E G', () => {
		expect(getChordTones('C', 'major')).toEqual(['C', 'E', 'G']);
	});

	it('C minor: C D# G', () => {
		expect(getChordTones('C', 'minor')).toEqual(['C', 'D#', 'G']);
	});

	it('A major: A C# E', () => {
		expect(getChordTones('A', 'major')).toEqual(['A', 'C#', 'E']);
	});

	it('G major: G B D', () => {
		expect(getChordTones('G', 'major')).toEqual(['G', 'B', 'D']);
	});

	it('returns empty for unknown root', () => {
		expect(getChordTones('Z', 'major')).toEqual([]);
	});
});

describe('getCAGEDNoteClass', () => {
	const cMajorTones = ['C', 'E', 'G'];

	it('returns "in-scale tonic" for the root note', () => {
		expect(getCAGEDNoteClass('C', 'C', cMajorTones)).toBe('in-scale tonic');
	});

	it('returns "in-scale" for non-root chord tones', () => {
		expect(getCAGEDNoteClass('E', 'C', cMajorTones)).toBe('in-scale');
		expect(getCAGEDNoteClass('G', 'C', cMajorTones)).toBe('in-scale');
	});

	it('returns "hide-note" for notes outside the chord', () => {
		expect(getCAGEDNoteClass('D', 'C', cMajorTones)).toBe('hide-note');
		expect(getCAGEDNoteClass('F#', 'C', cMajorTones)).toBe('hide-note');
	});
});
