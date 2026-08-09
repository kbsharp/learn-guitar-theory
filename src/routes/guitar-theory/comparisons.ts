import { Quality } from './helpers';

/**
 * A/B pairings for the Explorer's comparison player.
 *
 * Crux 4 of the curriculum: every scale differs from its nearest familiar
 * reference by one or two notes, and the colour lives *there*. Modes stop
 * being seven shapes to memorise the moment you can hear the one note that
 * separates each from something you already know — so every scale here is
 * paired with the closest scale the target user already plays, not with a
 * theoretically tidy parent.
 *
 * Semitone offsets are from the root. `characteristic` is the note that
 * carries the colour; `reference` is where that same degree sits in the
 * scale we're comparing against, or null when the reference simply doesn't
 * have a note there (the blue note).
 */
export interface ScaleComparison {
	/** The familiar scale this one is heard against. */
	against: Quality;
	/** Semitones above the root of the note that carries the colour. */
	characteristic: number;
	/** The same degree in the reference scale — null if it isn't there at all. */
	reference: number | null;
	/** Degree label for the characteristic note, e.g. '♮6'. */
	degree: string;
	/** Degree label for the reference's note — null when it has none there. */
	referenceDegree: string | null;
	/** What the ear should be listening for across the two takes. */
	listenFor: string;
}

export const scaleComparisons: Record<Quality, ScaleComparison> = {
	[Quality.Ionian]: {
		against: Quality.Mixolydian,
		characteristic: 11,
		reference: 10,
		degree: '♮7',
		referenceDegree: '♭7',
		listenFor:
			"The 7th is the whole story. Ionian's leans hard into the root — that's the sound of a phrase arriving. Flatten it a fret and you get Mixolydian's swagger, which never quite lands. Listen to the note just below the top root each time."
	},
	[Quality.Dorian]: {
		against: Quality.Aeolian,
		characteristic: 9,
		reference: 8,
		degree: '♮6',
		referenceDegree: '♭6',
		listenFor:
			"One note moves: the 6th. Dorian lifts it a fret and the sadness lifts with it — that's the brightness sitting on top of a minor chord in Santana and Steely Dan. Drop it back and you're in plain natural minor."
	},
	[Quality.Phrygian]: {
		against: Quality.Aeolian,
		characteristic: 1,
		reference: 2,
		degree: '♭2',
		referenceDegree: '♮2',
		listenFor:
			"The 2nd, one fret lower. A semitone directly above the root falls into it every time you touch it, and that pull is the entire flamenco / dark-metal flavour. Aeolian's whole-step 2nd sounds ordinary straight after it."
	},
	[Quality.Lydian]: {
		against: Quality.Ionian,
		characteristic: 6,
		reference: 5,
		degree: '♯4',
		referenceDegree: '♮4',
		listenFor:
			"The 4th, raised a fret. Ionian's 4th sags back down to the 3rd; Lydian's refuses to resolve and the whole scale floats. It's the sound of film-score wonder — and it's one note away from the major scale you already know."
	},
	[Quality.Mixolydian]: {
		against: Quality.Ionian,
		characteristic: 10,
		reference: 11,
		degree: '♭7',
		referenceDegree: '♮7',
		listenFor:
			'Drop the 7th one fret and the major scale stops arriving and starts strutting — AC/DC, Tom Petty, every dominant-7 riff. Play both and notice you only changed one note to get from polite to bluesy.'
	},
	[Quality.Aeolian]: {
		against: Quality.Dorian,
		characteristic: 8,
		reference: 9,
		degree: '♭6',
		referenceDegree: '♮6',
		listenFor:
			"The 6th, a fret below Dorian's. That single fret is the difference between a minor-key ballad and a funk vamp: the ♭6 leans down onto the 5th and drags the scale into the drama. Play them back to back over the same Am chord."
	},
	[Quality.Locrian]: {
		against: Quality.Phrygian,
		characteristic: 6,
		reference: 7,
		degree: '♭5',
		referenceDegree: '♮5',
		listenFor:
			"Both are dark, but Locrian flattens the 5th — and the 5th is what was holding the scale up. Phrygian sits happily on a minor chord; Locrian has nothing stable to sit on, which is why it's a passing sound rather than a home."
	},
	[Quality.MajorPentatonic]: {
		against: Quality.MinorPentatonic,
		characteristic: 4,
		reference: 3,
		degree: '♮3',
		referenceDegree: '♭3',
		listenFor:
			'Three notes actually move here, but your ear only hears one: the 3rd. Same root, same five-note shape, and that one note decides country-bright or blues-dark. Everything else is trimming.'
	},
	[Quality.MinorPentatonic]: {
		against: Quality.MajorPentatonic,
		characteristic: 3,
		reference: 4,
		degree: '♭3',
		referenceDegree: '♮3',
		listenFor:
			"Three notes move, but the ♭3 is the one you hear — it's why this sounds like rock and the major version sounds like country. Now bend that ♭3 a half-step toward the major 3rd and you've found the blues."
	},
	[Quality.Blues]: {
		against: Quality.MinorPentatonic,
		characteristic: 6,
		reference: null,
		degree: '♭5',
		referenceDegree: null,
		listenFor:
			'One note added rather than moved: the ♭5, wedged between the 4th and the 5th. It has no business being there, which is the point — hear how it slides through instead of landing. Everything else is the pentatonic you already play.'
	}
};
