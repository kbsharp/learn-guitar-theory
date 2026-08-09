# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Non-negotiable code quality rules

- **Never leave a file with an error in it.** After every edit run `npm run check` and fix any type errors before moving on. Do not leave broken files and continue to other tasks.
- **Never write code that could break tests without first confirming tests still pass.** After any change to a `helpers.ts`, shared utility, config file, or component that existing tests cover, run `npm run test:unit -- --run` (unit) and/or `npm run check` before reporting the work as done. If a test breaks, fix it in the same step — do not leave a red suite.

## Commands

```bash
npm run dev          # start dev server (localhost:5173)
npm run build        # production build
npm run preview      # preview production build
npm run check        # Svelte type-check
npm run lint         # Prettier + ESLint check
npm run format       # auto-format with Prettier
npm run test         # Playwright e2e tests
npm run test:unit    # Vitest unit tests
```

## Product Vision

**Goal**: Turn the fretboard from a grid of shapes into a system a guitarist can _reason about_.

Every feature must pass this test: _does this help a guitarist understand something they were confused about, or hear something they couldn't hear before?_ Pretty visuals are acceptable only when they serve comprehension.

**Target audience**: Genre-agnostic and accessible to all skill levels — a beginner wanting to understand why their Em pentatonic works over everything, and a jazz player mapping chord-scale relationships, should both find value. **However**, the primary user we design _for_ is the stuck intermediate (see Product Direction below). Design decisions resolve in their favour when there's a trade-off.

**Full product roadmap**: see [ROADMAP.md](ROADMAP.md) — the working roadmap we iterate through, created 2026-08-09. It supersedes the old five-item priority list. Summary of its phases:

1. **Audio as a teaching instrument** — play scale/chord, A/B characteristic-note comparisons, drone/loop player, progression playback
2. **Exercise engine** — generic framework + exercise types (find-the-note, name-the-interval, ear A/B, chord-tone tap, constraint tasks), localStorage progress
3. **The Path** — `/path` curriculum spine of 9 modules built on the five cruxes; existing tools become the labs; deep-linkable tool state
4. **Application arenas** — jam mode (loop + live chord-tone highlighting), Circle of Fifths page, ear-training expansion
5. **Production & business** — accounts/sync, paywall seam (tools + modules 0–2 free), growth loops, instrumentation

Pedagogy audits (`/guitar-pedagogy-review`) are ongoing hygiene across all phases. ROADMAP.md also holds the pedagogical core — the five cruxes and the four-rung exercise ladder (see → hear → retrieve → apply) that all practice content must follow — plus a decision log. Update the decision log when product decisions are made.

## Product Direction

These decisions were made deliberately and should inform every content and feature choice.

### Target user: the stuck intermediate

The primary paying user is a guitarist who has played for **2-5 years**, is self-taught or lesson-taught, and knows their minor pentatonic, basic open chords, and maybe the CAGED shapes. They hit a wall: they know _what_ to play but not _why_ it works. They ask "why does my Em pentatonic work over everything?" and "how do I know which scale to use?"

This is not a beginner who doesn't know what a chord is. It is not an advanced player who already knows all their modes. Write for the guitarist who has the shapes and wants the theory behind them.

**Why this target**: Biggest addressable group, motivated, has disposable income (invested in gear), clear value proposition.

### Monetisation: freemium with acquisition as upside

- **Free tier**: all five current tools, full access — this is how the product spreads
- **Paid tier (future)**: audio playback, practice mode (active exercises), personalised learning path
- **Exit scenario**: build user base and pedagogical quality → acquisition target (Fender, Yousician, Guitar Center, edtech platforms)

No aggressive sales required. Product-led growth: the free tier is genuinely excellent, users upgrade themselves or recommend to others.

### Voice standard (extends the "What to DO" rule)

Every explanation — ExplanationPanel body, page intro, HelpTip definition — must meet all four of these:

1. **WHY**: Explains _why_, not just _what_. Not "Dorian is natural minor with a raised 6th" — explain what that raised 6th _does_ to the sound.
2. **DO**: Gives a concrete physical action the guitarist can try right now while holding their guitar. Specific enough to actually do.
3. **SOUND**: Gives a sonic anchor — a genre, an artist, or a description of what it sounds like. Abstract theory without a sonic reference doesn't stick.
4. **CALIBRATE**: Written for 2-5 years experience. Don't explain what a chord is. Don't assume they know what a tritone substitution is.

