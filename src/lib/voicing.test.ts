import { describe, it, expect } from 'vitest';
import { Note } from 'tonal';
import { computeChordVoicing, type VoicingNote } from './voicing';
import { strings } from './strings';

/** Voicing as single-digit tab, low E first: "355433", "x" for unplayed strings. */
function toTab(voicing: VoicingNote[]): string {
	const frets = new Array(6).fill('x');
	for (const note of voicing) frets[5 - note.string] = String(note.fret);
	return frets.join('');
}

function chromas(notes: string[]): Set<number> {
	return new Set(notes.map((n) => Note.chroma(n) as number));
}

const C_MAJOR = ['C', 'E', 'G'];
const E_MAJOR = ['E', 'G#', 'B'];
const G_MAJOR = ['G', 'B', 'D'];
const A_MINOR = ['A', 'C', 'E'];
const D_MINOR = ['D', 'F', 'A'];
const F_MAJOR = ['F', 'A', 'C'];

describe('computeChordVoicing — auto position', () => {
	// The rule (root in the bass, lowest chord tone on every string above)
	// should land on the shapes a guitarist already plays. If these break, the
	// voicings have stopped being real guitar chords.
	it('finds the open E shape for E major', () => {
		expect(toTab(computeChordVoicing('E', E_MAJOR))).toBe('022100');
	});

	it('finds the open A minor shape for A minor', () => {
		expect(toTab(computeChordVoicing('A', A_MINOR))).toBe('x02210');
	});

	it('finds the E-shape barre for G major', () => {
		expect(toTab(computeChordVoicing('G', G_MAJOR))).toBe('355433');
	});

	it('finds the A-shape barre for C major', () => {
		expect(toTab(computeChordVoicing('C', C_MAJOR))).toBe('x35553');
	});

	it('voices a 7th chord with all four tones', () => {
		const voicing = computeChordVoicing('C', ['C', 'E', 'G', 'B']);
		expect(chromas(voicing.map((n) => n.pitch))).toEqual(chromas(['C', 'E', 'G', 'B']));
	});

	it('puts the root in the bass', () => {
		const cases: [string, string[]][] = [
			['C', C_MAJOR],
			['E', E_MAJOR],
			['G', G_MAJOR],
			['A', A_MINOR],
			['D', D_MINOR],
			['F', F_MAJOR]
		];
		for (const [root, tones] of cases) {
			expect(Note.chroma(computeChordVoicing(root, tones)[0].pitch)).toBe(Note.chroma(root));
		}
	});

	it('plays only chord tones', () => {
		const allowed = chromas(D_MINOR);
		for (const note of computeChordVoicing('D', D_MINOR)) {
			expect(allowed.has(Note.chroma(note.pitch) as number)).toBe(true);
		}
	});

	it('matches chord tones by pitch class, not spelling', () => {
		// tonal spells some diatonic chords with flats or sharps the fretboard
		// never uses (Bb, E#) — those must still find their frets.
		const flats = computeChordVoicing('Bb', ['Bb', 'D', 'F']);
		expect(toTab(flats)).toBe(toTab(computeChordVoicing('A#', ['A#', 'D', 'F'])));
		expect(flats.length).toBe(5);
	});

	it('returns nothing for an unknown root', () => {
		expect(computeChordVoicing('H', ['H'])).toEqual([]);
	});

	it('spans no more than the hand can reach', () => {
		const frets = computeChordVoicing('F', F_MAJOR).map((n) => n.fret);
		expect(Math.max(...frets) - Math.min(...frets)).toBeLessThanOrEqual(4);
	});

	it('reports the pitch that matches the string and fret', () => {
		for (const note of computeChordVoicing('G', G_MAJOR)) {
			expect(note.pitch.replace(/[0-9]/g, '')).toBe(strings[note.string][note.fret]);
		}
	});
});

describe('computeChordVoicing — inside a window', () => {
	const window = { start: 5, end: 9 };

	it('keeps every note inside the window', () => {
		const voicing = computeChordVoicing('C', C_MAJOR, window);
		expect(voicing.length).toBe(6);
		for (const note of voicing) {
			expect(note.fret).toBeGreaterThanOrEqual(window.start);
			expect(note.fret).toBeLessThanOrEqual(window.end);
		}
	});

	it('takes the lowest root in the window as the bass', () => {
		// C sits at fret 8 of the low E string — the lowest C in frets 5–9.
		expect(computeChordVoicing('C', C_MAJOR, window)[0]).toEqual({
			string: 5,
			fret: 8,
			pitch: 'C3'
		});
	});

	it('reproduces the CAGED D shape when given that box', () => {
		// C major, D shape at fret 10 — the xx0232 pattern moved up the neck.
		expect(computeChordVoicing('C', C_MAJOR, { start: 10, end: 14 })).toEqual([
			{ string: 3, fret: 10, pitch: 'C4' },
			{ string: 2, fret: 12, pitch: 'G4' },
			{ string: 1, fret: 13, pitch: 'C5' },
			{ string: 0, fret: 12, pitch: 'E5' }
		]);
	});

	it('still sounds when the window holds no root', () => {
		// Frets 6–7 hold no C anywhere on the neck, but do hold E.
		const voicing = computeChordVoicing('C', C_MAJOR, { start: 6, end: 7 });
		expect(voicing.length).toBeGreaterThan(0);
		expect(chromas(voicing.map((n) => n.pitch)).has(Note.chroma('C') as number)).toBe(false);
	});
});
