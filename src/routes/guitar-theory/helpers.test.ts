import { describe, it, expect } from 'vitest';
import {
	currentTonic,
	getClassName,
	getScaleDegree,
	computeScalePositions,
	Key,
	Quality
} from './helpers';

describe('currentTonic', () => {
	it('returns the sharp equivalent for flat keys', () => {
		expect(currentTonic(Key.Ab)).toBe('G#');
		expect(currentTonic(Key.Bb)).toBe('A#');
		expect(currentTonic(Key.Db)).toBe('C#');
		expect(currentTonic(Key.Eb)).toBe('D#');
		expect(currentTonic(Key.Gb)).toBe('F#');
	});

	it('returns the key unchanged for natural and sharp keys', () => {
		expect(currentTonic(Key.C)).toBe('C');
		expect(currentTonic(Key.G)).toBe('G');
		expect(currentTonic(Key.E)).toBe('E');
	});
});

describe('getScaleDegree', () => {
	it('labels scale degrees relative to C', () => {
		expect(getScaleDegree('C', 'C')).toBe('1');
		expect(getScaleDegree('D', 'C')).toBe('2');
		expect(getScaleDegree('E', 'C')).toBe('3');
		expect(getScaleDegree('F', 'C')).toBe('4');
		expect(getScaleDegree('G', 'C')).toBe('5');
		expect(getScaleDegree('A', 'C')).toBe('6');
		expect(getScaleDegree('B', 'C')).toBe('7');
	});

	it('labels chromatic degrees correctly', () => {
		expect(getScaleDegree('C#', 'C')).toBe('b2');
		expect(getScaleDegree('D#', 'C')).toBe('b3');
		expect(getScaleDegree('F#', 'C')).toBe('b5');
		expect(getScaleDegree('G#', 'C')).toBe('b6');
		expect(getScaleDegree('A#', 'C')).toBe('b7');
	});

	it('wraps correctly when tonic is not C', () => {
		expect(getScaleDegree('G', 'G')).toBe('1');
		expect(getScaleDegree('A', 'G')).toBe('2');
		expect(getScaleDegree('F#', 'G')).toBe('7');
	});
});

describe('getClassName', () => {
	it('returns "in-scale tonic" for the tonic note', () => {
		expect(getClassName('C', Key.C, 'C', Quality.Ionian)).toBe('in-scale tonic');
	});

	it('returns "in-scale" for non-tonic scale notes', () => {
		expect(getClassName('G', Key.C, 'C', Quality.Ionian)).toBe('in-scale');
		expect(getClassName('E', Key.C, 'C', Quality.Ionian)).toBe('in-scale');
	});

	it('returns "hide-note" for notes outside the scale', () => {
		expect(getClassName('F#', Key.C, 'C', Quality.Ionian)).toBe('hide-note');
		expect(getClassName('A#', Key.C, 'C', Quality.Ionian)).toBe('hide-note');
	});

	it('handles minor pentatonic correctly', () => {
		// A minor pentatonic: A C D E G
		expect(getClassName('A', Key.A, 'A', Quality.MinorPentatonic)).toBe('in-scale tonic');
		expect(getClassName('C', Key.A, 'A', Quality.MinorPentatonic)).toBe('in-scale');
		expect(getClassName('B', Key.A, 'A', Quality.MinorPentatonic)).toBe('hide-note');
	});
});

describe('computeScalePositions', () => {
	it('returns 7 positions for C major', () => {
		const positions = computeScalePositions(Key.C, Quality.Ionian);
		expect(positions).toHaveLength(7);
	});

	it('returns 5 positions for minor pentatonic', () => {
		const positions = computeScalePositions(Key.A, Quality.MinorPentatonic);
		expect(positions).toHaveLength(5);
	});

	it('positions are numbered sequentially from 1', () => {
		const positions = computeScalePositions(Key.C, Quality.Ionian);
		positions.forEach((p, i) => expect(p.number).toBe(i + 1));
	});

	it('each position spans 4 frets', () => {
		const positions = computeScalePositions(Key.G, Quality.Ionian);
		positions.forEach((p) => expect(p.endFret - p.startFret).toBe(4));
	});

	it('positions start at or after the tonic fret on low E', () => {
		// E key: tonic is on fret 0 of low E string
		const positions = computeScalePositions(Key.E, Quality.Ionian);
		expect(positions[0].startFret).toBeGreaterThanOrEqual(0);
	});
});
