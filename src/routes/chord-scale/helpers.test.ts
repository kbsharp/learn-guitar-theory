import { describe, it, expect } from 'vitest';
import { getChordScaleClass, getChordName, getRecommendedScaleName, chordTypes } from './helpers';
import type { ChordType } from './helpers';

describe('getChordScaleClass', () => {
	it('returns "in-scale tonic" for chord tones', () => {
		// Cmaj7 chord tones: C E G B
		expect(getChordScaleClass('C', 'C', 'maj7')).toBe('in-scale tonic');
		expect(getChordScaleClass('E', 'C', 'maj7')).toBe('in-scale tonic');
		expect(getChordScaleClass('G', 'C', 'maj7')).toBe('in-scale tonic');
		expect(getChordScaleClass('B', 'C', 'maj7')).toBe('in-scale tonic');
	});

	it('returns "in-scale" for scale notes that are not chord tones', () => {
		// C lydian (for maj7): C D E F# G A B — D and A are scale but not chord tones
		expect(getChordScaleClass('D', 'C', 'maj7')).toBe('in-scale');
		expect(getChordScaleClass('A', 'C', 'maj7')).toBe('in-scale');
	});

	it('returns "hide-note" for notes outside both chord and scale', () => {
		// C lydian has F#, not F — so F is outside
		expect(getChordScaleClass('F', 'C', 'maj7')).toBe('hide-note');
	});

	it('handles dominant 7 (G mixolydian scale)', () => {
		// G7 chord tones: G B D F
		expect(getChordScaleClass('G', 'G', '7')).toBe('in-scale tonic');
		expect(getChordScaleClass('F', 'G', '7')).toBe('in-scale tonic');
		// G mixolydian: G A B C D E F — C is in scale but not chord tone
		expect(getChordScaleClass('C', 'G', '7')).toBe('in-scale');
		// F# is not in G mixolydian
		expect(getChordScaleClass('F#', 'G', '7')).toBe('hide-note');
	});
});

describe('getChordName', () => {
	it('formats chord name with label suffix', () => {
		expect(getChordName('C', 'maj7')).toBe('CMaj7');
		expect(getChordName('G', '7')).toBe('GDom7');
		expect(getChordName('A', 'm7')).toBe('Am7');
		expect(getChordName('B', 'dim')).toBe('BDim');
	});
});

describe('getRecommendedScaleName', () => {
	it('returns a scale name for every chord type', () => {
		const names: ChordType[] = chordTypes;
		names.forEach((ct) => {
			expect(getRecommendedScaleName(ct)).toBeTruthy();
		});
	});

	it('maps known chord types correctly', () => {
		expect(getRecommendedScaleName('maj7')).toBe('Lydian');
		expect(getRecommendedScaleName('7')).toBe('Mixolydian');
		expect(getRecommendedScaleName('m7')).toBe('Dorian');
		expect(getRecommendedScaleName('m7b5')).toBe('Locrian');
		expect(getRecommendedScaleName('maj')).toBe('Major Pentatonic');
		expect(getRecommendedScaleName('m')).toBe('Minor Pentatonic');
		expect(getRecommendedScaleName('dim')).toBe('Diminished');
	});
});
