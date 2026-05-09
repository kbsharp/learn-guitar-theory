export interface ProgressionExplanation {
	context: string;
	body: string;
	practice?: string;
}

// ─── Per-chord explanations ───────────────────────────────────────────────────

type ChordExplanation = Pick<ProgressionExplanation, 'context' | 'body'>;

const majorChordExplanations: Record<string, ChordExplanation> = {
	I: {
		context: 'I — Tonic',
		body: "Everything in the key resolves here. Stable, restful, and complete — the point of arrival that all other chords orbit around. Start and end phrases on tonic chord tones and you'll always sound intentional."
	},
	ii: {
		context: 'ii — Supertonic (Pre-dominant)',
		body: "A softer approach to the dominant than going straight to V. The minor quality keeps things from feeling too settled, and the shared notes with IV make it a smooth pivot. Use it when you want forward momentum without the urgency of V."
	},
	iii: {
		context: 'iii — Mediant (Tonic substitute)',
		body: "Reflective and slightly ambiguous — it shares two notes with I and two with V, sitting between stability and tension. Use it where you want a tonic sound but with a wistful, introspective quality that I doesn't have."
	},
	IV: {
		context: 'IV — Subdominant (Pre-dominant)',
		body: "The first move away from home: lifts the progression and creates a sense of openness. Two of its notes are shared with ii, making it interchangeable as a pre-dominant. It's the most common stepping stone to V, or a gentle cadence back to I."
	},
	V: {
		context: 'V — Dominant',
		body: "Maximum tension — the dominant's leading tone sits a half-step below the tonic, creating an irresistible pull. The stronger the V, the bigger the resolution back to I feels. Everything else in the progression is either heading here or leaving from here."
	},
	vi: {
		context: 'vi — Relative minor (Tonic substitute)',
		body: "The emotional shadow of the tonic: shares two notes with I but introduces minor colour without leaving the key. Landing on vi after I creates an immediate drop in brightness — it's how major progressions get their wistful or bittersweet moments."
	},
	'vii°': {
		context: 'vii° — Leading tone chord (Dominant substitute)',
		body: "Unstable and restless — the diminished 5th makes it want to resolve to I immediately. Functions similarly to V but with more tension and less weight. Use it for decisive resolutions or to add drama before a final I."
	}
};

const minorChordExplanations: Record<string, ChordExplanation> = {
	i: {
		context: 'i — Minor tonic',
		body: "Home in the minor world — but unlike major, the minor tonic never feels fully settled. That residual tension is what gives minor progressions their depth: you're always slightly at the edge of something. Phrases resolve here, but the unease remains."
	},
	'ii°': {
		context: 'ii° — Diminished supertonic (Pre-dominant)',
		body: "Highly unstable — the diminished 5th creates sharp dissonance that pushes urgently toward resolution. Use it before V or III when you want tense, pressing motion. It's rarely used for more than a moment before moving on."
	},
	III: {
		context: 'III — Relative major (Tonic substitute)',
		body: "The only naturally major chord built above the minor tonic. It's the relative major key's tonic, so landing here briefly shifts the emotional centre toward brightness. The contrast against i is the strongest major/minor shift available within the key."
	},
	iv: {
		context: 'iv — Minor subdominant (Pre-dominant)',
		body: "Heavier and more resigned than a major IV — two of its notes are shared with i, making it feel like a deeper, more weighted version of the tonic itself. The minor subdominant is a key part of what makes minor progressions feel dark rather than just sad."
	},
	v: {
		context: 'v — Minor dominant (Dominant)',
		body: "Without the raised 7th of harmonic minor, there's no leading tone — so the pull toward i is weak and floating rather than urgent. Use it when you want tension that doesn't demand resolution, or when you want the progression to feel unresolved and open-ended."
	},
	VI: {
		context: 'VI — Major submediant (Tonic substitute)',
		body: "Warm brightness against the minor tonic — a major chord that arrives like a shaft of light in a minor progression. Classically used as a lift before resolution back to i, which is why it sounds cinematic: the contrast between VI's warmth and i's weight is one of the most emotionally effective moves in minor."
	},
	VII: {
		context: 'VII — Subtonic (Dominant substitute)',
		body: "A major chord built a whole step below the tonic — creating momentum and direction without the obligation of a true dominant. It doesn't pull to i as strongly as V, which is why it feels more open and driving. The engine behind many rock and cinematic minor progressions."
	}
};

