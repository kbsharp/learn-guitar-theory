import { describe, it, expect } from 'vitest';
import { convertFlatToSharp, convertFlatsToSharps } from './music';

describe('convertFlatToSharp', () => {
	it('converts all standard flat enharmonics', () => {
		expect(convertFlatToSharp('Ab')).toBe('G#');
		expect(convertFlatToSharp('Bb')).toBe('A#');
		expect(convertFlatToSharp('Db')).toBe('C#');
		expect(convertFlatToSharp('Eb')).toBe('D#');
		expect(convertFlatToSharp('Gb')).toBe('F#');
	});

	it('handles edge-case enharmonics (Cb, Fb, double-flats)', () => {
		expect(convertFlatToSharp('Cb')).toBe('B');
		expect(convertFlatToSharp('Fb')).toBe('E');
		expect(convertFlatToSharp('Bbb')).toBe('A#');
		expect(convertFlatToSharp('Ebb')).toBe('D#');
	});

	it('passes natural notes through unchanged', () => {
		for (const n of ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']) {
			expect(convertFlatToSharp(n)).toBe(n);
		}
	});
});

describe('convertFlatsToSharps', () => {
	it('maps an array of mixed notes', () => {
		expect(convertFlatsToSharps(['C', 'Eb', 'G', 'Bb'])).toEqual(['C', 'D#', 'G', 'A#']);
	});

	it('returns empty array for empty input', () => {
		expect(convertFlatsToSharps([])).toEqual([]);
	});
});
