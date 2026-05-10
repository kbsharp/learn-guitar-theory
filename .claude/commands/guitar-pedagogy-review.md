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

## Content types — apply the rubric appropriately

Not all content is structurally an "explanation panel." Calibrate the rubric per type:

| Content type | Where | What it must do | Rubric notes |
|---|---|---|---|
| **Home hero / feature cards** | `src/routes/+page.svelte` | Pitch the app and route users to the right tool | WHY applies to the tagline (does it make a guitarist understand what the app *does*?). DO is relaxed (no fretboard yet). SOUND is optional. CALIBRATION is critical. CONNECT is the whole point — every feature card is itself a link. |
| **Page intros** | `+page.svelte` files | Orient a visitor to what this tool does and what they should do first | DO and CALIBRATION are critical. SOUND is optional for tool intros. CONNECT is highly relevant — page intros are a natural place to link to related tools. |
| **ExplanationPanel body** | `explanations.ts` files | Explain *why* this specific scale/chord/shape sounds the way it does | All five criteria apply. This is the strict case. |

If a piece of content is the right type for its location but doesn't fit the table above, evaluate against the spirit of the rubric: would the stuck intermediate be better off after reading this?

---

## Constraints on rewrites

When suggesting rewritten content in Section 2:

- **Length**: 2-3 sentences maximum, ~50 words. This matches the existing design rule in CLAUDE.md ("Guitarists want context, not lectures").
- **Voice**: Direct, practical, no jargon without context. Match the voice of strong existing explanations (the Mixolydian and Minor Pentatonic entries are good reference points).
- **Notation**: Use sharps (F#, C#) not flats internally — matches the codebase convention.
- **No emojis.** No exclamation marks unless quoting a sound description.
- **Don't pad.** If a rewrite passes all five criteria in two sentences, do not stretch it to three.
- **Preserve typed structure.** Explanations have a `context` string and a `body` string in `explanations.ts`. Rewrites should fit into the existing structure, not require a schema change.

---

## Output format

Produce a structured report with exactly four sections. Be direct and specific — quote actual content, name actual files and line numbers where possible.

---

### Section 1: Scorecard

A markdown table. Rows = every piece of content audited (page intros + each individual explanation entry). Columns = WHY | DO | SOUND | CALIBRATION | CONNECT | Overall.

Use ✓ for pass, ✗ for fail. For content type-specific criteria that don't apply (e.g., SOUND on a tool intro), use `—` and exclude from the Overall score.

After the table, briefly call out **strong content that passes all applicable criteria** — name the 3-5 best pieces. These become the voice/style reference for rewrites in Section 2.

Also briefly call out the **overall failure pattern** — is the app weakest on DO (most common gap), CONNECT (siloed tools), or something else? One sentence.

---

### Section 2: Priority improvements

Order failing items by **impact**, defined as:

1. **Visibility** — page intros (seen on every visit) rank above individual explanations. Common scales/chords (major, minor pentatonic, m7, dominant 7, Mixolydian) rank above rare ones (Locrian, m7b5).
2. **Severity** — items failing 3+ criteria rank above items failing 1-2.
3. **Strategic centrality** — content tied to the app's core value prop (chord-scale relationships, the *why* behind shapes) ranks above peripheral content.

Apply these in order: visibility first, then severity within the same visibility tier, then strategic centrality as the tiebreaker. Skip content that passes all five criteria — celebrate it in Section 1 instead.

For each failing item:

**[Tool name] — [Content identifier]**
> Current: "[exact quote]"

Fails: [list which criteria and briefly why]

Rewrite:
> "[rewritten version that passes all criteria — respects the rewrite constraints above]"

---

### Section 3: Missing cross-links

Every place where content references a concept that has its own dedicated tool page but doesn't link to it. Be specific: name the source page, quote the text that should carry the link, and give the exact link text and destination path.

Format:
- **[Source page]**: "[quoted text]" → add link: "[link text]" → `/[path]`

---

### Section 4: Gaps for the stuck intermediate

Things the target user would commonly want to know that the app doesn't currently address at all — in any explanation, page intro, or tool. These are honest content and feature gaps, not criticisms. Note them as future opportunities without implementing anything.

Keep this list to the 5-8 most impactful gaps. For each: one sentence on what the gap is and one sentence on why it matters to the stuck intermediate.

---

## Improving this skill

If during a run you discover the rubric itself is wrong — content that clearly fails the spirit of the standard but technically passes all five criteria, or vice versa — flag it at the end of the report under a brief **Rubric notes** heading. Don't silently work around it. The skill should evolve as we learn what genuinely serves the stuck intermediate; update this file rather than papering over its limitations.

Do not make production code changes during a review. The audit reports; the developer decides which improvements to apply.