When an explanation references a concept that has a dedicated tool page, add a cross-link to that page.

### Audit tool

Run `/guitar-pedagogy-review` to audit all explanatory content against these standards. The skill reads every explanation file and page intro, scores each piece against the five criteria (WHY, DO, SOUND, CALIBRATION, CONNECT), and returns a prioritised list of improvements with suggested rewrites.

## Architecture

**SvelteKit** (v2) with file-based routing, **Svelte 5** (runes mode), **TypeScript**, **SCSS** via `vitePreprocess`, and **tonal** (v6) as the music theory engine.

### Routing

`src/routes/` uses SvelteKit conventions. Current routes:

- `/` — home (`+page.svelte`)
- `/guitar-theory` — Fretboard Explorer: key + scale/mode selector, 5 box positions, note/degree toggle
- `/chord-scale` — Chord-Scale Relationships: select chord type, see compatible scale highlighted
- `/diatonic` — Diatonic Chords: explore all 7 chords in a key, see tones on fretboard
- `/caged` — CAGED System: 5 major/minor chord shapes with fret positions
- `/progressions` — Progression Builder: 4-slot composer with Circle of Fifths and 12 presets

### SCSS and design tokens

Global styles (normalize.css reset, `:root` CSS custom properties, `body`) are loaded once via `+layout.svelte`'s `import './styles/main.scss'`. Component `<style lang="scss">` blocks do not need any explicit imports — they use CSS custom properties (`var(--accent-note)` etc.) which are always available globally.

The design token source of truth is `src/routes/styles/_styles.scss` — SCSS variables are defined there and mirrored as CSS custom properties in `:root`. Always define new tokens in both places.

### State management

`src/stores.ts` holds Svelte writable stores for all tools. Components read stores with the `$store` reactive syntax and write via `.set()`. Page-level reactive derivations use the `$derived()` rune.

Store groups by tool:

- **Fretboard Explorer**: `key`, `quality`
- **Chord-Scale**: `chordRoot`, `chordQuality`
- **Diatonic**: `diatonicKey`, `diatonicMode`, `selectedDiatonicChord`
- **CAGED**: `cagedKey`, `cagedQuality`
- **Progressions**: `progKey`, `progMode`, `progression` (4-chord array), `activeSlot`

### Music theory logic

Shared utility: `src/lib/music.ts` — canonical `convertFlatToSharp()` and `convertFlatsToSharps()`. All helpers import from here; do not redefine these functions locally.

Each route has a co-located `helpers.ts`:

- `guitar-theory/helpers.ts` — `getClassName()`, `getScaleDegree()`, `computeScalePositions()`, `currentTonic()`
- `chord-scale/helpers.ts` — `getChordScaleClass()`, `chordToScale` map
- `diatonic/helpers.ts` — `getDiatonicChords()`, `getDiatonicNoteClass()`, `getScaleNotes()`
- `caged/helpers.ts` — `computeCAGEDShapes()`, `getCAGEDNoteClass()`, `getChordTones()`
- `progressions/helpers.ts` — `getSlotChord()`, `getProgressionNoteClass()`, `getFunctionLabel()`, `formatRoman()`, preset definitions

All note comparisons use sharps internally; `convertFlatToSharp()` normalises flat notation before comparison. Tonal's `Scale.get()` and `Chord.get()` are the source of truth for scale membership and chord tones.

`src/lib/strings.ts` generates the 6-string chromatic note arrays using `Range.chromatic()` from tonal (sharps only, octave numbers stripped).

### Fretboard rendering

Three-layer composition inside `src/lib/components/Fretboard/Fretboard.svelte`:

1. `Frets.svelte` — absolutely positioned grid of 25 fret dividers + inlay dots (frets 3,5,7,9,12,…)
2. `Strings.svelte` — 6 strings × 25 notes; each note is a `<p>` element with class driven by a callback; string graphics are sibling `<div>` elements

