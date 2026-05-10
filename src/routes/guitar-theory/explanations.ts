import { Quality } from './helpers';

export interface ScaleExplanation {
	context: string;
	body: string;
}

export const scaleExplanations: Record<Quality, ScaleExplanation> = {
	[Quality.Ionian]: {
		context: 'Over major chords and major key progressions',
		body: 'The major scale — the reference point everything else is defined against. Bright, stable, and resolved. If you are soloing over a straightforward major key progression and want to sound melodic and safe, this is home base. Every other mode is described as a variation of this scale.'
	},
	[Quality.Dorian]: {
		context: 'Over minor chords in jazz, funk, and rock',
		body: "Natural minor with a raised 6th. That one change is what separates Dorian from sounding dark and heavy to sounding open and jazzy. The raised 6th is the characteristic note — target it deliberately and you'll hear the sound Santana, Daft Punk, and jazz improvisers reach for over minor grooves. Use it over any m7 chord."
	},
	[Quality.Phrygian]: {
		context: 'Flamenco, metal, exotic harmonic colour',
		body: 'The flat 2nd is the defining note — it gives Phrygian an immediately Spanish or dark-metal quality. This is the scale of flamenco guitar, thrash metal riffs, and dramatic film music. Less useful for improvising over changing chords; it shines when the music sits on a static minor chord and you want tense, brooding colour.'
	},
	[Quality.Lydian]: {
		context: 'Over Maj7 chords, cinematic or dreamy contexts',
		body: "The raised 4th is the signature — it creates a floating, otherworldly quality that sits perfectly over Maj7 chords (where the standard major scale's 4th can clash). If major is bright and grounded, Lydian is bright and hovering. Joe Satriani's melodic solos, John Williams film scores, and dream-pop all live here."
	},
	[Quality.Mixolydian]: {
		context: 'Over dominant 7th chords and blues-rock riffs',
		body: 'Major with a flat 7th — the driving, slightly unresolved sound behind most classic rock and blues. The flat 7th adds edge without darkening the scale. Wherever you hear a chord progression that feels major but has that slight tension or swagger, Mixolydian is likely the scale. AC/DC, Van Morrison, Tom Petty.'
	},
	[Quality.Aeolian]: {
		context: 'Natural minor — emotional rock, ballads, minor key songs',
		body: 'The natural minor scale. Darker and more melancholic than Dorian because the b6 adds weight and drama. Every major key has a relative minor that uses the same notes — A minor is the relative of C major. Classic for emotional rock, ballads, and minor-key pop. Less jazzy than Dorian, more plaintive.'
	},
	[Quality.Locrian]: {
		context: 'Rarely used; over m7♭5 chords as a passing scale',
		body: "Locrian is the most dissonant mode — it has both a b2 and b5, making it inherently unstable and restless. In practice it's almost never used as a primary improvising scale; its role is over half-diminished chords (m7♭5), where the b5 matches the chord's diminished fifth. It almost always resolves to something else."
	},
	[Quality.MajorPentatonic]: {
		context: 'Country, pop, melodic rock — universally safe major sound',
		body: "The major scale with the 4th and 7th removed — the two notes most likely to clash over plain major chords. Five notes remain that always sit comfortably. This is the clean, melodic sound of country lead and pop hooks. A great starting point for soloing: it's nearly impossible to land on a wrong note."
	},
	[Quality.MinorPentatonic]: {
		context: 'Rock, blues, metal — the foundational minor scale',
		body: "Natural minor stripped to its five most powerful notes. Hendrix, Clapton, Slash — virtually all blues-rock lead playing starts here. The 2nd and 6th are removed, leaving only the notes that always feel strong over minor chords. This is where most guitarists start soloing, and it rewards exploration long after you've moved on to fuller scales."
	},
	[Quality.Blues]: {
		context: 'Blues, soul, rock — minor penta plus the blue note',
		body: "Minor pentatonic with one added note: the flat 5th, called the blue note. That note, especially when bent upward from the 4th, is the signature sound of blues. Don't treat it as a resting point — it's most powerful as a passing tone, bent and released. Slide between the 4th and b5 and you'll hear exactly what makes blues sound like blues."
	}
};
