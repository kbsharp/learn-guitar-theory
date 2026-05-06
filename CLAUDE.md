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

**SvelteKit** (v2) with file-based routing, **Svelte 5** (runes mode), **TypeScript**, **SCSS** via `vitePreprocess`, and **tonal** (v6) as the music theory engine.

### Routing

`src/routes/` uses SvelteKit conventions. Current routes:
- `/` — home (`+page.svelte`)
- `/guitar-theory` — fretboard explorer (`guitar-theory/+page.svelte`)

### SCSS and design tokens

Global styles (normalize.css reset, `:root` CSS custom properties, `body`) are loaded once via `+layout.svelte`'s `import './styles/main.scss'`. Component `<style lang="scss">` blocks do not need any explicit imports — they use CSS custom properties (`var(--accent-note)` etc.) which are always available globally.

The design token source of truth is `src/routes/styles/_styles.scss` — SCSS variables are defined there and mirrored as CSS custom properties in `:root`. Always define new tokens in both places.

### State management

`src/stores.ts` holds Svelte writable stores for all three tools. Components read stores with the `$store` reactive syntax and write via `.set()`. Page-level reactive derivations use the `$derived()` rune.

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

### Svelte 5 patterns used

- Props: `let { prop = default }: Props = $props()`
- Local reactive state: `let x = $state(value)`
- Derived values: `let y = $derived(expr)` — re-runs when any reactive dependency changes
- Event handlers: `onclick={handler}` (not `on:click`)
- Layout slot: `{@render children()}` (not `<slot />`)
- `$app/state` (not `$app/stores`) for `page`

### Known issues / notes

- `convertFlatsToSharps()` in `helpers.ts` has a stray `console.log` that prints scale notes on every render
- The `$black` and `$key-color` SCSS variables were removed in the latest refactor; don't re-add them
- `src/routes/styles/main.scss` uses Sass `@import` (deprecated in Dart Sass 3); the warning is cosmetic
