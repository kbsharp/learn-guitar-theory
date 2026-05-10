export interface NextLink {
	href: string;
	label: string;
}

export interface DiatonicExplanation {
	context: string;
	body: string;
	next?: NextLink;
}

// -1 = no chord selected (concept intro)
// 0–6 = chord degree index within the key
export const diatonicExplanations: Record<number, DiatonicExplanation> = {
	[-1]: {
		context: 'Click a chord to explore its tones',
		body: 'Every key has 7 chords that "belong" — the same pattern of majors, minors, and one diminished in every key. Click each chord to feel which one resolves home (I) and which one demands movement (V). Once you can hear the function of each, you can recognise it in any song.',
		next: { href: '/progressions', label: 'Chain them into a four-chord song' }
	},
	[0]: {
		context: 'I / i — Tonic, home base',
		body: "The tonic chord is where the key lives. Progressions feel resolved when they land here — it's the musical equivalent of a full stop. Starting and ending on the I chord creates stability; leaving it creates momentum. In major keys it's a major chord; in minor keys it's minor (i), but the function is identical.",
		next: { href: '/progressions', label: 'Hear it as the anchor in a preset' }
	},
	[1]: {
		context: 'ii / ii° — Supertonic, moves toward V',
		body: "The ii chord creates gentle tension that pulls toward the V — this ii–V movement is the engine of most jazz harmony. In major keys it's minor (ii); in minor keys it's diminished (ii°), which creates stronger tension. Whenever you hear a progression building toward a resolution, the ii is usually in the approach.",
		next: { href: '/chord-scale', label: 'See which scale fits the ii (m7)' }
	},
	[2]: {
		context: 'iii / III — Mediant, colour between I and IV',
		body: 'The mediant is more of a colour chord than a structural one. In major keys (iii), it shares most of its notes with the I chord, so it can substitute for it or create a subtle emotional variation. In minor keys the III is actually the relative major — it often provides a sudden lift toward brightness before returning to the minor tonic.'
	},
	[3]: {
		context: 'IV / iv — Subdominant, momentum away from home',
		body: "The IV chord creates a sense of openness and forward motion. The I–IV–V–I cycle is the foundation of blues, folk, and rock — the IV provides contrast and energy after the stability of I. In minor keys, iv creates a particularly emotional gravity. The move from IV back to I (the 'plagal cadence') is sometimes called the 'Amen' ending.",
		next: { href: '/progressions', label: 'Hear it in classic progressions' }
	},
	[4]: {
		context: 'V / v — Dominant, maximum tension toward I',
		body: 'The V chord has the strongest pull back to I in Western music. In major keys, the V7 (dominant 7th) makes this pull even stronger — the tritone interval within it creates harmonic tension that wants to resolve. The V–I movement is at the heart of almost every resolved cadence in Western music. In natural minor, the v is minor and has less pull; many minor key songs raise the 7th to create a V7.',
		next: { href: '/chord-scale', label: 'See which scale fits the V7' }
	},
	[5]: {
		context: 'vi / VI — Submediant, the relative connection',
		body: 'In major keys, vi is the relative minor — it shares almost all its notes with I, making it sound closely related but with more depth. This is why the I–V–vi–IV progression (familiar from countless pop songs) feels so satisfying: vi gives you a minor turn without leaving the key. In minor keys, VI is a major chord that provides a sudden sense of openness or resolution.',
		next: { href: '/progressions', label: 'Hear vi in the Pop Standard preset' }
	},
	[6]: {
		context: 'vii° / VII — Leading tone, pulls strongly to I',
		body: "vii° is pure tension — it shares most of its notes with V7, so it has the same craving to resolve to I. In minor keys the VII becomes a bright major chord that often lifts you toward the relative major (the bVII in 'Sweet Child O' Mine' is this sound). Both are passing chords — they rarely sit still for long.",
		next: { href: '/chord-scale', label: 'See the half-diminished colour (m7♭5)' }
	}
};
