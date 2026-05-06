import { writable, type Writable } from 'svelte/store';
import type { Key } from './routes/guitar-theory/helpers';
import { Key as Keys, Quality } from './routes/guitar-theory/helpers';
import type { ChordType } from './routes/chord-scale/helpers';
import type { DiatonicMode } from './routes/diatonic/helpers';

// Fretboard Explorer
export const key: Writable<Key> = writable(Keys.C);
export const quality: Writable<Quality> = writable(Quality.Ionian);

// Chord-Scale
export const chordRoot: Writable<string> = writable('C');
export const chordQuality: Writable<ChordType> = writable('maj7');

// Diatonic Chords
export const diatonicKey: Writable<string> = writable('C');
export const diatonicMode: Writable<DiatonicMode> = writable('major');
export const selectedDiatonicChord: Writable<string | null> = writable(null);
