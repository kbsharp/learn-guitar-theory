# Fretboard Lab — Product Roadmap

_Last updated: 2026-08-09. This is the working roadmap we iterate through together.
Each phase is broken into session-sized chunks. Strike items through as they ship;
add decisions and learnings to the log at the bottom._

---

## The thesis

The app's job is to answer the two questions the stuck intermediate can't get
answered anywhere online:

1. **What actually matters, and in what order?** (Most resources are either a
   random pile of lessons or an academic theory syllabus written for piano.)
2. **Which exercises unlock which abilities, and why?** (Most practice advice is
   "learn your scales" with no connection to what you'll be able to _do_.)

Everything we build serves those two answers. The existing five tools are the
**labs**; the missing piece is the **path** that sequences them and the
**exercises** that convert looking into ability.

### Decisions made (2026-08-09)

- **Guided path over the tools** — a curriculum spine; tools become stations on it.
- **All four application goals matter** (improv, songwriting, jamming, fluency) —
  fluency is the substrate woven throughout; improv is the first payoff arc.
- **Ear training integrated everywhere, early** — not a separate silo.
- **Self-guided practice first** — the app demonstrates and sets tasks, the user
  plays their real guitar. Design the exercise system so mic-based verification
  can slot in later as the flagship paid feature; don't build it yet.

---

## The five cruxes (what actually matters)

This is the pedagogical core — the small set of load-bearing ideas that unstick
an intermediate. The curriculum is these, in order, with everything else hung off them.

### 1. Intervals, not shapes

The stuck intermediate sees the fretboard as memorised dot-patterns. The unlock
is relabelling every shape as **intervals from a root** — because the interval
is the thing you _hear_. A major 3rd sounds like a major 3rd anywhere on the
neck. Once the pentatonic box reads "root, ♭3, 4, 5, ♭7" instead of "dots,"
every other concept (chords, scales, modes) becomes legible, because they're all
just interval recipes.

**Opens up:** chord construction, scale comparison, why modes differ by one note,
moving anything anywhere on the neck.

### 2. Chord tones are home

The single biggest improvisation unlock, and the one almost nobody teaches
clearly: **the "right scale" is not what makes a solo sound good — landing on
the notes of the current chord is.** Em pentatonic "works over everything" in G
because its five notes are mostly chord tones of every diatonic chord. But a
player who targets the chord-of-the-moment's 3rd sounds _intentional_; a player
who noodles the key scale sounds like they're noodling the key scale.

**Opens up:** solos that follow the changes, phrasing that resolves, and the
correct mental model for "outside" notes (tension you choose, not mistakes).

### 3. Chords have jobs (function)

The seven diatonic chords aren't a list — they're three families: **rest**
(tonic), **motion** (subdominant), **tension** (dominant). Tension→resolution is
the engine of all Western harmony. Once you _hear_ V→I as "leaning → arriving,"
progressions stop being arbitrary letter sequences and become predictable
physics — which is what lets you jam (predict the next chord), write (choose a
feeling on purpose), and remember songs (as roman numerals, not letter soup).

**Opens up:** songwriting, following changes by ear, transposing instantly.

### 4. One note makes the colour

Every mode/scale differs from its nearest familiar reference by one or two
notes, and the colour lives _there_. Dorian = minor + natural 6. Mixolydian =
major + ♭7. Lydian = major + ♯4. Modes go from "seven shapes to memorise" to
"seven flavours to reach for" the moment you can hear and deliberately target
the characteristic note.

**Opens up:** modes as usable vocabulary; knowing _when_ to use a scale, not
just what it contains.

### 5. The ear leads, the name follows

Theory is a naming system for things you can already hear. A concept you can't
hear is inert — it won't show up in your playing. So every concept in the app
gets its sound attached at first contact, and every exercise has an ear
component. This isn't a feature, it's a design law.

**Opens up:** everything above actually transferring to real music.

---

## The exercise ladder (why what exercise opens what)

Every module teaches every concept through the same four rungs, in order. This
is the design rubric for all practice content:

| Rung               | What it is                                             | Why it works                                                                              | Example                                                                              |
| ------------------ | ------------------------------------------------------ | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| **1. See it**      | Tool visualisation                                     | Builds the map                                                                            | Explorer shows Dorian across the neck                                                |
| **2. Hear it**     | A/B audio comparison, play buttons                     | Attaches sound to symbol — without this, knowledge doesn't transfer to music              | Dorian vs Aeolian over the same Am drone; spot the ♮6                                |
| **3. Retrieve it** | Scored in-app quiz                                     | Retrieval practice moves it to long-term memory; recognition alone fades                  | "Tap every major 3rd of C" / "Which of these two clips was Dorian?"                  |
| **4. Apply it**    | Constraint task on your real guitar, over a drone/loop | Constraint-based practice converts knowledge to instinct — the constraint IS the exercise | "Loop Am. Solo using only chord tones. Now you may add ONE passing note per phrase." |

Rungs 1–3 happen in the app and can be checked. Rung 4 is self-guided (the app
demonstrates, sets the constraint, and plays the loop) — designed so mic
verification can upgrade it later.

---

## The curriculum arc (the path, v1)

Modules in order. Each maps to an existing tool as its lab — the five tools
already cover most of the arc, which is why path-over-tools is cheap for us.

| #   | Module                                          | Crux    | Lab (existing tool)        | Application payoff                            |
| --- | ----------------------------------------------- | ------- | -------------------------- | --------------------------------------------- |
| 0   | Notes on the neck                               | fluency | Explorer (note mode)       | Find any note in <3s; octave shapes           |
| 1   | Intervals — the alphabet                        | 1       | Explorer (degree mode)     | Name/find any interval from any root          |
| 2   | Building chords                                 | 1→2     | CAGED + Chord-Scale        | Know what's _in_ the chord you're holding     |
| 3   | The major scale & keys                          | 3       | Explorer                   | Why these 7 notes; key signatures as siblings |
| 4   | Diatonic chords & function                      | 3       | Diatonic + Progressions    | Write/predict progressions; roman numerals    |
| 5   | Why pentatonics work over everything            | 2       | Chord-Scale                | The Em-over-everything question, answered     |
| 6   | Chord-tone targeting                            | 2       | Chord-Scale + Progressions | **The improv unlock** — soloing over changes  |
| 7   | Modes as colours                                | 4       | Explorer                   | When to reach for which sound                 |
| 8   | Beyond diatonic (borrowed, secondary dominants) | 3       | Progressions               | The "how did they DO that" chords             |

Crux 5 (ear) is woven through every module, not a module itself.
Goal mapping: fluency = M0–M2 substrate · improv = M2→M5→M6 · songwriting =
M3→M4→M8 · jamming = M4 + ear rungs everywhere.

---

## Phases

Ordered so every phase ships standalone value, and each unblocks the next.
Pedagogy audits (`/guitar-pedagogy-review`) are ongoing hygiene across all
phases, not a phase of their own.

### Phase 1 — Audio as a teaching instrument (prerequisite for everything)

Audio currently proves the concept (click a note, hear it). Turn it into the
teaching layer the ear-first design law needs.

- [x] ~~**Play scale** button on Explorer — ascending/descending, notes light up on the fretboard in sync~~ — runs the _selected box_ (position 1 when showing the whole neck) root-to-root and back, walking real string/fret positions so what you hear is the shape you're looking at
- [ ] **Play chord** button on Chord-Scale / Diatonic / CAGED — strum with slight offset, tones light up
- [ ] **A/B comparison player** (new component) — two variants of the same phrase over the same root, user toggles; the characteristic note visually flagged. First uses: Dorian/Aeolian, Mixolydian/Ionian, Lydian/Ionian, maj3/min3
- [ ] **Drone/loop player** (new component) — sustained root or looped chord vamp the user can leave running while they play. This is the backing for every rung-4 exercise
- [ ] **Progression playback** on Progressions — hear the 4 slots in time; this makes function audible (V _leaning_ into I)

### Phase 2 — The exercise engine (looking → doing)

One generic framework, then exercise types as content. Persistence in
`localStorage` first; accounts come in Phase 5.

- [ ] **Exercise framework**: prompt → interaction → result → next. Typed exercise definitions co-located per module, like `explanations.ts`. Session of ~10, immediate feedback, end summary
- [ ] Exercise type: **find-the-note** — "tap every A on strings 5–6" (fretboard becomes the input surface)
- [ ] Exercise type: **name-the-interval** — two notes highlighted, pick the interval; then reversed ("tap the ♭7 of G")
- [ ] Exercise type: **ear A/B** — hear a clip, identify which of two choices (maj/min 3rd, Dorian/Aeolian, V→I vs IV→I)
- [ ] Exercise type: **chord-tone tap** — chord shown, tap its tones inside a scale shape before the timer
- [ ] Exercise type: **constraint task** (rung 4) — instruction card + drone/loop + demo playback + "how did it go?" self-report
- [ ] **Progress persistence** — per-exercise history, per-module completion, in `localStorage` behind a small store API that a future backend can replace

### Phase 3 — The Path (the spine)

The differentiator. The journey router grows into a real "you are here."

- [ ] **`/path` route** — the 9 modules as a visual journey with completion state; free-roam allowed (it's a map, not a cage — tools stay directly accessible)
- [ ] **Module page template** — concept explainer (the crux, in our voice standard) → lab link with preset state (deep-link the tool pre-configured for the lesson) → exercise session → rung-4 application task
- [ ] **Deep-linkable tool state** — URL params set key/scale/chord so path modules and cross-links can open a tool "ready" (also makes every tool state shareable — growth win)
- [ ] **Write modules 0–2** (notes, intervals, chords) — the fluency substrate
- [ ] **Write modules 3–5** (major scale, function, pentatonics)
- [ ] **Write modules 6–8** (chord-tone targeting, modes, beyond diatonic)
- [ ] **Home page**: journey router routes into the path, not just the tools

### Phase 4 — Application arenas (where it becomes music)

- [ ] **Jam mode** on Progressions — pick a progression, loop it at a chosen tempo, fretboard shows the current chord's tones highlighted _as the loop plays_, with targeting prompts ("land on the 3rd when the chord changes"). This is chord-tone targeting (M6) made physical
- [ ] **Circle of Fifths page** (existing roadmap item) — built as the M3/M4 lab: why keys are neighbours, relative pairs, sharps/flats as you rotate, with audio
- [ ] **Ear-training expansion** — interval recognition beyond A/B (all 12), chord quality (maj/min/dim/7th), progression function (hear 4 chords, name the romans)

### Phase 5 — Production & business (broad strokes only — detail later)

- [ ] **Accounts + sync** (progress moves from localStorage to a backend; simplest viable: Supabase or similar)
- [ ] **Paywall seam**: free = all five tools + modules 0–2; paid = full path, jam mode, ear-training expansion. Later flagship paid feature: mic-based feedback
- [ ] **Growth loops**: every concept/module page SEO-targeted at real search queries ("why does Em pentatonic work over everything"); shareable deep-linked fretboard states; A/B audio demos as short-video-friendly content
- [ ] **Instrumentation**: privacy-light analytics on module completion and exercise drop-off — the data that tells us where the pedagogy fails, and what an acquirer wants to see

### Later / bets (not scheduled)

- Mic pitch detection for real feedback on rung-4 tasks (the paid flagship)
- Spaced-repetition scheduling of exercise reviews
- Personalised path entry (diagnostic quiz → skip what you know)
- Rhythm/phrasing content (real gap for intermediates, but a different product muscle — revisit after M0–M8 proves out)

---

## Why the guided path is the right business call

- **Retention**: tools are look-up-and-leave; a path with progress is come-back-tomorrow. Retention is the number that makes freemium work.
- **Differentiation**: free fretboard visualisers are a commodity. A sequenced, ear-integrated, application-first curriculum for the stuck intermediate is not.
- **Paywall seam**: "the first modules free, the arc paid" is a natural, non-hostile gate — users pay after the product has already helped them.
- **Acquisition story**: buyers (Fender, Yousician, edtech) buy curriculum + engagement metrics, not widgets.

---

## Decision log

- **2026-08-09** — Roadmap created. Spine = guided path over tools; ear integrated early; self-guided practice first, mic later; all four application goals targeted with improv as first payoff arc.
- **2026-08-09** — Scale playback plays the **box on screen**, not an abstract pitch list. A run of decontextualised pitches teaches the sound of a scale but nothing about the neck; walking the real string/fret positions of the selected position, with each note lighting as it sounds, ties sound to shape — which is crux 1 (intervals, not shapes) and crux 5 (ear leads) doing their job together. Runs are trimmed root-to-root so the ear gets resolution, and playback stops the moment the board changes underneath it.
