import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: 'tests',
	fullyParallel: true,
	// One retry, not two. A retry only costs time when something is already
	// failing, and a third attempt has never turned a red suite green here —
	// it just triples how long a genuine failure takes to report.
	retries: process.env.CI ? 1 : 0,
	reporter: process.env.CI ? 'github' : 'list',
	timeout: 30_000,
	use: {
		baseURL: 'http://localhost:4173',
		trace: 'on-first-retry'
	},
	projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
	webServer: {
		// CI builds in its own step, so building here too would compile the app
		// twice per run. Locally there's no such step, so build on demand —
		// otherwise `playwright test` happily tests a stale build.
		command: process.env.CI ? 'npm run preview' : 'npm run build && npm run preview',
		url: 'http://localhost:4173',
		reuseExistingServer: !process.env.CI,
		timeout: 120_000
	}
});
