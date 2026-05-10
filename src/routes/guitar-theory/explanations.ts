import { Quality } from './helpers';

export interface NextLink {
	href: string;
	label: string;
}

export interface ScaleExplanation {
	context: string;
	body: string;
	next?: NextLink;
}

// Each scale's "next" points to the Chord-Scale page where the scale's
// matching chord type lives — closing the loop from "shape" to "use case".
export const scaleExplanations: Record<Quality, ScaleExplanation> = {
	[Quality.Ionian]: {
		context: 'Over major chords and major key progressions',
		body: 'The major scale — the reference point everything else is defined against. Bright, stable, and resolved. If you are soloing over a straightforward major key progression and want to sound melodic and safe, this is home base. Every other mode is described as a variation of this scale.',
		next: { href: '/chord-scale', label: 'See it set to a major chord' }
	},
	[Quality.Dorian]: {
		context: 'Over minor chords in jazz, funk, and rock',
		body: "Natural minor with a raised 6th — that one note is what makes Dorian sound jazzy rather than heavy. Try this: over an Am chord, deliberately target the F# (4th fret, D string) and you'll hear the Santana / Daft Punk colour appear. It's the characteristic note; without it you're just playing minor.",
		next: { href: '/chord-scale', label: 'See it set to m7' }
	},
	[Quality.Phrygian]: {
		context: 'Flamenco, metal, exotic harmonic colour',
		body: 'The flat 2nd is the defining note — it gives Phrygian an immediately Spanish or dark-metal quality. This is the scale of flamenco guitar, thrash metal riffs, and dramatic film music. Less useful for improvising over changing chords; it shines when the music sits on a static minor chord and you want tense, brooding colour.',
		next: { href: '/guitar-theory', label: 'Hear it against minor on the neck' }
	},
	[Quality.Lydian]: {
		context: 'Over Maj7 chords, cinematic or dreamy contexts',
		body: "The raised 4th is the signature — that one note is what makes Lydian float instead of land. Try this: over any Maj7 chord, target the #4 (one fret above your usual 4th) and you'll hear the Satriani / John Williams cinematic colour. Without it, you're just playing the major scale.",
		next: { href: '/chord-scale', label: 'See it set to Maj7' }
	},
	[Quality.Mixolydian]: {
		context: 'Over dominant 7th chords and blues-rock riffs',
		body: 'Major with a flat 7th — that one flattened note is the swagger you hear in AC/DC, Van Morrison, and Tom Petty. Over any dominant 7 chord, deliberately land on the b7 and you will hear it. Wherever a progression feels major but has that slight tension, this is the scale.',
		next: { href: '/chord-scale', label: 'See it set to a 7 chord' }
	},
	[Quality.Aeolian]: {
		context: 'Natural minor — emotional rock, ballads, minor key songs',
		body: 'The natural minor scale. Darker and more melancholic than Dorian because the b6 adds weight and drama. Every major key has a relative minor that uses the same notes — A minor is the relative of C major. Classic for emotional rock, ballads, and minor-key pop. Less jazzy than Dorian, more plaintive.',
		next: { href: '/chord-scale', label: 'See it set to a minor chord' }
	},
	[Quality.Locrian]: {
		context: 'Rarely used; over m7♭5 chords as a passing scale',
		body: "Locrian is the most dissonant mode — it has both a b2 and b5, making it inherently unstable and restless. In practice it's almost never used as a primary improvising scale; its role is over half-diminished chords (m7♭5), where the b5 matches the chord's diminished fifth. It almost always resolves to something else.",
		next: { href: '/chord-scale', label: 'See it set to m7♭5' }
	},
	[Quality.MajorPentatonic]: {
		context: 'Country, pop, melodic rock — universally safe major sound',
		body: "The major scale with the 4th and 7th removed — the two notes most likely to clash over plain major chords. Five notes remain that always sit comfortably. This is the clean, melodic sound of country lead and pop hooks. A great starting point for soloing: it's nearly impossible to land on a wrong note.",
		next: { href: '/chord-scale', label: 'See it set to a major chord' }
	},
	[Quality.MinorPentatonic]: {
		context: 'Rock, blues, metal — the foundational minor scale',
		body: 'The five notes Hendrix, Clapton, and Slash never get bored of — minor stripped to what always sounds strong over a minor chord. Pick any m or m7 chord, then play these five notes anywhere on the neck. You will not land on a wrong note. This is where most guitarists start soloing.',
		next: { href: '/chord-scale', label: 'See it set to a minor chord' }
	},
	[Quality.Blues]: {
		context: 'Blues, soul, rock — minor penta plus the blue note',
		body: "Minor pentatonic with one added note: the flat 5th, called the blue note. That note, especially when bent upward from the 4th, is the signature sound of blues. Don't treat it as a resting point — it's most powerful as a passing tone, bent and released. Slide between the 4th and b5 and you'll hear exactly what makes blues sound like blues.",
		next: { href: '/chord-scale', label: 'See it set to a minor chord' }
	}
};
