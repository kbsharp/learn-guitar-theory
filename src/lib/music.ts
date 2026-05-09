/**
 * Canonical flat→sharp converter. All helpers use this; do not re-define locally.
 * Covers double-flats (Bbb, Ebb) and enharmonic edge cases (Cb→B, Fb→E).
 */
export function convertFlatToSharp(note: string): string {
	switch (note) {
		case 'Ab':  return 'G#';
		case 'Bb':  return 'A#';
		case 'Bbb': return 'A#';
		case 'Cb':  return 'B';
		case 'Db':  return 'C#';
		case 'Eb':  return 'D#';
		case 'Ebb': return 'D#';
		case 'Fb':  return 'E';
		case 'Gb':  return 'F#';
		default:    return note;
	}
}

export function convertFlatsToSharps(notes: string[]): string[] {
	return notes.map(convertFlatToSharp);
}