const borrowedChordExplanations: Record<string, ChordExplanation> = {
	bVII: {
		context: '♭VII — Borrowed dominant substitute',
		body: "Borrowed from the parallel minor (or diatonic to Mixolydian). It avoids the V chord's strong leading-tone pull — instead of tension demanding resolution, you get drive and momentum without obligation. This is the chord that makes Mixolydian rock feel wide-open rather than resolved."
	},
	bVI: {
		context: '♭VI — Borrowed cinematic lift (Pre-dominant)',
		body: "Borrowed from the parallel minor: a major chord a minor 6th above the tonic. Surprising and cinematic — it doesn't follow the natural major scale's motion, so it lands with impact. Often used before ♭VII–I or V–I as a pre-dominant that carries real emotional weight."
	},
	iv: {
		context: 'iv — Borrowed minor subdominant (Pre-dominant)',
		body: "The minor IV in a major key, borrowed from the parallel minor. Its flattened 3rd and 6th are the borrowed notes — they add darkness and emotional weight that the major key's IV doesn't have. The move I–IV–iv–I is one of the most affecting chromatic gestures in Western pop."
	},
	II: {
		context: 'II — Lydian major II',
		body: "A major chord built on the raised 2nd degree — diatonic to Lydian mode. It creates a floating, weightless quality unlike any diatonic chord: neither a strong dominant nor a clear pre-dominant, just an openness that hovers. Film composers reach for this for dreamlike, otherworldly moments."
	},
	IV: {
		context: 'IV — Borrowed major subdominant (Dorian)',
		body: "The major IV borrowed into a minor key from the parallel major — the characteristic chord of Dorian mode. Its major quality (vs the natural minor's iv) is the note that distinguishes Dorian from Aeolian: the raised 6th. Adds brightness to a minor progression without fully leaving the minor world."
	},
	V: {
		context: 'V — Harmonic minor dominant',
		body: "The major V chord in a minor key, drawn from harmonic minor. Raising the 7th creates a leading tone just a half-step below the minor tonic — the strongest pull-to-resolution available in minor harmony. The contrast between the tension of this chord and the arrival at i is one of the most satisfying moments in Western music."
	}
};

export function getChordExplanation(roman: string, mode: 'major' | 'minor'): ProgressionExplanation | null {
	const map = mode === 'major' ? majorChordExplanations : minorChordExplanations;
	return map[roman] ?? borrowedChordExplanations[roman] ?? null;
}

export const defaultExplanation: ProgressionExplanation = {
	context: 'Build your own progression',
	body: "Select a preset to learn the theory behind its mood, or assemble chords from the palette below. Each slot shows its harmonic function — T (Tonic), PD (Pre-dominant), and D (Dominant) — so you can see the tension arc you're building as you go.",
	practice:
		"Use the diatonic scale of your chosen key as your home base. When you borrow a chord from the palette, its chord tones will light up pink on the fretboard — those are the notes that give the borrowed chord its colour."
};

