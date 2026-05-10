export interface NextLink {
	href: string;
	label: string;
}

export interface CAGEDExplanation {
	context: string;
	body: string;
	next?: NextLink;
}

// null key = "All" shapes selected (full system overview)
// shape name key = individual shape selected
export const cagedExplanations: Record<string, CAGEDExplanation> = {
	all: {
		context: 'Full neck — 5 shapes, no gaps',
		body: 'These 5 shapes tile the entire fretboard end-to-end. Every chord tone you can play on the neck belongs to one of them. The shapes connect — the top of one shape overlaps the bottom of the next. Once you know all 5 for a given chord, there is always another voicing nearby, no matter where you are on the neck.',
		next: { href: '/diatonic', label: 'Use these shapes for the chords in a key' }
	},
	E: {
		context: 'E shape — open position moved up the neck',
		body: 'Based on the open E major chord — the most common starting point for most guitarists. As a barre chord it sits lowest on the fretboard for most roots and has strong, full bass notes on the low E string. Because the open E is usually the first barre chord shape people learn, this one tends to feel most natural. The root sits on the low E string.'
	},
	A: {
		context: 'A shape — 5th-string root, versatile mid-neck voicing',
		body: 'Based on the open A chord. The root sits on the 5th string (A string), making it easy to find using the A-string note names you may already know. Often played as a partial barre covering strings 2–4, or a full 5th-string barre. Very common for intermediate rhythm playing — it sits well in the middle of the neck and has a full, even tone.'
	},
	G: {
		context: 'G shape — high voicings, sits above the bass register',
		body: 'Based on the open G chord — the trickiest shape because the open G fingering requires an unusual stretch. As a movable shape it gives you the highest-register chord tones, which sit cleanly above a bassist without conflicting. Advanced players use this for chord melody, fills, and high-register rhythm parts that cut through a dense mix.'
	},
	C: {
		context: 'C shape — bright, high voicing for fills and stabs',
		body: 'Based on the open C chord. Typically sits in the higher fret range for any given root and provides a bright, treble-focused voicing. Commonly used in pop and country for short chord stabs and fills — the high register makes it cut clearly. The root is on the 2nd string, which can take time to internalise compared to the E and A shapes.'
	},
	D: {
		context: 'D shape — compact, high-fret voicing',
		body: 'Based on the open D chord. Often the highest-fret shape for a given root and gives the most compact, trebly voicing of the five. Good for rhythmic chord hits when you want to sit on top of the mix, or for adding chord tones in the upper register without duplicating what the bass is doing. Connects directly to the E shape above it on the neck.'
	}
};
