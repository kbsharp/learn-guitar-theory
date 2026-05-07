import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes = ['/', '/guitar-theory', '/chord-scale', '/diatonic', '/caged', '/progressions'];

test('a11y audit — all routes', async ({ page }) => {
	const report: string[] = [];

	for (const route of routes) {
		await page.goto(route);
		await page.waitForTimeout(600);

		const results = await new AxeBuilder({ page })
			.withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
			.analyze();

		if (results.violations.length > 0) {
			report.push(`\n══ ${route} ══`);
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

	console.log(report.join('\n'));
	expect(report.length, 'Accessibility violations found — see console output above').toBe(0);
});
