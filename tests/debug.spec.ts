import { test, expect } from '@playwright/test';

// Override to use dev server
test.use({ baseURL: 'http://localhost:5173' });

test('position click on dev server guitar-theory', async ({ page }) => {
    await page.goto('/guitar-theory');
    await page.waitForTimeout(2000);
    const dataTheme = await page.locator('html').getAttribute('data-theme');
    console.log('data-theme:', dataTheme);
    await page.locator('.btn-position', { hasText: '2' }).click();
    await page.waitForTimeout(500);
    const dimCount = await page.locator('.dim-note').count();
    const pos2Active = await page.locator('.btn-position', { hasText: '2' }).evaluate((el: Element) => el.classList.contains('active'));
    console.log('dim-note count:', dimCount, 'pos2 active:', pos2Active);
});
