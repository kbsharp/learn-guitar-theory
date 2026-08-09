import { test, expect } from '@playwright/test';

// ── Guitar Theory / Fretboard Explorer ───────────────────────────────────────

test('guitar-theory — fretboard shows lit notes for default selection', async ({ page }) => {
	await page.goto('/guitar-theory');
	// At least some notes should be visible (in-scale class applied)
	const litNotes = page.locator('.in-scale');
	await expect(litNotes.first()).toBeVisible();
});

test('guitar-theory — changing key updates the fretboard', async ({ page }) => {
	await page.goto('/guitar-theory');
	// Click G key
	await page.getByRole('button', { name: /^G$/ }).first().click();
	// Fretboard still has lit notes
	await expect(page.locator('.in-scale').first()).toBeVisible();
});

test('guitar-theory — position selector highlights a fret range', async ({ page }) => {
	await page.goto('/guitar-theory');
	// data-theme is set by $effect in layout — its presence confirms Svelte has hydrated
	// and event listeners are attached (unlike .in-scale which is present in SSR HTML)
	await page.waitForSelector('html[data-theme]');
	// Click position 2 using the specific btn-position class to avoid ambiguity
	await page.locator('.btn-position', { hasText: '2' }).click();
	// dim-note class indicates notes outside the selected position are dimmed
	await expect(page.locator('.dim-note').first()).toBeVisible();
});

test('guitar-theory — A/B comparison moves the characteristic note one fret', async ({ page }) => {
	await page.goto('/guitar-theory');
	await page.waitForSelector('html[data-theme]');
	// C Ionian by default: the ♮7 (B) is what separates it from Mixolydian.
	await expect(page.locator('.ab-degree')).toHaveText('♮7');
	const ringed = page.locator('.note-btn.characteristic');
	await expect(ringed.first()).toHaveText('B');

	// Selecting B redraws the board as the reference scale, so the ring lands
	// on the ♭7 a fret below — the whole point of the exercise.
	await page.locator('.ab-btn').nth(1).click();
	await expect(page.locator('.ab-degree')).toHaveText('♭7');
	await expect(ringed.first()).toHaveText('A#');
	await expect(page.locator('.ab-showing')).toContainText('Mixolydian');

	// Flipping back mid-listen has to work — it's the interaction, not an edge
	// case. The outgoing run must not tear down the incoming one.
	await page.locator('.ab-btn').first().click();
	await expect(page.locator('.ab-btn').first()).toHaveClass(/sounding/);
	await expect(ringed.first()).toHaveText('B');
});

test('guitar-theory — starting an A/B take resets the Play scale button', async ({ page }) => {
	await page.goto('/guitar-theory');
	await page.waitForSelector('html[data-theme]');
	const play = page.locator('.play-btn');
	await play.click();
	await expect(play).toHaveText('Stop');
	// The A/B player takes the audio; a button left saying "Stop" would lie.
	await page.locator('.ab-btn').nth(1).click();
	await expect(play).toHaveText('Play scale');
});

// ── Chord-Scale Relationships ─────────────────────────────────────────────────

test('chord-scale — shows chord tones for default selection', async ({ page }) => {
	await page.goto('/chord-scale');
	await expect(page.locator('.in-scale').first()).toBeVisible();
});

test('chord-scale — switching chord type updates fretboard', async ({ page }) => {
	await page.goto('/chord-scale');
	// Click m7 chord type button
	await page.getByRole('button', { name: 'm7', exact: true }).click();
	await expect(page.locator('.in-scale').first()).toBeVisible();
});

// ── Diatonic Chords ───────────────────────────────────────────────────────────

test('diatonic — shows scale tones by default', async ({ page }) => {
	await page.goto('/diatonic');
	await expect(page.locator('.in-scale').first()).toBeVisible();
});

test('diatonic — selecting a chord highlights chord tones', async ({ page }) => {
	await page.goto('/diatonic');
	// Click the first chord button (I chord)
	const firstChord = page.locator('.btn-chord').first();
	await firstChord.click();
	// tonic class should now appear (chord tones)
	await expect(page.locator('.tonic').first()).toBeVisible();
	// The chord should appear as selected
	await expect(firstChord).toHaveClass(/active/);
});

test('diatonic — play chord button unlocks once a chord is selected', async ({ page }) => {
	await page.goto('/diatonic');
	const play = page.locator('.play-btn');
	// Nothing to strum yet, so the button says what to do first.
	await expect(play).toBeDisabled();
	await expect(play).toHaveText('Select a chord');
	await page.locator('.btn-chord').first().click();
	// Enables once the samples are in and there's a chord to play.
	await expect(play).toHaveText('Play chord');
	await expect(play).toBeEnabled();
});

test('diatonic — mode toggle switches between major and minor', async ({ page }) => {
	await page.goto('/diatonic');
	// Click minor mode
	await page.getByRole('button', { name: /minor/i }).click();
	// Diatonic chords update — check roman numerals for minor (i, ii°)
	await expect(page.locator('.roman').first()).toHaveText('i');
});

// ── CAGED System ──────────────────────────────────────────────────────────────

test('caged — shows chord tones by default', async ({ page }) => {
	await page.goto('/caged');
	await expect(page.locator('.in-scale').first()).toBeVisible();
});

test('caged — clicking a shape button highlights it', async ({ page }) => {
	await page.goto('/caged');
	// Click the second shape button (nth(1) skips the "All" button, hits first named shape)
	const shapeBtn = page.locator('.btn-shape').nth(1);
	await shapeBtn.click();
	await expect(shapeBtn).toHaveClass(/active/);
});

test('caged — play chord strums the shape and lights its notes', async ({ page }) => {
	await page.goto('/caged');
	const play = page.locator('.play-btn');
	await expect(play).toHaveText('Play chord');
	// Select the first named shape so the strum is confined to that box.
	await page.locator('.btn-shape').nth(1).click();
	await play.click();
	// Strings light one by one as the strum passes over them.
	await expect(page.locator('.note-btn.is-playing').first()).toBeVisible();
	// Nothing sounding outside the selected shape's window.
	await expect(page.locator('.note-btn.is-playing.dim-note')).toHaveCount(0);
	await play.click();
	await expect(page.locator('.note-btn.is-playing')).toHaveCount(0);
});

// ── Progressions ──────────────────────────────────────────────────────────────

test('progressions — preset cards are visible', async ({ page }) => {
	await page.goto('/progressions');
	const presets = page.locator('.preset-card');
	await expect(presets.first()).toBeVisible();
	// Should have multiple presets
	expect(await presets.count()).toBeGreaterThan(5);
});

test('progressions — clicking a preset activates it', async ({ page }) => {
	await page.goto('/progressions');
	const firstPreset = page.locator('.preset-card').first();
	await firstPreset.click();
	await expect(firstPreset).toHaveClass(/active/);
});

test('progressions — key buttons are present and clickable', async ({ page }) => {
	await page.goto('/progressions');
	// Click G key
	const gKey = page.locator('.btn-key', { hasText: 'G' }).first();
	await gKey.click();
	await expect(gKey).toHaveClass(/active/);
});
