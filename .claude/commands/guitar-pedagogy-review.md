# Guitar Pedagogy Review

You are auditing the explanatory content of Fretboard Lab against a strict pedagogical standard. Your job is to ensure every piece of content genuinely serves the target user and passes before it ships.

## Who this app is for

**The stuck intermediate guitarist.** They have played for 2-5 years, are self-taught or lesson-taught, and know their minor pentatonic, basic open chords, and maybe the CAGED shapes. They hit a wall: they know *what* to play but not *why* it works. They ask "why does my Em pentatonic work over everything?" and "how do I know which scale to use?" They have money invested in gear and are motivated to improve.

Write for this person. Not for beginners who don't know what a chord is. Not for advanced players who already know modes. For the guitarist who has the shapes and wants the theory behind them.

## Files to read

Read ALL of the following and hold their contents in context:

1. `src/routes/+page.svelte` — home page hero tagline and feature descriptions
2. `src/routes/guitar-theory/+page.svelte` — page intro paragraph
3. `src/routes/guitar-theory/explanations.ts` — all scale explanations (context + body)
4. `src/routes/chord-scale/+page.svelte` — page intro paragraph
5. `src/routes/chord-scale/explanations.ts` — all chord-scale explanations
6. `src/routes/diatonic/+page.svelte` — page intro paragraph
7. `src/routes/diatonic/explanations.ts` — all diatonic chord explanations
8. `src/routes/caged/+page.svelte` — page intro paragraph
9. `src/routes/caged/explanations.ts` — all CAGED shape explanations
10. `src/routes/progressions/+page.svelte` — page intro paragraph

## The rubric

Score every ExplanationPanel body text and every page intro against these 5 criteria. Each is a binary pass/fail.

### 1. WHY
Does it explain *why* something works, not just *what* it is?

- **Fail**: "Dorian is natural minor with a raised 6th." (definition, not explanation)
- **Pass**: "That raised 6th is the one note that separates Dorian from sounding heavy to sounding jazzy — landing on it deliberately is how you get that Santana sound."

### 2. DO
Does it give the guitarist a concrete physical action they can try *right now while holding a guitar*? This must be specific enough to actually do — not just "try it over a minor chord" but a specific fret, string, or physical instruction.

- **Fail**: "Use Dorian over minor chords."
- **Pass**: "Over an Am chord, deliberately target the F# — that's the raised 6th, and that one note is what makes it sound Dorian instead of just minor."

### 3. SOUND
Does it give a concrete sonic orientation? A genre, an artist, or a description of what it *sounds like* — something the guitarist can mentally anchor the concept to before they even play it.

- **Fail**: "This scale has a dark quality."
- **Pass**: "This is the sound behind virtually every Hendrix, Clapton, and Slash solo — the foundational blues-rock voice."

### 4. CALIBRATION
Is it written for someone with 2-5 years of playing? Not so basic it explains what a chord is. Not so advanced it assumes they know what the lydian dominant mode is. The sweet spot: they know scales exist, they know minor from major, they've heard of modes but couldn't explain them.

- **Fail (too basic)**: "A chord is a group of notes played together."
- **Fail (too advanced)**: "The raised 4th creates a tritone substitution opportunity against the dominant."
- **Pass**: "Think of modes as flavours — same notes, different starting point, completely different feeling."

### 5. CONNECT
Does it miss an obvious cross-link to another tool page in the app where the user could *immediately apply* what they just learned? If an explanation mentions a concept that has a dedicated page, it should point there.

- **Fail**: Dorian explanation doesn't mention that Chord-Scale shows exactly which chord Dorian maps to.
- **Pass**: Dorian explanation ends with "See exactly which chords call for Dorian on the Chord-Scale page."

---

## Output format

Produce a structured report with exactly four sections. Be direct and specific — quote actual content, name actual files and line numbers where possible.

---

### Section 1: Scorecard

A markdown table. Rows = every piece of content audited (page intros + each individual explanation entry). Columns = WHY | DO | SOUND | CALIBRATION | CONNECT | Overall.

Use ✓ for pass, ✗ for fail.

---

### Section 2: Priority improvements

The failing items ordered by impact — most-seen content first (page intros beat individual explanations; popular scales/chords beat obscure ones).

For each failing item:

**[Tool name] — [Content identifier]**
> Current: "[exact quote]"

Fails: [list which criteria and briefly why]

Rewrite:
> "[rewritten version that passes all criteria — stay within 2-3 sentences, do not pad]"

---

### Section 3: Missing cross-links

Every place where content references a concept that has its own dedicated tool page but doesn't link to it. Be specific: name the source page, quote the text that should carry the link, and give the exact link text and destination path.

Format:
- **[Source page]**: "[quoted text]" → add link: "[link text]" → `/[path]`

---

### Section 4: Gaps for the stuck intermediate

Things the target user would commonly want to know that the app doesn't currently address at all — in any explanation, page intro, or tool. These are honest content and feature gaps, not criticisms. Note them as future opportunities without implementing anything.

Keep this list to the 5-8 most impactful gaps. For each: one sentence on what the gap is and one sentence on why it matters to the stuck intermediate.
