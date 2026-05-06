# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

## Architecture

**SvelteKit** (v1.5) with file-based routing, **TypeScript**, **SCSS** preprocessed globally via Vite, and **tonal** (v4.14) as the music theory engine.

### Routing

`src/routes/` uses SvelteKit conventions. Current routes:
- `/` — home (`+page.svelte`)
- `/guitar-theory` — fretboard explorer (`guitar-theory/+page.svelte`)

### Global SCSS injection

`svelte.config.js` injects `src/routes/styles/main.scss` into every component automatically via `additionalData`. This means all SCSS variables and CSS custom properties are available in every `<style lang="scss">` block without explicit imports.

The design token source of truth is `src/routes/styles/_styles.scss` — SCSS variables are defined there and mirrored as CSS custom properties in `:root`. Always define new tokens in both places.

### State management

`src/stores.ts` holds two global writable stores: `key` (current musical key) and `quality` (scale type). Components subscribe to these directly — there is no derived state layer.

### Music theory logic

`src/routes/guitar-theory/helpers.ts` is the core logic file:
- `getClassName(note, key, tonic, quality)` — determines which CSS class to apply to each fret note (`hide-note` / `in-scale` / `tonic`)
- Uses `Scale.get()` from tonal to resolve scale membership
- All note comparisons use sharps internally; `convertFlatToSharp()` normalises flat notation before comparison

`src/routes/guitar-theory/strings.ts` generates the 6-string chromatic note arrays using `Range.chromatic()` from tonal (sharps only, octave numbers stripped).

### Fretboard rendering

Three-layer composition inside `Fretboard.svelte`:
1. `Frets.svelte` — absolutely positioned grid of 25 fret dividers + inlay dots
2. `Strings.svelte` — 6 strings × 25 notes; each note is a `<p>` element with a class driven by `getClassName()`; string graphics are sibling `<div>` elements positioned absolutely

The fretboard is fixed at 1200px wide (Strings) / 1250px container (page) — not responsive.

### Adding new scales or qualities

1. Add to the `Quality` enum in `helpers.ts`
2. Add to the `qualities` array in `helpers.ts`
3. `getClassName()` passes the quality string directly to tonal's `Scale.get()` — tonal must recognise the string (e.g. `"dorian"`, `"phrygian"`, `"major pentatonic"`)

### Known issues / notes

- `convertFlatsToSharps()` in `helpers.ts` has a stray `console.log` that prints scale notes on every render
- The `$black` and `$key-color` SCSS variables were removed in the latest refactor; don't re-add them
