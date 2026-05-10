export interface DiatonicExplanation {
	context: string;
	body: string;
}

// -1 = no chord selected (concept intro)
// 0–6 = chord degree index within the key
export const diatonicExplanations: Record<number, DiatonicExplanation> = {
	[-1]: {
		context: 'Click a chord to explore its tones',
		body: 'Every key contains 7 chords built entirely from its scale — these are the diatonic chords. The pattern of major, minor, and diminished qualities is the same in every key, which is why a progression you know in C works identically in G. Click any chord to see where its tones fall across the neck.'
	},
	[0]: {
		context: 'I / i — Tonic, home base',
		body: "The tonic chord is where the key lives. Progressions feel resolved when they land here — it's the musical equivalent of a full stop. Starting and ending on the I chord creates stability; leaving it creates momentum. In major keys it's a major chord; in minor keys it's minor (i), but the function is identical."
	},
	[1]: {
		context: 'ii / ii° — Supertonic, moves toward V',
		body: "The ii chord creates gentle tension that pulls toward the V — this ii–V movement is the engine of most jazz harmony. In major keys it's minor (ii); in minor keys it's diminished (ii°), which creates stronger tension. Whenever you hear a progression building toward a resolution, the ii is usually in the approach."
	},
	[2]: {
		context: 'iii / III — Mediant, colour between I and IV',
		body: 'The mediant is more of a colour chord than a structural one. In major keys (iii), it shares most of its notes with the I chord, so it can substitute for it or create a subtle emotional variation. In minor keys the III is actually the relative major — it often provides a sudden lift toward brightness before returning to the minor tonic.'
	},
	[3]: {
		context: 'IV / iv — Subdominant, momentum away from home',
		body: "The IV chord creates a sense of openness and forward motion. The I–IV–V–I cycle is the foundation of blues, folk, and rock — the IV provides contrast and energy after the stability of I. In minor keys, iv creates a particularly emotional gravity. The move from IV back to I (the 'plagal cadence') is sometimes called the 'Amen' ending."
	},
	[4]: {
		context: 'V / v — Dominant, maximum tension toward I',
		body: 'The V chord has the strongest pull back to I in Western music. In major keys, the V7 (dominant 7th) makes this pull even stronger — the tritone interval within it creates harmonic tension that wants to resolve. The V–I movement is at the heart of almost every resolved cadence in Western music. In natural minor, the v is minor and has less pull; many minor key songs raise the 7th to create a V7.'
	},
	[5]: {
		context: 'vi / VI — Submediant, the relative connection',
		body: 'In major keys, vi is the relative minor — it shares almost all its notes with I, making it sound closely related but with more depth. This is why the I–V–vi–IV progression (familiar from countless pop songs) feels so satisfying: vi gives you a minor turn without leaving the key. In minor keys, VI is a major chord that provides a sudden sense of openness or resolution.'
	},
	[6]: {
		context: 'vii° / VII — Leading tone, pulls strongly to I',
		body: "In major keys, the vii° (diminished) has a strong pull toward I — its diminished 5th creates tension that naturally resolves upward. In minor keys, the VII is often a bright major chord (the relative major's V) that can feel like a temporary lift. Both are most effective as passing chords — they rarely sit still for long before moving elsewhere."
	}
};
