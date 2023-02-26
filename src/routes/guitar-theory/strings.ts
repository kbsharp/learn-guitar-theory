import { Range } from 'tonal';

function removeNumbers(notes: string[]) {
    return notes.map(note => note.replace(/[0-9]/g, ''));
}

const EString = removeNumbers(Range.chromatic(['E2', 'E4'], { sharps: true }));
const AString = removeNumbers(Range.chromatic(['A2', 'A4'], { sharps: true }));
const DString = removeNumbers(Range.chromatic(['D3', 'D5'], { sharps: true }));
const GString = removeNumbers(Range.chromatic(['G3', 'G5'], { sharps: true }));
const BString = removeNumbers(Range.chromatic(['B3', 'B5'], { sharps: true }));
const eString = removeNumbers(Range.chromatic(['E4', 'E6'], { sharps: true }));

const strings = [
    eString,
    BString,
    GString,
    DString,
    AString,
    EString
]

export {
    EString,
    AString,
    DString,
    GString,
    BString,
    eString,
    strings
}