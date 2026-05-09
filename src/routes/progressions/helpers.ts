import { getDiatonicChords, getScaleNotes, getDiatonicNoteClass } from '../diatonic/helpers';

export { getDiatonicChords };
export type { DiatonicMode } from '../diatonic/helpers';

// Circle of fifths — clockwise from C, using sharp notation internally
export const FIFTHS_KEYS    = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F'];
export const FIFTHS_DISPLAY = ['C', 'G', 'D', 'A', 'E', 'B', 'F♯', 'D♭', 'A♭', 'E♭', 'B♭', 'F'];

// Relative minor of each major key at the same circle position
export const RELATIVE_MINOR_KEYS    = ['A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F', 'C', 'G', 'D'];
export const RELATIVE_MINOR_DISPLAY = ['Am', 'Em', 'Bm', 'F♯m', 'C♯m', 'G♯m', 'D♯m', 'A♯m', 'Fm', 'Cm', 'Gm', 'Dm'];

// ─── Mood Tags ───────────────────────────────────────────────────────────────

export type MoodTag =
	| 'Uplifting'
	| 'Dark'
	| 'Melancholic'
	| 'Cinematic'
	| 'Jazzy'
	| 'Bluesy'
	| 'Tense'
	| 'Nostalgic'
	| 'Mysterious';

export const ALL_MOOD_TAGS: MoodTag[] = [
	'Uplifting',
	'Dark',
	'Melancholic',
	'Cinematic',
	'Jazzy',
	'Bluesy',
	'Tense',
	'Nostalgic',
	'Mysterious'
];

// ─── Preset ──────────────────────────────────────────────────────────────────

export interface Preset {
	name: string;
	feel: string;
	mode: 'major' | 'minor';
	romans: [string, string, string, string];
	moods: MoodTag[];
	description: string;
}

export const PRESETS: Preset[] = [
	// ── Major ──────────────────────────────────────────────────────────────────
	{
		name: 'Pop Standard',
		feel: 'Pop',
		mode: 'major',
		romans: ['I', 'V', 'vi', 'IV'],
		moods: ['Uplifting', 'Nostalgic'],
		description:
			'Four chords that cycle through every harmonic function — the most-used loop in modern pop.'
	},
	{
		name: '50s Classic',
		feel: 'Classic',
		mode: 'major',
		romans: ['I', 'vi', 'IV', 'V'],
		moods: ['Nostalgic', 'Uplifting'],
		description:
			"Doo-wop's signature — lands on the relative minor early, giving it a wistful backward glance."
	},
	{
		name: 'Singer-Songwriter',
		feel: 'Folk',
		mode: 'major',
		romans: ['I', 'iii', 'IV', 'V'],
		moods: ['Uplifting', 'Nostalgic'],
		description:
			'The mediant (iii) adds a touch of wistfulness that keeps major from feeling too bright.'
	},
	{
		name: 'Pachelbel Canon',
		feel: 'Classical',
		mode: 'major',
		romans: ['I', 'V', 'vi', 'iii'],
		moods: ['Cinematic', 'Nostalgic'],
		description: 'A descending bass line creates forward momentum even while staying firmly in key.'
	},
	{
		name: 'Jazz ii-V-I',
		feel: 'Jazz',
		mode: 'major',
		romans: ['ii', 'V', 'I', 'I'],
		moods: ['Jazzy'],
		description:
			'The fundamental unit of jazz harmony — pre-dominant building tension that collapses into resolution.'
	},
	{
		name: 'Rhythm Changes',
		feel: 'Jazz',
		mode: 'major',
		romans: ['I', 'vi', 'ii', 'V'],
		moods: ['Jazzy', 'Uplifting'],
		description:
			'The turnaround behind hundreds of jazz standards — constant forward momentum, no resting point.'
	},
	{
		name: 'Classic Rock',
		feel: 'Rock',
		mode: 'major',
		romans: ['I', 'IV', 'V', 'IV'],
		moods: ['Uplifting', 'Bluesy'],
		description: "The three-chord trick — every note is a chord tone of something, nowhere to hide."
	},
	{
		name: 'Mixolydian Drift',
		feel: 'Rock',
		mode: 'major',
		romans: ['I', 'bVII', 'IV', 'I'],
		moods: ['Bluesy', 'Uplifting'],
		description:
			'The borrowed ♭VII avoids the strong dominant pull — feels wide-open and driving without obligation.'
	},
	{
		name: 'Lydian Lift',
		feel: 'Cinematic',
		mode: 'major',
		romans: ['I', 'II', 'I', 'II'],
		moods: ['Cinematic', 'Mysterious'],
		description:
			'The major II chord from Lydian creates a floating, hovering quality — science-fiction territory.'
	},
	// ── Minor ──────────────────────────────────────────────────────────────────
	{
		name: 'Minor Ballad',
		feel: 'Ballad',
		mode: 'minor',
		romans: ['i', 'VI', 'III', 'VII'],
		moods: ['Melancholic', 'Cinematic'],
		description:
			'The classic minor loop — each root steps down the natural minor scale, minor gravity in slow motion.'
	},
	{
		name: 'Andalusian',
		feel: 'Flamenco',
		mode: 'minor',
		romans: ['i', 'VII', 'VI', 'v'],
		moods: ['Tense', 'Mysterious', 'Dark'],
		description:
			'Descending chromatic bass line — the Phrygian flavour makes it feel ancient and restless.'
	},
	{
		name: 'Dark Pop',
		feel: 'Pop',
		mode: 'minor',
		romans: ['i', 'iv', 'VII', 'III'],
		moods: ['Dark', 'Melancholic'],
		description: 'The minor iv adds weight that plain natural minor lacks — heavier and more resigned.'
	},
	{
		name: 'Night Drive',
		feel: 'Indie',
		mode: 'minor',
		romans: ['i', 'III', 'VII', 'VI'],
		moods: ['Cinematic', 'Melancholic'],
		description:
			'Three major chords pushing back against the minor tonic — perpetual unresolved longing.'
	},
	{
		name: 'Cinematic',
		feel: 'Epic',
		mode: 'minor',
		romans: ['i', 'VI', 'VII', 'i'],
		moods: ['Cinematic', 'Dark'],
		description:
			'VI–VII is the cinematic engine — each resolves not to i but through another chord first.'
	},
	{
		name: 'Minor Blues',
		feel: 'Blues',
		mode: 'minor',
		romans: ['i', 'iv', 'i', 'v'],
		moods: ['Bluesy', 'Dark'],
		description:
			"Stripped-back minor blues — the minor v avoids harmonic minor's brightness, keeps it raw."
	},
	{
		name: 'Harmonic Minor Pull',
		feel: 'Classical',
		mode: 'minor',
		romans: ['i', 'iv', 'V', 'i'],
		moods: ['Tense', 'Dark', 'Cinematic'],
		description:
			'The raised 7th in the major V creates the strongest pull back to the minor tonic in Western harmony.'
	},
	{
		name: 'Neo-Soul',
		feel: 'Soul',
		mode: 'minor',
		romans: ['i', 'VII', 'VI', 'VII'],
		moods: ['Jazzy', 'Melancholic'],
		description:
			'Two major chords (VII and VI) create warmth against the minor tonic — mellow, sophisticated, never sad.'
	},
	{
		name: 'Dorian Groove',
		feel: 'Funk',
		mode: 'minor',
		romans: ['i', 'IV', 'i', 'IV'],
		moods: ['Jazzy', 'Bluesy'],
		description:
			"The major IV in a minor context is Dorian's signature move — bright but still rooted in minor."
	}
];

