import { Scale } from 'tonal';

export const aMajScale = Scale.get('A major');
export const bMajScale = Scale.get('B major');
export const cMajScale = Scale.get('C major');
export const dMajScale = Scale.get('D major');
export const eMajScale = Scale.get('E major');
export const fMajScale = Scale.get('F major');
export const gMajScale = Scale.get('G major');

export const frets = new Array(25).fill(null);

export enum MajorScale {
    A = 'A major',
    B = 'B major',
    C = 'C major',
    D = 'D major',
    E = 'E major',
    F = 'F major',
    G = 'G major'
}

export const majorScales: MajorScale[] = [
    MajorScale.A,
    MajorScale.B,
    MajorScale.C,
    MajorScale.D,
    MajorScale.E,
    MajorScale.F,
    MajorScale.G
]

// export type MajorScales = (typeof majorScales)[number];

export function currentTonic(currentScale: MajorScale): string {
    switch (currentScale) {
        case MajorScale.A:
            return aMajScale.tonic ?? '';
        case 'B major':
            return bMajScale.tonic ?? '';
        case 'C major':
            return cMajScale.tonic ?? '';
        case 'D major':
            return dMajScale.tonic ?? '';
        case 'E major':
            return eMajScale.tonic ?? '';
        case 'F major':
            return fMajScale.tonic ?? '';
        case 'G major':
            return gMajScale.tonic ?? '';

        default: return '';
    }
}

export function getClassName(note: string, currentScale: MajorScale, tonic: string) {
    let inScale = false;

    const isTonic = tonic === note;

    switch (currentScale) {
        case 'A major':
            inScale = aMajScale.notes.includes(note);
            break;
        case 'B major':
            inScale = bMajScale.notes.includes(note);
            break;
        case 'C major':
            inScale = cMajScale.notes.includes(note);
            break;
        case 'D major':
            inScale = dMajScale.notes.includes(note);
            break;
        case 'E major':
            inScale = eMajScale.notes.includes(note);
            break;
        case 'F major':
            inScale = fMajScale.notes.includes(note);
            break;
        case 'G major':
            inScale = gMajScale.notes.includes(note);
            break;
    }

    if (inScale && isTonic) return 'in-scale tonic';
    if (inScale) return 'in-scale';

    return '';
}