export const progressionExplanations: Record<string, ProgressionExplanation> = {
	'Pop Standard': {
		context: 'I–V–vi–IV — tonic → dominant → relative minor → subdominant',
		body: "This works because it cycles through all four harmonic functions in order: home (I), maximum tension (V), a brief minor shadow (vi), then a gentle forward push (IV) before landing home again. The vi chord — the relative minor — gives just enough darkness to make the resolution back to I feel satisfying rather than bland. Every repetition reinforces the loop, which is why it feels simultaneously fresh and inevitable.",
		practice:
			"Play the major scale or major pentatonic throughout. When you land on the vi chord, try landing on the b3 of that chord (the minor 3rd) — it's already in the major pentatonic, so no scale change is needed, just shift your target notes briefly toward the minor."
	},

	'50s Classic': {
		context: 'I–vi–IV–V — tonic → relative minor → subdominant → dominant',
		body: "The difference from the Pop Standard is where vi appears: landing on the relative minor immediately after I creates wistfulness before the progression even starts building tension. The IV–V at the end is a clean cadential approach — pre-dominant into dominant — that makes the loop feel resolved yet forward-moving. This is why it reads as nostalgic: the minor turn comes early, before the energy builds.",
		practice:
			"Major pentatonic works over the whole loop. Over the vi chord, target the root and b3 of that chord — both are already in the major pentatonic, so you're just choosing where to land. The root of vi is the 6th degree of the major scale, making it a natural resting point for a phrase."
	},

	'Singer-Songwriter': {
		context: 'I–iii–IV–V — tonic → mediant → subdominant → dominant',
		body: "The iii chord (the mediant) is the quiet workhorse of acoustic music. It shares two notes with I and two with V, so it functions as a gentle pivot — neither fully at rest nor under tension. This makes the progression flow smoothly while avoiding the bluntness of a straight I–IV–V. The emotional quality is reflective: neither sad nor purely upbeat, just looking inward.",
		practice:
			"The major scale works throughout. Over the iii chord, try resolving phrases to its 5th rather than its root — the 5th of iii is the 7th degree of the major scale, which gives phrases a slightly suspended, unresolved feel that fits the introspective mood."
	},

	'Pachelbel Canon': {
		context: 'I–V–vi–iii — descending 3rds bass line',
		body: "What makes this progression so enduring is its bass line: the roots descend in 3rds (I→V→vi→iii creates a bass of C–G–A–E in C major), implying forward motion even when the chords are cycling. The iii chord at the end is the twist — instead of resolving to IV or ii as you might expect, it pulls back toward I and restarts the cycle. The harmonic logic feels inevitable, which is why it sounds classical even in modern pop.",
		practice:
			"Use the major scale throughout. The descending bass line is the key melodic idea here — try playing melodies that mirror or counterpoint the bass descent rather than just sitting on chord tones. A rising melody over a falling bass is the classical counterpoint move that makes this progression sing."
	},

	'Jazz ii-V-I': {
		context: 'ii–V–I — the fundamental unit of jazz harmony',
		body: "The ii–V–I is the engine of jazz. The ii chord (minor 7th) introduces the 4th degree of the scale as a tension note. The V chord (dominant 7th) is maximum tension: its tritone interval — the 3rd and b7 of the chord — is inherently unstable and pulls toward resolution. The I chord releases everything. This sequence appears in jazz standards constantly, often in multiple keys within a single song.",
		practice:
			"Over ii: play Dorian mode (major scale from the 2nd degree). Over V: play Mixolydian mode (major scale from the 5th degree), or for more jazz colour, the Lydian Dominant scale. Over I: Ionian (major scale) or Lydian for a lifted sound. Connecting these three scale choices smoothly is the core of jazz improvisation."
	},

	'Rhythm Changes': {
		context: 'I–vi–ii–V — the jazz turnaround',
		body: "The turnaround (or 'rhythm changes' after the Gershwin standard 'I Got Rhythm') creates constant harmonic motion — it never fully settles. Each chord prepares the next: I to vi is a Tonic → Tonic-substitute move, vi to ii is a falling-3rd motion that increases tension, ii to V is the classic pre-dominant to dominant approach. The result is forward momentum that loops endlessly without feeling repetitive.",
		practice:
			"Use major pentatonic as a safe home base, shifting to Dorian briefly over ii and Mixolydian over V. The real jazz move is to think of vi–ii–V as a single unit: a long approach to the I that you're already preparing from the moment you land on vi."
	},

	'Classic Rock': {
		context: 'I–IV–V–IV — the three-chord trick',
		body: "I, IV, and V are the three fundamental functions in Western tonal music: Tonic (home), Subdominant (approach), and Dominant (tension). Together they cover every note of the major scale between them. This is why I–IV–V feels complete — you can't play a wrong note in the key. The IV at the end instead of resolving to I keeps the loop open, giving classic rock its relentless drive.",
		practice:
			"The major pentatonic and major blues scale (major pentatonic + b3) are both perfectly at home here. The b3 of the blues scale is the 'blue note' that implies the minor character guitarists reach for in rock solos — try bending up to the major 3rd from the b3 over the I and V chords."
	},

	'Mixolydian Drift': {
		context: 'I–♭VII–IV–I — Mixolydian mode in practice',
		body: "The ♭VII chord (borrowed from the parallel minor, or naturally diatonic to Mixolydian mode) is what separates rock from pure pop. It avoids the V chord's strong magnetic pull toward I — instead of obligation, there's openness. The motion I→♭VII→IV→I creates a circular, almost modal feel: you're never quite at home, never quite under tension. Think 'Sweet Home Alabama', 'La Grange', 'Hey Jude'.",
		practice:
			"The Mixolydian scale (major scale with a b7) works perfectly throughout — the ♭VII chord is built on the 7th degree of Mixolydian, so it's a natural diatonic chord of that mode. The major pentatonic also works. For extra colour, emphasise the b7 note (the root of the ♭VII chord) in your phrases — it's the note that defines Mixolydian's character."
	},

	'Lydian Lift': {
		context: 'I–II–I–II — Lydian mode floating between two major chords',
		body: "The II chord (a major chord built on the 2nd degree) belongs to Lydian mode, which has a raised 4th. The motion between I and II creates a hovering, weightless quality because neither chord is a traditional dominant — there's no strong pull in either direction, just floating. Film composers reach for this when scoring space travel, dreams, or moments of wonder. John Williams uses it constantly.",
		practice:
			"The Lydian scale (major scale with a #4) is your tool here — the raised 4th is what defines both the mode and the II chord. Over the II chord, the root of that chord is the 2nd degree of your key. Try playing melodies that emphasise the #4 over the I chord, then resolve to the natural 4th (now the root of the II chord). That half-step tension and release is the sound."
	},

	'Minor Ballad': {
		context: 'i–VI–III–VII — descending natural minor loop',
		body: "This progression follows the gravity of the natural minor scale: the chord roots move i→VI→III→VII (A→F→C→G in Am), stepping down in thirds through the scale. The VI and III are both major chords, which gives the progression periodic moments of brightness that make the return to i feel earned rather than inevitable. The emotional quality is resigned acceptance — sad, but not desperate.",
		practice:
			"Natural minor (Aeolian) works throughout. Over the VI and III chords — both of which are major — you can briefly shift your thinking to the relative major key and use major pentatonic. Your ear will adjust back naturally when i arrives. This parallel-scale thinking is how many guitarists instinctively navigate minor progressions without knowing why."
	},

	'Andalusian': {
		context: 'i–VII–VI–v — the Phrygian descent',
		body: "The Andalusian cadence is one of the oldest progressions in Western music — flamenco, Baroque, metal, and film scores all reach for it. Its power comes from the descending bass: in Am, the roots move A–G–F–E, a chromatic descent of a perfect 4th. The v chord (minor dominant) instead of the expected V keeps the tension unresolved, giving the loop a cyclical, restless quality that never fully settles. The Phrygian colour comes from the VI chord approaching the cadence.",
		practice:
			"Phrygian dominant (5th mode of harmonic minor) captures both the exotic flat-2nd flavour and the harmonic minor pull of the approach to v. In Am: start with A Phrygian dominant (A–Bb–C#–D–E–F–G). For a darker alternative, pure Phrygian mode (no raised 3rd) gives the progression an even more ancient, unresolved quality — perfect for slow, heavy passages."
	},

	'Dark Pop': {
		context: 'i–iv–VII–III — minor with a borrowed iv chord',
		body: "The difference between 'Minor Ballad' and this progression is the iv chord. In natural minor, the 4th degree is already minor (iv), and using it instead of the major VI chord pulls the progression downward earlier and harder. The VII and III chords (both major) then lift things temporarily, before the cycle restarts at i. The emotional character is heavier and more resigned than the Minor Ballad — think modern pop songwriters aiming for weight, not just sadness.",
		practice:
			"Natural minor throughout. The iv chord is the key colour — it shares two notes with i (the root and the 5th of the minor scale), so you can phrase across the i→iv transition without needing to change your scale. Emphasising the minor 6th (the note that distinguishes natural minor from Dorian) over the iv chord deepens the dark quality."
	},

	'Night Drive': {
		context: 'i–III–VII–VI — three major chords against one minor',
		body: "This is the reversal of what you expect: instead of one or two major chords providing relief inside a minor progression, here three major chords create an almost unreal brightness — but the minor tonic at the start keeps pulling everything back into shadow. The loop feels like arriving somewhere and immediately having to leave again. It's the harmonic equivalent of almost-but-not-quite: longing for something just out of reach.",
		practice:
			"Natural minor works throughout. Because III, VII, and VI are all major chords, your phrases over them can lean into major pentatonic briefly — especially on III (the relative major's tonic) where major pentatonic will feel most natural. The tension comes from returning to i and having to drop back into minor, so let phrases on III resolve downward toward the minor root."
	},

	'Cinematic': {
		context: 'i–VI–VII–i — the minor epic loop',
		body: "The VI and VII here are both major chords, which creates dramatic contrast with the minor tonic. The step VI→VII (a rising whole step) gathers momentum like a film score building toward something — it's the two-chord 'lift' that composers use before a climax. The return to i is satisfying because the two major chords have temporarily displaced the minor gravity, making the landing feel resolved and inevitable. This is everywhere in modern film scoring.",
		practice:
			"Natural minor throughout. The VI→VII motion is the harmonic hook — try playing melodies that rise over VI and VII, then fall back on i. The note that VI and VII share (the root of VII is the 7th degree of natural minor, and the root of VI is the 6th) creates a scalar step upward that you can use melodically to mirror the harmonic lift."
	},

	'Minor Blues': {
		context: 'i–iv–i–v — stripped minor blues',
		body: "This is the blues at its most essential. The v chord (minor dominant) is the key choice — using the minor 5th instead of the raised major V from harmonic minor means there's no leading tone, no strong magnetic pull back to i. The resolution is heavier, more resigned, less triumphant. This is the sound of deep blues and slow minor grooves: tension that doesn't so much resolve as sigh and settle. B.B. King, slow blues in Am.",
		practice:
			"The minor pentatonic and minor blues scale (add b5) are your tools. The 'blue note' (the b5) is your expressive weapon — bend into it and out of it, especially over the iv chord where the dissonance is most productive. For the v chord, try targeting its root in phrases as a held note that resolves down by a half-step to the 5th of i on the return."
	},

	'Harmonic Minor Pull': {
		context: 'i–iv–V–i — the strongest cadence in minor',
		body: "The raised 7th of harmonic minor appears in the V chord. In natural minor, the 5th degree is v (minor), which has a weak pull toward i. Raising the 7th creates a major V chord with a leading tone just a half step below the minor tonic — this half-step tension is the strongest pull-to-resolution in all of Western harmony. Baroque and classical composers built entire styles around it. Metal and flamenco use it for maximum tension before release.",
		practice:
			"Use natural minor over i and iv, then switch to harmonic minor (natural minor with a raised 7th) over the V chord — that single raised note is what creates the pull. The Phrygian dominant scale (5th mode of harmonic minor) also works over the V and gives it an exotic quality. The moment of tension is the leading tone under the V — hold it, bend it, and let it resolve up to the minor tonic when i arrives."
	},

	'Neo-Soul': {
		context: 'i–VII–VI–VII — minor tonic with warm major satellites',
		body: "The VII and VI chords in natural minor are both major — in Am, they're G major and F major. This progression uses them as warm, open alternatives that orbit the minor tonic without applying strong dominant pressure. The VII→VI motion (a descending whole step) is inherently relaxed, and returning to VII creates a comfortable rocking motion. The emotional result is sophisticated minor: melancholic but not bleak, introspective but not heavy. Think D'Angelo, neo-soul, late-night R&B.",
		practice:
			"Natural minor throughout, but don't play it like it's sad — the two major chords give you permission to open up. Over VII, try the Mixolydian scale (treat VII as a momentary major key centre) for a more harmonically adventurous sound. The note that unifies all three chords is the 3rd of the major scale built on VI — it's present in both VI and VII, giving you a pedal point to sustain across the change."
	},

	'Dorian Groove': {
		context: 'i–IV–i–IV — Dorian mode: minor with a major IV',
		body: "Dorian mode is natural minor with a raised 6th. The consequence is that the 4th degree becomes a major chord (IV instead of iv), which gives the mode its distinctive brightness-within-minor quality. The IV chord here is borrowed from the parallel major — in Am Dorian, the IV chord is D major (not D minor). The back-and-forth between i and IV creates a groove that feels simultaneously dark (minor tonic) and open (major IV). This is the sound of funk, soul, and modal jazz. Carlos Santana lives here.",
		practice:
			"The Dorian scale (natural minor with a raised 6th) is your scale. The raised 6th is the characteristic note — it's the note that's in the IV chord but not in the natural minor scale. Emphasise it, especially over the IV chord: it's the note that screams 'Dorian' and defines the mood. Minor pentatonic also works but sounds less distinctly Dorian — adding that raised 6th is what separates this from a generic minor groove."
	}
};
