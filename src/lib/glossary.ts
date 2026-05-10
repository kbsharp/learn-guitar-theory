export interface GlossaryTerm {
	term: string;
	definition: string;
	category: 'concept' | 'chord' | 'scale' | 'interval';
}

export const glossary: GlossaryTerm[] = [
	// ── Concepts ──────────────────────────────────────────────────────────────
	{
		term: 'Chord-scale relationship',
		category: 'concept',
		definition:
			'The principle that each chord type implies a specific scale you can improvise over it. Instead of guessing which notes work, you derive them directly from the chord — the scale is built from the same intervals that define the chord.'
	},
	{
		term: 'Chord tone',
		category: 'concept',
		definition:
			'A note that belongs to the chord itself — typically the root, 3rd, 5th, and 7th. Landing on chord tones always sounds intentional and resolved. Strong phrases start and end here; use them as anchors.'
	},
	{
		term: 'Scale tone',
		category: 'concept',
		definition:
			'A note from the compatible scale that is not part of the chord. These work best as passing notes between chord tones — they add colour and movement without defining the sound. Stopping on them mid-phrase can sound unresolved.'
	},
	{
		term: 'Avoid note',
		category: 'concept',
		definition:
			'A scale degree that clashes with a chord tone, usually sitting a half-step above an important chord tone. Avoid notes are not "wrong" but require care — they work as brief passing tones but sound unstable if held. This is why some notes are hidden on the fretboard.'
	},
	{
		term: 'Diatonic',
		category: 'concept',
		definition:
			'Belonging entirely to a given key or scale — no accidentals, no borrowed notes. A diatonic chord is built only from notes of the parent scale. Diatonic harmony is the foundation of most Western music.'
	},
	{
		term: 'Interval',
		category: 'interval',
		definition:
			'The distance between two notes, measured in semitones (half-steps). Intervals define what a chord or scale sounds like — a major chord and minor chord differ by a single interval: the 3rd.'
	},
	{
		term: 'Root',
		category: 'interval',
		definition:
			'The note a chord or scale is built from and named after. In Cmaj7, C is the root. The root gives the chord its home base — phrases that end on the root feel resolved.'
	},
	{
		term: 'Roman numerals',
		category: 'concept',
		definition:
			'A shorthand for chord position within a key: I is the chord built on the 1st degree, ii on the 2nd, V on the 5th, and so on. Uppercase = major, lowercase = minor. Roman numerals let you describe a chord progression in a way that works in any key.'
	},
	{
		term: 'Mode',
		category: 'concept',
		definition:
			'A scale derived by starting the major scale on a different degree. The 7 modes of the major scale (Ionian through Locrian) each have a distinct mood. Dorian starts on the 2nd degree, Mixolydian on the 5th, and so on — they use the same notes as their parent major scale but in a different order.'
	},
	// ── Chord types ───────────────────────────────────────────────────────────
	{
		term: 'Major triad',
		category: 'chord',
		definition:
			'A three-note chord built from the root, major 3rd, and perfect 5th. Bright and stable — the most common chord in popular music. Written as just the note name (C, G, D).'
	},
	{
		term: 'Minor triad',
		category: 'chord',
		definition:
			'A three-note chord built from the root, minor 3rd (one semitone lower than major), and perfect 5th. Darker and more introspective than major. Written with a lowercase m (Am, Em).'
	},
	{
		term: 'Maj7',
		category: 'chord',
		definition:
			'A major chord with an added major 7th (one semitone below the octave). Rich, sophisticated, resolved — common in jazz and pop. The 7th adds warmth without creating tension. Example: Cmaj7 = C E G B.'
	},
	{
		term: 'Dom7',
		category: 'chord',
		definition:
			'A dominant 7th chord: major chord with a flat 7th (two semitones below the octave). The flat 7th creates tension that pulls toward the I chord, making this the engine of harmonic motion. Example: G7 = G B D F.'
	},
	{
		term: 'm7',
		category: 'chord',
		definition:
			'A minor chord with a flat 7th. Common in jazz, funk, and pop — less dark than a plain minor chord. The most frequently used minor chord when playing over chord changes. Example: Am7 = A C E G.'
	},
	{
		term: 'm7♭5',
		category: 'chord',
		definition:
			'Also called half-diminished. A minor 7th chord with a flattened 5th — tense and unstable, almost always a passing chord on its way to a dominant. Common as the ii chord in minor keys. Example: Bm7♭5 = B D F A.'
	},
	{
		term: 'Dim7',
		category: 'chord',
		definition:
			'A fully diminished chord built from stacked minor thirds. Symmetrical — every note is equally a root, so one chord shape works in 4 keys. Extremely tense, often used as a chromatic passing chord.'
	},
	// ── Scales ────────────────────────────────────────────────────────────────
	{
		term: 'Major scale',
		category: 'scale',
		definition:
			'The foundational scale in Western music: W W H W W W H (whole and half steps). Bright and stable. Everything else — modes, chord tones, intervals — is described relative to it. Also called Ionian mode.'
	},
	{
		term: 'Natural minor',
		category: 'scale',
		definition:
			'The major scale starting on its 6th degree. Has a b3, b6, and b7 compared to major — darker and more melancholic. Also called Aeolian mode. The relative minor of any major key shares the same notes.'
	},
	{
		term: 'Dorian',
		category: 'scale',
		definition:
			'Natural minor with a raised 6th. The raised 6th keeps the minor feel but adds brightness — it is the characteristic note that makes Dorian sound jazzy rather than dark. The standard scale for minor 7th chords in jazz and funk.'
	},
	{
		term: 'Mixolydian',
		category: 'scale',
		definition:
			'Major scale with a flat 7th. Captures the sound of a dominant 7th chord — driving, bluesy, slightly unresolved. Common in rock, blues, and funk. Think "Sweet Home Alabama" or most blues-rock riffs.'
	},
	{
		term: 'Lydian',
		category: 'scale',
		definition:
			'Major scale with a raised 4th. The sharpened 4th removes a note that can clash over Maj7 chords and gives the scale a floating, cinematic quality. Common in jazz and film scoring over major 7th chords.'
	},
	{
		term: 'Phrygian',
		category: 'scale',
		definition:
			'Natural minor with a flat 2nd. The b2 is striking and exotic — common in flamenco, metal, and Spanish music. Creates a very dark, tense sound. Usually built on the 3rd degree of a major scale.'
	},
	{
		term: 'Locrian',
		category: 'scale',
		definition:
			'The darkest mode — natural minor with both a b2 and b5. The b5 matches the half-diminished chord and creates extreme tension. In practice, almost always a passing scale on the way to a dominant chord.'
	},
	{
		term: 'Major pentatonic',
		category: 'scale',
		definition:
			'The major scale with the 4th and 7th removed, leaving 5 notes. Both removed notes can clash over plain major chords — what remains always sounds consonant. The clean, melodic sound of country and pop soloing.'
	},
	{
		term: 'Minor pentatonic',
		category: 'scale',
		definition:
			'Natural minor with the 2nd and 6th removed, leaving 5 notes. The backbone of rock and blues. Nearly impossible to hit a "wrong" note — every degree sits comfortably over a minor chord.'
	},
	{
		term: 'Blues scale',
		category: 'scale',
		definition:
			'Minor pentatonic with an added flat 5th (the "blue note"). That extra note — halfway between the 4th and 5th — is the signature sound of blues. Bending up to it and releasing creates the classic blues expressiveness.'
	},
	{
		term: 'Diminished scale',
		category: 'scale',
		definition:
			'An 8-note symmetrical scale alternating whole and half steps. Because it repeats every 3 frets, one shape covers four keys simultaneously. Used over fully diminished chords and as an altered dominant sound in jazz.'
	},
	// ── CAGED ─────────────────────────────────────────────────────────────────
	{
		term: 'CAGED system',
		category: 'concept',
		definition:
			'A framework showing how the 5 open chord shapes (C, A, G, E, D) tile the entire fretboard. Every major chord can be played as one of these 5 shapes at any position. Understanding CAGED means you always know where the chord tones are, regardless of where you are on the neck.'
	}
];

export const glossaryByTerm: Map<string, GlossaryTerm> = new Map(glossary.map((t) => [t.term, t]));
