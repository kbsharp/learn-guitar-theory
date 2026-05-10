import type { ChordType } from './helpers';

export interface NextLink {
	href: string;
	label: string;
}

export interface ChordScaleExplanation {
	context: string;
	body: string;
	next?: NextLink;
	practice?: string;
}

// Each chord's "next" points to the Fretboard Explorer where the
// recommended scale can be seen on the full neck — closing the loop
// from "chord context" to "shape across the neck".
// "practice" gives a concrete physical instruction tied to this chord.
export const explanations: Record<ChordType, ChordScaleExplanation> = {
	maj7: {
		context: 'I and IV chords in major keys',
		body: "A plain major scale over a Maj7 chord has a hidden problem: its 4th degree sits just a half-step above the chord's 3rd, creating an unwanted clash. Lydian sharpens that 4th, removing the tension and giving the chord a bright, floating quality. This is why Lydian sounds more open over Imaj7 than simply playing the major scale of that key.",
		next: { href: '/guitar-theory', label: 'See Lydian on the whole neck' },
		practice:
			'Hold a Cmaj7. Play C, D, E, then F# (fret 4, D string), then G. That #4 in the middle is what makes the sound float instead of land. Sit on the F# over the chord and listen.'
	},
	'7': {
		context: 'The V chord — pulls toward resolution',
		body: "A dominant 7th chord is defined by its b7, which creates tension that naturally wants to resolve down to the I chord — that pull is the engine of most harmonic movement in western music. Mixolydian is simply the major scale with that b7 built in, so it matches the chord's character exactly. You hear it in every blues, funk, and rock riff that has that slightly unresolved, driving quality.",
		next: { href: '/guitar-theory', label: 'See Mixolydian on the whole neck' },
		practice:
			'Hold a G7. Play G major scale but lower F# to F (fret 1, high E instead of fret 2). Land on that F deliberately — that single change is the entire Mixolydian effect.'
	},
	m7: {
		context: 'The ii chord in major keys; minor grooves in jazz and funk',
		body: "Natural minor also fits a m7 chord, but its b6 degree can feel unstable against the chord's 5th — Dorian raises that to a natural 6th, which sits cleanly above the chord and adds brightness without breaking the minor feel. That natural 6th is the characteristic note that separates Dorian from regular minor: present, open, and slightly jazzy. Anytime you're playing over a minor chord that needs to feel alive rather than dark, reach for Dorian.",
		next: { href: '/guitar-theory', label: 'See Dorian on the whole neck' },
		practice:
			'Hold an Am7. Play A natural minor, then raise the 6th from F to F# (fret 4, D string). That one note is the entire difference between sad-minor and jazzy-minor. Land on it deliberately.'
	},
	m7b5: {
		context: 'ii in minor keys (ii°–V–i); vii in major keys',
		body: 'The half-diminished chord is built around its flat 5th — Locrian is the only standard mode containing a b5, making it the logical match. This chord almost always appears as a passing chord on its way somewhere else (typically to a dominant), so think of it less as a destination and more as a point of maximum tension before resolution. In a minor ii–V–i progression (Bm7♭5 → E7 → Am), the Locrian scale reinforces that sense of inward pull.',
		next: { href: '/guitar-theory', label: 'See Locrian on the whole neck' },
		practice:
			'Play Bm7♭5 → E7 → Am in sequence. Over the Bm7♭5, play B Locrian — feel how the b5 wants to fall. Over the E7, switch to E Mixolydian. Over the Am, switch to A Dorian. Three scales, one resolution.'
	},
	maj: {
		context: 'Plain major triads — pop, rock, country',
		body: "Major pentatonic is the major scale with two notes quietly removed: the 4th (which makes chords sound suspended) and the 7th (which can add unwanted Maj7 colour). Five notes remain, all of which sit comfortably on or around the chord tones — nothing clashes. This is why it's the workhorse of country, pop, and melodic rock soloing: maximum major character, minimum risk.",
		next: { href: '/guitar-theory', label: 'See Major Pentatonic on the whole neck' },
		practice:
			'Loop a C major chord. Play C major pentatonic anywhere on the neck. You cannot land on a wrong note. Target C, E, and G (the chord tones) for the most resolved phrases.'
	},
	m: {
		context: 'Plain minor triads — rock, blues, and pop',
		body: 'Minor pentatonic strips natural minor down to its five most powerful notes by removing the 2nd and 6th — the two degrees most likely to feel tense over a basic minor chord. What remains is the backbone of blues and rock: root, flat third, fourth, fifth, flat seventh. Most guitarists encounter this scale first, and for good reason: it is nearly impossible to land on a note that sounds wrong.',
		next: { href: '/guitar-theory', label: 'See Minor Pentatonic on the whole neck' },
		practice:
			'Loop an Am chord. Play A minor pentatonic in box 1 (frets 5–8). Bend the b3 (fret 7, G string) up a half-step. That is the most-used phrase in rock and blues — practise it until it feels automatic.'
	},
	dim: {
		context: 'Passing chords — often between adjacent diatonic chords',
		body: 'Diminished chords feel like dread on the edge of resolving — think Hitchcock soundtrack tension. The dim7 scale repeats every 3 frets, so one shape covers four different roots (Cdim7, E♭dim7, F♯dim7, Adim7). Practise it as a passing colour, not a destination — diminished chords almost always lead somewhere within the key.',
		next: { href: '/diatonic', label: 'See where vii° fits in a key' },
		practice:
			'Play C → C#dim7 → Dm. The C#dim7 is the lift between the major and the minor — pure tension that resolves. Try the same pattern in any key: it works because of the half-step pull built into the diminished sound.'
	}
};
