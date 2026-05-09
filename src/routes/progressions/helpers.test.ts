import { describe, it, expect } from 'vitest';
import {
	getSlotChord,
	getFunctionLabel,
	formatRoman,
	getBorrowedChords,
	getProgressionNoteClass,
	PRESETS
} from './helpers';

describe('formatRoman', () => {
	it('converts ASCII b prefix to Unicode flat', () => {
		expect(formatRoman('bVII')).toBe('♭VII');
		expect(formatRoman('bVI')).toBe('♭VI');
	});

	it('leaves diatonic numerals unchanged', () => {
		expect(formatRoman('I')).toBe('I');
		expect(formatRoman('ii')).toBe('ii');
		expect(formatRoman('IV')).toBe('IV');
		expect(formatRoman('vii°')).toBe('vii°');
	});
});

describe('getFunctionLabel', () => {
	it('labels tonic chords as T', () => {
		expect(getFunctionLabel('I')).toBe('T');
		expect(getFunctionLabel('i')).toBe('T');
		expect(getFunctionLabel('iii')).toBe('T');
		expect(getFunctionLabel('vi')).toBe('T');
	});

	it('labels pre-dominant chords as PD', () => {
		expect(getFunctionLabel('ii')).toBe('PD');
		expect(getFunctionLabel('IV')).toBe('PD');
		expect(getFunctionLabel('iv')).toBe('PD');
		expect(getFunctionLabel('ii°')).toBe('PD');
	});

	it('labels dominant chords as D', () => {
		expect(getFunctionLabel('V')).toBe('D');
		expect(getFunctionLabel('vii°')).toBe('D');
		expect(getFunctionLabel('VII')).toBe('D');
		expect(getFunctionLabel('bVII')).toBe('D');
	});

	it('defaults to T for unknown numerals', () => {
		expect(getFunctionLabel('???')).toBe('T');
	});
});

describe('getBorrowedChords', () => {
	it('returns only major-mode borrowed chords for major', () => {
		const chords = getBorrowedChords('major');
		expect(chords.length).toBeGreaterThan(0);
		chords.forEach((c) => expect(c.forMode).toBe('major'));
	});

	it('returns only minor-mode borrowed chords for minor', () => {
		const chords = getBorrowedChords('minor');
		expect(chords.length).toBeGreaterThan(0);
		chords.forEach((c) => expect(c.forMode).toBe('minor'));
	});
});

describe('getSlotChord', () => {
	it('resolves diatonic chords in C major', () => {
		// I in C major should be 'Cmaj7' (Tonal's Key.majorKey output)
		const chord = getSlotChord('I', 'C', 'major');
		expect(chord).toBeTruthy();
		expect(chord).toContain('C');
	});

	it('resolves IV in C major', () => {
		const chord = getSlotChord('IV', 'C', 'major');
		expect(chord).toContain('F');
	});

	it('resolves borrowed bVII in C major (flat 7 = Bb)', () => {
		const chord = getSlotChord('bVII', 'C', 'major');
		expect(chord).toBe('A#');
	});

	it('resolves borrowed bVI in C major (flat 6 = Ab = G#)', () => {
		const chord = getSlotChord('bVI', 'C', 'major');
		expect(chord).toBe('G#');
	});

	it('resolves i in A minor', () => {
		const chord = getSlotChord('i', 'A', 'minor');
		expect(chord).toContain('A');
	});

	it('returns empty string for completely unknown roman', () => {
		const chord = getSlotChord('xXx', 'C', 'major');
		expect(chord).toBe('');
	});
});

describe('getProgressionNoteClass', () => {
	it('returns "in-scale tonic" for chord tones', () => {
		// Cmaj7 in C major — C is a chord tone
		const cls = getProgressionNoteClass('C', 'Cmaj7', 'C', 'major');
		expect(cls).toBe('in-scale tonic');
	});

	it('returns "in-scale" for scale notes that are not chord tones', () => {
		// D is in C major but not in Cmaj7
		const cls = getProgressionNoteClass('D', 'Cmaj7', 'C', 'major');
		expect(cls).toBe('in-scale');
	});

	it('returns "hide-note" for notes outside the key', () => {
		const cls = getProgressionNoteClass('F#', 'Cmaj7', 'C', 'major');
		expect(cls).toBe('hide-note');
	});

	it('treats empty chordName as no selection (shows scale)', () => {
		const cls = getProgressionNoteClass('G', '', 'C', 'major');
		expect(cls).toBe('in-scale');
	});
});

describe('PRESETS', () => {
	it('every preset has required fields', () => {
		PRESETS.forEach((p) => {
			expect(p.name).toBeTruthy();
			expect(p.romans).toHaveLength(4);
			expect(['major', 'minor']).toContain(p.mode);
			expect(p.moods.length).toBeGreaterThan(0);
		});
	});

	it('contains both major and minor presets', () => {
		const modes = new Set(PRESETS.map((p) => p.mode));
		expect(modes.has('major')).toBe(true);
		expect(modes.has('minor')).toBe(true);
	});
});
