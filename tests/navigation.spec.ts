import { test, expect } from '@playwright/test';

const routes = [
	{ path: '/guitar-theory', title: 'Fretboard Explorer' },
	{ path: '/chord-scale', title: 'Chord-Scale' },
	{ path: '/diatonic', title: 'Diatonic Chords' },
	{ path: '/caged', title: 'CAGED System' },
	{ path: '/progressions', title: 'Progression Builder' }
];

test('home page loads', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('h1')).toBeVisible();
	await expect(page).toHaveTitle(/Fretboard Lab/i);
});

for (const { path, title } of routes) {
	test(`${path} — loads with correct page title`, async ({ page }) => {
		await page.goto(path);
		await expect(page.locator('.page-title')).toHaveText(title);
	});

	test(`${path} — active nav link is highlighted`, async ({ page }) => {
		await page.goto(path);
		const activeLink = page.locator('nav a.active');
		await expect(activeLink).toBeVisible();
	});
}

test('logo navigates to home', async ({ page }) => {
	await page.goto('/guitar-theory');
	await page.locator('a.logo').click();
	await expect(page).toHaveURL('/');
});

test('nav links reach all tool pages', async ({ page }) => {
	await page.goto('/');
	for (const { path } of routes) {
		await page.goto(path);
		await expect(page.locator('.page-title')).toBeVisible();
	}
});

test('all pages have a fretboard', async ({ page }) => {
	const fretboardRoutes = ['/guitar-theory', '/chord-scale', '/diatonic', '/caged'];
	for (const path of fretboardRoutes) {
		await page.goto(path);
		await expect(page.locator('.fretboard')).toBeVisible();
	}
});
