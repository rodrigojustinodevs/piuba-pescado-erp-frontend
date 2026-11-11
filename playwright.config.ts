import { defineConfig, devices } from '@playwright/test';

const PORT = 3100;
const isCI = !!process.env.CI;
// Para testar um servidor já em execução (ex.: E2E_BASE_URL=http://localhost:3000).
const externalBaseUrl = process.env.E2E_BASE_URL;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  reporter: isCI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: externalBaseUrl ?? `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
    // Localmente reaproveita o Chrome instalado; no CI usa o Chromium do Playwright.
    channel: isCI ? undefined : 'chrome',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: externalBaseUrl
    ? undefined
    : {
        command: isCI ? `pnpm start -p ${PORT}` : `pnpm dev -p ${PORT}`,
        url: `http://localhost:${PORT}/login`,
        reuseExistingServer: !isCI,
        timeout: 120_000,
      },
});
