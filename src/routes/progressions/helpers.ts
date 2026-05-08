import { getDiatonicChords, getScaleNotes, getDiatonicNoteClass } from '../diatonic/helpers';

export { getDiatonicChords };
export type { DiatonicMode } from '../diatonic/helpers';

// Circle of fifths — clockwise from C, using sharp notation internally
export const FIFTHS_KEYS   = ['C','G','D','A','E','B','F#','C#','G#','D#','A#','F'];
export const FIFTHS_DISPLAY = ['C','G','D','A','E','B','F♯','D♭','A♭','E♭','B♭','F'];

// Relative minor of each major key at the same circle position
export const RELATIVE_MINOR_KEYS    = ['A','E','B','F#','C#','G#','D#','A#','F','C','G','D'];
export const RELATIVE_MINOR_DISPLAY = ['Am','Em','Bm','F♯m','C♯m','G♯m','D♯m','A♯m','Fm','Cm','Gm','Dm'];

export interface Preset {
	name: string;
	feel: string;
	mode: 'major' | 'minor';
	romans: [string, string, string, string];
}

export const PRESETS: Preset[] = [
	// Major
	{ name: 'Pop Standard',       feel: 'Pop',       mode: 'major', romans: ['I',  'V',   'vi', 'IV']  },
	{ name: '50s Classic',        feel: 'Classic',   mode: 'major', romans: ['I',  'vi',  'IV', 'V']   },
	{ name: 'Singer-Songwriter',  feel: 'Folk',      mode: 'major', romans: ['I',  'iii', 'IV', 'V']   },
	{ name: 'Pachelbel Canon',    feel: 'Classical', mode: 'major', romans: ['I',  'V',   'vi', 'iii'] },
	{ name: 'Jazz ii-V-I',        feel: 'Jazz',      mode: 'major', romans: ['ii', 'V',   'I',  'I']   },
	{ name: 'Rhythm Changes',     feel: 'Jazz',      mode: 'major', romans: ['I',  'vi',  'ii', 'V']   },
	{ name: 'Classic Rock',       feel: 'Rock',      mode: 'major', romans: ['I',  'IV',  'V',  'IV']  },
	// Minor
	{ name: 'Minor Ballad',       feel: 'Ballad',    mode: 'minor', romans: ['i',  'VI',  'III','VII'] },
	{ name: 'Andalusian',         feel: 'Flamenco',  mode: 'minor', romans: ['i',  'VII', 'VI', 'v']   },
	{ name: 'Dark Pop',           feel: 'Pop',       mode: 'minor', romans: ['i',  'iv',  'VII','III'] },
	{ name: 'Night Drive',        feel: 'Indie',     mode: 'minor', romans: ['i',  'III', 'VII','VI']  },
	{ name: 'Cinematic',          feel: 'Epic',      mode: 'minor', romans: ['i',  'VI',  'VII','i']   },
];

export function getSlotChord(roman: string, key: string, mode: 'major' | 'minor'): string {
	const chords = getDiatonicChords(key, mode);
	return chords.find((c) => c.roman === roman)?.name ?? '';
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
