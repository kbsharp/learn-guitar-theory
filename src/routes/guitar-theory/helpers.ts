import { Scale } from 'tonal';

export const Abmaj = Scale.get('Ab major'); // G# major
export const Amaj = Scale.get('A major');
export const Bbmaj = Scale.get('Bb major'); // A# major
export const Bmaj = Scale.get('B major');
export const Cmaj = Scale.get('C major');
export const Dbmaj = Scale.get('Db major'); // C# major
export const Dmaj = Scale.get('D major');
export const Ebmaj = Scale.get('Eb major'); // D# major
export const Emaj = Scale.get('E major');
export const Fmaj = Scale.get('F major');
export const Gbmaj = Scale.get('Gb major'); // F# major
export const Gmaj = Scale.get('G major');

export const frets = new Array(25).fill(null);

export enum Key {
    Ab = 'Ab',
    A = 'A',
    Bb = 'Bb',
    B = 'B',
    C = 'C',
    Db = 'Db',
    D = 'D',
    Eb = 'Eb',
    E = 'E',
    F = 'F',
    Gb = 'Gb',
    G = 'G'
}

export const majorScales: Key[] = [
    Key.Ab,
    Key.A,
    Key.Bb,
    Key.B,
    Key.C,
    Key.Db,
    Key.D,
    Key.Eb,
    Key.E,
    Key.F,
    Key.Gb,
    Key.G
]

export function currentTonic(currentScale: Key): string {
    switch (currentScale) {
        case Key.A:
            return Amaj.tonic ?? '';
        case Key.Bb:
            return 'A#'
        case Key.B:
            return Bmaj.tonic ?? '';
        case Key.C:
            return Cmaj.tonic ?? '';
        case Key.Db:
            return 'C#';
        case Key.D:
            return Dmaj.tonic ?? '';
        case Key.Eb:
            return "D#";
        case Key.E:
            return Emaj.tonic ?? '';
        case Key.F:
            return Fmaj.tonic ?? '';
        case Key.Gb:
            return "F#";
        case Key.G:
            return Gmaj.tonic ?? '';
        case Key.Ab:
            return "G#";

        default: return '';
    }
}

export function getClassName(note: string, currentScale: Key, tonic: string) {
    let inScale = false;

    const isTonic = tonic === note;

    switch (currentScale) {
        case Key.Ab:
            inScale = Abmaj.notes.map(n => convertFlatToSharp(n)).includes(note);
            break;
        case Key.A:
            inScale = Amaj.notes.map(n => convertFlatToSharp(n)).includes(note);
            break;
        case Key.Bb:
            inScale = Bbmaj.notes.map(n => convertFlatToSharp(n)).includes(note);
            break;
        case Key.B:
            inScale = Bmaj.notes.map(n => convertFlatToSharp(n)).includes(note);
            break;
        case Key.C:
            inScale = Cmaj.notes.map(n => convertFlatToSharp(n)).includes(note);
            break;
        case Key.Db:
            inScale = Dbmaj.notes.map(n => convertFlatToSharp(n)).includes(note);
            break;
        case Key.D:
            inScale = Dmaj.notes.map(n => convertFlatToSharp(n)).includes(note);
            break;
        case Key.Eb:
            inScale = Ebmaj.notes.map(n => convertFlatToSharp(n)).includes(note);
            break;
        case Key.E:
            inScale = Emaj.notes.map(n => convertFlatToSharp(n)).includes(note);
            break;
        case Key.F:
            inScale = Fmaj.notes.map(n => convertFlatToSharp(n)).includes(note);
            break;
        case Key.Gb:
            inScale = Gbmaj.notes.map(n => convertFlatToSharp(n)).includes(note);
            break;
        case Key.G:
            inScale = Gmaj.notes.map(n => convertFlatToSharp(n)).includes(note);
            break;
    }

    if (inScale && isTonic) return 'in-scale tonic';
    if (inScale) return 'in-scale';

    return '';
}

export function convertFlatToSharp(note: string): string {
    switch (note) {
        case 'Ab': return 'G#';
        case 'Bb': return 'A#';
        case 'Db': return 'C#';
        case 'Eb': return 'D#';
        case 'Gb': return 'F#';
        default: return note;
    }
}