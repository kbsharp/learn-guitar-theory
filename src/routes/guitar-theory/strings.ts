import { Range } from 'tonal';

function removeOctaves(notes: string[]) {
    return notes.map(note => note.replace(/[0-9]/g, ''));
}

const EString = removeOctaves(Range.chromatic(['E2', 'E4'], { sharps: true }));
const AString = removeOctaves(Range.chromatic(['A2', 'A4'], { sharps: true }));
const DString = removeOctaves(Range.chromatic(['D3', 'D5'], { sharps: true }));
const GString = removeOctaves(Range.chromatic(['G3', 'G5'], { sharps: true }));
const BString = removeOctaves(Range.chromatic(['B3', 'B5'], { sharps: true }));
const eString = removeOctaves(Range.chromatic(['E4', 'E6'], { sharps: true }));

export const strings = [
    eString,
    BString,
    GString,
    DString,
    AString,
    EString
]