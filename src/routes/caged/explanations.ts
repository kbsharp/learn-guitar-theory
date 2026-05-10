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
		body: "These 5 shapes tile the entire fretboard end-to-end with no gaps. Every chord tone you can play belongs to one of them, and each shape's top frets overlap the next shape's bottom frets. Try this: pick a chord (G works well) and play all 5 shapes from open up to fret 12 — you'll feel them connect.",
		next: { href: '/diatonic', label: 'Use these shapes for the chords in a key' }
	},
	E: {
		context: 'E shape — open position moved up the neck',
		body: 'Based on the open E major chord, the most common barre shape. The root sits on the low E string — barre fret 3 in this shape and you have a G chord, fret 5 gives A, fret 7 gives B. Same shape, different keys.'
	},
	A: {
		context: 'A shape — 5th-string root, versatile mid-neck voicing',
		body: 'Based on the open A chord — root on the 5th string. Barre fret 5 with a partial A shape on strings 2–4 and you have a D chord; fret 7 gives E. Very common for intermediate rhythm playing — sits well in the middle of the neck with an even tone.'
	},
	G: {
		context: 'G shape — high voicings, sits above the bass register',
		body: "Based on the open G chord — the trickiest fingering because of the stretch. As a movable shape it gives the highest-register chord tones, sitting cleanly above a bassist without conflicting. Try the top three strings at fret 7 for a B chord — that's the voicing chord melody players reach for constantly.",
		next: { href: '/diatonic', label: 'See where these voicings fit a key' }
	},
	C: {
		context: 'C shape — bright, high voicing for fills and stabs',
		body: 'Based on the open C chord. Sits in the higher fret range and gives a bright, treble-focused voicing. Barre fret 5 with a C shape behind it for an F chord that cuts through a dense mix — common for pop and country chord stabs.'
	},
	D: {
		context: 'D shape — compact, high-fret voicing',
		body: 'Based on the open D chord — the most compact, trebly voicing of the five. Barre fret 5 with an open-D shape behind it and you have a G chord at the top of the neck. Good for rhythmic hits sitting above the bass register, or for upper-string fills that connect to the E shape below it.'
	}
};