// ─── Borrowed Chords ─────────────────────────────────────────────────────────

export interface BorrowedChord {
	roman: string;
	label: string;
	descriptor: string;
	forMode: 'major' | 'minor';
}

export const BORROWED_CHORDS: BorrowedChord[] = [
	// Borrowed into major from parallel minor / Mixolydian / Lydian
	{ roman: 'bVII', label: '♭VII', descriptor: 'driving',   forMode: 'major' },
	{ roman: 'bVI',  label: '♭VI',  descriptor: 'cinematic', forMode: 'major' },
	{ roman: 'iv',   label: 'iv',   descriptor: 'dark',      forMode: 'major' },
	{ roman: 'II',   label: 'II',   descriptor: 'floating',  forMode: 'major' },
	// Borrowed into minor from parallel major / harmonic minor
	{ roman: 'IV',   label: 'IV',   descriptor: 'bright',    forMode: 'minor' },
	{ roman: 'V',    label: 'V',    descriptor: 'resolved',  forMode: 'minor' }
];

export function getBorrowedChords(mode: 'major' | 'minor'): BorrowedChord[] {
	return BORROWED_CHORDS.filter((b) => b.forMode === mode);
}

// ─── Functional Harmony ──────────────────────────────────────────────────────

export type FunctionLabel = 'T' | 'PD' | 'D';

export function getFunctionLabel(roman: string): FunctionLabel {
	switch (roman) {
		case 'I':
		case 'i':
		case 'iii':
		case 'III':
		case 'vi':
		case 'VI':
			return 'T';
		case 'ii':
		case 'ii°':
		case 'IV':
		case 'iv':
		case 'II':
		case 'bVI':
			return 'PD';
		case 'V':
		case 'v':
		case 'vii°':
		case 'VII':
		case 'bVII':
			return 'D';
		default:
			return 'T';
	}
}

// ─── Roman numeral display ────────────────────────────────────────────────────

// Converts ASCII 'b' prefix to Unicode flat: 'bVII' → '♭VII'
export function formatRoman(roman: string): string {
	return roman.replace(/^b([IViv])/, '♭$1');
}

// ─── Borrowed chord resolution ────────────────────────────────────────────────

const CHROMATIC_SHARPS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function semitonesUp(root: string, semitones: number): string {
	const idx = CHROMATIC_SHARPS.indexOf(root);
	if (idx === -1) return root;
	return CHROMATIC_SHARPS[(idx + semitones) % 12];
}

const BORROWED_SEMITONES: Record<string, { semitones: number; quality: string }> = {
	bVII: { semitones: 10, quality: '' },
	bVI:  { semitones: 8,  quality: '' },
	iv:   { semitones: 5,  quality: 'm' }, // minor 4th in major context
	II:   { semitones: 2,  quality: '' },  // Lydian major II
	IV:   { semitones: 5,  quality: '' },  // major 4th in minor context (Dorian)
	V:    { semitones: 7,  quality: '' }   // major V in minor context (harmonic minor)
};

export function getSlotChord(roman: string, key: string, mode: 'major' | 'minor'): string {
	const chords = getDiatonicChords(key, mode);
	const diatonic = chords.find((c) => c.roman === roman);
	if (diatonic) return diatonic.name;

	const borrowed = BORROWED_SEMITONES[roman];
	if (borrowed) {
		const root = semitonesUp(key, borrowed.semitones);
		return `${root}${borrowed.quality}`;
	}

	return '';
}

export function getProgressionNoteClass(
	note: string,
	chordName: string,
	key: string,
	mode: 'major' | 'minor'
): string {
	const scaleNotes = getScaleNotes(key, mode);
	return getDiatonicNoteClass(note, chordName || null, scaleNotes);
}