The fretboard is fixed at 1200px wide — **intentionally not responsive yet** (mobile is roadmap item #2).

Classes applied to fret notes: `hide-note` (invisible), `in-scale` (cyan glow), `tonic` (pink glow), `dim-note` (15% opacity outside position range).

### Adding new scales or qualities

1. Add to the `Quality` enum in `guitar-theory/helpers.ts`
2. Add to the `qualities` array in `helpers.ts`
3. `getClassName()` passes the quality string directly to tonal's `Scale.get()` — tonal must recognise the string (e.g. `"dorian"`, `"phrygian"`, `"major pentatonic"`)

### Svelte 5 patterns used

- Props: `let { prop = default }: Props = $props()`
- Local reactive state: `let x = $state(value)`
- Derived values: `let y = $derived(expr)` — re-runs when any reactive dependency changes
- Event handlers: `onclick={handler}` (not `on:click`)
- Layout slot: `{@render children()}` (not `<slot />`)
- `$app/state` (not `$app/stores`) for `page`

---

## Self-updating instructions

**Always update this file when you discover something worth documenting** — a new architectural pattern, a design decision, a constraint, or a reusable convention. Do not wait to be asked. If you establish a new component pattern, add it here. If you learn something about how the app should behave for guitarists, add it here.

---

## Explanation System (roadmap priority #1)

The explanation system adds context-aware prose to each tool so the app teaches, not just displays.

**Design rules:**

- 2–3 sentences max per explanation. Guitarists want context, not lectures.
- Explain the _why_, not the _what_ — the UI already shows the what.
- Write for the intermediate guitarist who knows the shapes but not the theory behind them.
- Explanation copy lives in a co-located `explanations.ts` file per route, not inline in components.

**Explanation content is complete for all tools except Progressions.** Each tool has a co-located `explanations.ts` with typed content and a reactive `$derived` lookup in the page.

- `chord-scale/explanations.ts` — keyed by `ChordType`
- `guitar-theory/explanations.ts` — keyed by `Quality` enum value
- `diatonic/explanations.ts` — keyed by degree index (-1 = no selection, 0–6 = degree)
- `caged/explanations.ts` — keyed by lowercase shape name or `'all'`

**Implementation approach:**

- A typed `Record` in each `explanations.ts`
- A shared `<ExplanationPanel>` component: `src/lib/components/ExplanationPanel.svelte`
- Placed below controls, above the legend
- Driven by `$derived()` from current selection state

---

## HelpTip system

The `HelpTip` component (`src/lib/components/HelpTip.svelte`) provides inline contextual help without cluttering the interface. It renders a small `?` icon that opens a popover on click.

**Props**: `term: string`, `definition: string`

**Use it next to**: legend items, group labels, or any term a beginner might not know. Do not add it to every element — only where confusion is likely. Advanced users ignore the icons; beginners rely on them.

**Pattern**: the `term` and `definition` values should come from `src/lib/glossary.ts` for consistency, or be passed inline for short tool-specific context.

## Glossary

`src/lib/glossary.ts` is the single source of truth for all music theory term definitions. The `Glossary` component (`src/lib/components/Glossary.svelte`) renders a searchable modal accessible from the site header on every page.

**When adding a new term**: add it to `glossary.ts` in the appropriate category (`concept | chord | scale | interval`). Do not write definitions inline in components — the glossary is the canonical place.

**Current categories**: Concepts, Chord types, Scales & modes, Intervals & notation.

## Three-layer explanation approach

Every tool page should have three layers of explanation, increasing in depth:

1. **Page intro** (always visible, 2–3 sentences, muted style) — what the concept IS and what to DO with what you're seeing. Tells a beginner how to use the tool before they touch it. Add as a `<p class="page-intro">` below the page header.

2. **HelpTip icons** (hidden by default, click to reveal) — on legend items and confusing terms. Practical: what does "chord tone" mean for your playing, not just what it is theoretically.

3. **ExplanationPanel** (always visible, updates reactively) — per-selection "why does this scale work here." Lives between the controls and legend. Source in a co-located `explanations.ts` per route.

This layering means advanced users see a clean interface, intermediates can hover on unfamiliar terms, and beginners have everything they need without the page being overwhelming.

## Page-level patterns (established across all tool pages)

Every tool page follows this structure (except Progressions, not yet updated):

1. `.page-header` — tool name left, status/toggle right, `margin-bottom: 20px`
2. `.page-intro` — 2–3 sentence `<p>`, `font-size: 12px`, `opacity: 0.75`, `margin-bottom: 28px`
3. `<Fretboard />` — the visual
4. `.controls` — key/root/scale/chord selectors, `margin-top: 52px`
5. `<ExplanationPanel />` — reactive per-selection explanation
6. `.legend` — colour key with `<HelpTip>` on each item

Labels with HelpTips use a `.label-with-help` wrapper (`display: flex; align-items: center`) to keep the `?` inline with the label. The `.group-label` inside loses its own `margin-bottom` since `.label-with-help` handles spacing.

## "What to DO" rule

Every explanation on this site — whether in the page intro, HelpTip, or ExplanationPanel — must tell the guitarist what to _do_ with the information, not just what something _is_. The test: could a guitarist use this sentence while holding a guitar? If it's purely theoretical, rewrite it.

Examples:

- Bad: "Chord tones are the notes belonging to the chord."
- Good: "Chord tones are your anchor notes — start and end phrases here and you'll always sound intentional."

---

## Audio

`src/lib/audio.ts` is the only place that touches Tone.js. It plays a **sampled
acoustic guitar** (`static/samples/guitar-acoustic/`) through a `Tone.Sampler`,
not a synth — software synthesis doesn't sell an acoustic guitar at our scale.
Tone is dynamically imported (SSR-safe) and the AudioContext starts on the
first user gesture via `ensureAudio()`.

**Public API:**

| Export                         | Use                                                                      |
| ------------------------------ | ------------------------------------------------------------------------ |
| `playNote(pitch, durationSec)` | One note. Used by every clickable fret note.                             |
| `playSequence(pitches, opts)`  | Timed run. `opts`: `gapSec`, `onStep(index)`, `onEnd()`.                 |
| `playChord(pitches, opts)`     | Strum, bass string first. `opts`: `strumSec`, `durationSec`, same hooks. |
| `stopPlayback()`               | Cancel whatever is playing and silence ringing notes. Safe pre-load.     |
| `audioReady`                   | Readable store — gate Play buttons on this while samples download.       |
| `preloadAudio()`               | Call in `onMount` on any page with audio so samples are ready.           |

`playSequence` and `playChord` are thin wrappers over one private `schedulePitches` —
add new timed playback there rather than hand-rolling another Transport schedule.

**Sequencing rules (learned the hard way — don't regress these):**

- Sequences are scheduled on **Tone's Transport**, not raw `Tone.now()` offsets.
  Raw offsets can't be cancelled, and every teaching interaction needs a Stop.
- Only one sequence plays at a time; `playSequence` cancels any predecessor.
  A module-level `playbackGeneration` counter makes callbacks already queued
  for a cancelled run identify themselves as stale.
- `onStep` fires through **`Tone.getDraw()` backed by a `setTimeout`**, first
  one wins. Draw alone lands the highlight on the right animation frame but
  drops events it misses and never runs at all while the tab is hidden — a
  highlight that silently disappears is worse than one a frame late.
- `onEnd` is Transport-driven only. A stuck "playing" button is worse than
  resetting one lookahead-tick early.

**Syncing visuals to audio:** `<Fretboard>` takes a `playingNotes: { string,
fret }[]` prop, passed straight through to `Strings.svelte`, which adds
`.is-playing` to those note buttons — one entry for a scale run, the whole
voicing for a strummed chord. Notes are identified by **string+fret, not note
name**, since
the same name appears all over the neck.

**Building a playable run:** `computeScaleRun()` in `guitar-theory/helpers.ts`
is the reference implementation — collect scale notes inside the fret window,
sort by MIDI, collapse unisons to the lower string, trim root-to-root. Copy
that shape for arpeggio runs rather than playing abstract pitch lists:
what the user hears should be the shape they're looking at.

**Building a chord:** `computeChordVoicing()` in `src/lib/voicing.ts` — root in
the bass, then the lowest chord tone within reach on every string above. Pass a
fret window to keep the whole voicing inside a highlighted box (a CAGED shape, a
scale position); omit it to get the lowest comfortable position. Chord tones are
matched by **pitch class**, so tonal's flat and odd spellings (Bb, E#) need no
normalising at the call site. `voicing.test.ts` pins the canonical shapes the
rule produces (open E, open Am, the E- and A-shape barres, the CAGED D shape) —
if those break, the voicings have stopped being real guitar chords.

**Shared audio UI components:**

- `PlayButton.svelte` — the one Play/Stop control. Props: `label`, `playing`,
  `loading`, `disabled`, `hint` (replaces the label while disabled, e.g. "Select
  a chord"), `onclick`. Lives in `.page-header`, right-hand side, on every tool.
- `ChordPlayer.svelte` — `PlayButton` plus the strum state. Give it a `voicing`
  and `bind:playingNotes`, then hand `playingNotes` to `<Fretboard>`. It
  preloads samples on mount and cancels playback whenever the voicing changes,
  so pages don't repeat that wiring.

---

## Mobile Strategy (roadmap priority #2)

The fretboard is the core problem. Options when implementing:

- **Horizontal scroll**: wrap fretboard in a scrollable container, keep 1200px inner width, add scroll-shadow indicators
- **Compact mode**: at <768px, render fewer frets (e.g. frets 0–12 only) with larger note circles
- **Portrait fretboard**: rotate to show strings as columns (unusual but better on portrait phones)

Recommendation: **horizontal scroll first** (least redesign, ships fast), then explore compact mode based on user feedback.

Controls (key selector, chord buttons, etc.) must stack vertically on mobile and be at least 44px tall for touch targets.

---

## Testing

### Unit tests (Vitest) — `npm run test:unit`

Each `helpers.ts` has a co-located `helpers.test.ts`. The shared utilities have `src/lib/music.test.ts` and `src/lib/voicing.test.ts`. Tests run in ~1s and are the first thing to check after any logic change.

Tests cover: `convertFlatToSharp`, `getClassName`, `getScaleDegree`, `computeScalePositions`, `getDiatonicChords`, `getScaleNotes`, `getDiatonicNoteClass`, `computeCAGEDShapes`, `getChordTones`, `getCAGEDNoteClass`, `getSlotChord`, `getFunctionLabel`, `formatRoman`, `getBorrowedChords`, `computeChordVoicing`.

**Adding new helper functions**: write a co-located test before the function reaches the page. Pure functions (no DOM, no Svelte stores) only — keep tests free of mocking.

### E2E tests (Playwright) — `npm run test`

Playwright builds the app and runs against the preview server on port 4173. Four test files:

| File                         | Covers                                                                              |
| ---------------------------- | ----------------------------------------------------------------------------------- |
| `tests/test.ts`              | Smoke — home page renders                                                           |
| `tests/navigation.spec.ts`   | All routes load, correct titles, active nav links, fretboard presence               |
| `tests/theme.spec.ts`        | Theme switcher updates `data-theme`, persists in `localStorage`, aria-pressed state |
| `tests/a11y.spec.ts`         | WCAG 2.1 AA audit across all 6 routes × 3 themes (axe-core)                         |
| `tests/interactions.spec.ts` | Key tool interactions: key change, chord selection, preset activation               |

**Themes are tested individually** in `a11y.spec.ts` — each theme is applied via `localStorage` before page load so the Svelte store picks it up correctly.

**When adding a new route**: add it to the `routes` array in both `navigation.spec.ts` and `a11y.spec.ts`.

---

## CI / CD

Hosted on **Vercel free tier** — Vercel's GitHub integration handles deployment automatically on push to `master`.

**GitHub Actions** (`.github/workflows/ci.yml`) runs two jobs on every push and PR to `master`:

1. **check** (fast, ~1 min): `svelte-check` → `lint` → `test:unit`. Runs on every push/PR. Fails fast before wasting build minutes.
2. **e2e** (slower, ~4 min): builds the app then runs Playwright (chromium only). Uploads traces as artifacts on failure.

Playwright traces are retained for 7 days — download from the Actions run to debug failing screenshots.

**Never merge a PR with a failing `check` job.** The `e2e` job is the safety net; the `check` job is the gate.

---

## Known Issues / Notes

- The `$black` and `$key-color` SCSS variables were removed in the latest refactor; don't re-add them
- `src/routes/styles/main.scss` uses Sass `@import` (deprecated in Dart Sass 3); the warning is cosmetic
- `@neoconfetti/svelte` is installed but unused — remove when cleaning up deps
