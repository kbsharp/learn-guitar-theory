import { test, expect } from '@playwright/test';

const themes = ['void', 'midnight', 'chalk'] as const;

test('default theme is void', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'void');
});

for (const theme of themes) {
	test(`switching to ${theme} theme updates data-theme attribute`, async ({ page }) => {
		await page.goto('/');
		await page
			.getByRole('button', {
				name: `Switch to ${theme.charAt(0).toUpperCase() + theme.slice(1)} theme`
			})
			.click();
		await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
	});

	test(`${theme} theme persists on page reload`, async ({ page }) => {
		await page.goto('/');
		await page
			.getByRole('button', {
				name: `Switch to ${theme.charAt(0).toUpperCase() + theme.slice(1)} theme`
			})
			.click();
		await page.reload();
		await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
	});
}

test('theme switcher shows all three options', async ({ page }) => {
	await page.goto('/');
	const switcher = page.locator('.theme-switcher');
	await expect(switcher).toBeVisible();
	await expect(switcher.locator('button')).toHaveCount(3);
});

test('active theme button has aria-pressed=true', async ({ page }) => {
	await page.goto('/');
	// Switch to midnight
	await page.getByRole('button', { name: 'Switch to Midnight theme' }).click();
	const activeBtn = page.getByRole('button', { name: 'Switch to Midnight theme' });
	await expect(activeBtn).toHaveAttribute('aria-pressed', 'true');
	// Others are false
	await expect(page.getByRole('button', { name: 'Switch to Void theme' })).toHaveAttribute(
		'aria-pressed',
		'false'
	);
	await expect(page.getByRole('button', { name: 'Switch to Chalk theme' })).toHaveAttribute(
		'aria-pressed',
		'false'
	);
});

test('chalk theme applies light background', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('button', { name: 'Switch to Chalk theme' }).click();
	// The body background should be a light colour — check the computed style
	const bgColor = await page.evaluate(() =>
		getComputedStyle(document.documentElement).getPropertyValue('--bg-base').trim()
	);
	// Chalk --bg-base is #f4f4f5
	expect(bgColor).toBe('#f4f4f5');
});
