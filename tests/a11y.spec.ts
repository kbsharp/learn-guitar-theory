import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes = ['/', '/guitar-theory', '/chord-scale', '/diatonic', '/caged', '/progressions'];
const themes = ['void', 'midnight', 'chalk'] as const;

for (const theme of themes) {
	test(`a11y audit — ${theme} theme`, async ({ page }) => {
		// Apply theme before any navigation so the store picks it up from localStorage
		await page.addInitScript((t) => localStorage.setItem('theme', t), theme);

		const report: string[] = [];

		for (const route of routes) {
			await page.goto(route);
			// Wait for theme attribute and any reactive rendering to settle
			await page.waitForFunction(
				(t) => document.documentElement.getAttribute('data-theme') === t,
				theme
			);

			const results = await new AxeBuilder({ page })
				.withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
				.analyze();

			if (results.violations.length > 0) {
				report.push(`\n══ [${theme}] ${route} ══`);
				for (const v of results.violations) {
					report.push(`  [${(v.impact ?? 'unknown').toUpperCase()}] ${v.id}: ${v.description}`);
					v.nodes.slice(0, 3).forEach((n) => {
						const d = (n.any[0]?.data ?? {}) as Record<string, unknown>;
						const ratio = d.contrastRatio ? ` ratio:${d.contrastRatio}` : '';
						const colors = d.fgColor ? ` fg:${d.fgColor} bg:${d.bgColor}` : '';
						report.push(`    • ${n.target.join(' ')}${colors}${ratio}`);
					});
				}
			}
		}

		if (report.length > 0) console.log(report.join('\n'));
		expect(report.length, `Accessibility violations found in ${theme} theme — see console output above`).toBe(0);
	});
}
