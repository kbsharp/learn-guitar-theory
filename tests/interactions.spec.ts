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
	// Wait for positions to render, then click position 2
	const pos2 = page.locator('button', { hasText: '2' }).first();
	await pos2.click();
	// dim-note class indicates notes outside the selected position are dimmed
	await expect(page.locator('.dim-note').first()).toBeVisible();
});

// ── Chord-Scale Relationships ─────────────────────────────────────────────────

test('chord-scale — shows chord tones for default selection', async ({ page }) => {
	await page.goto('/chord-scale');
	await expect(page.locator('.in-scale').first()).toBeVisible();
});

test('chord-scale — switching chord type updates fretboard', async ({ page }) => {
	await page.goto('/chord-scale');
	// Click m7 chord type button
	await page.getByRole('button', { name: 'm7' }).click();
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
	// Click the second shape button
	const shapeBtn = page.locator('.shape-btn').nth(1);
	await shapeBtn.click();
	await expect(shapeBtn).toHaveClass(/active/);
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
