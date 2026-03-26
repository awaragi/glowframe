import { defineConfig, devices } from '@playwright/test'

const isProdMode = process.env.E2E_TARGET === 'prod'
const isDemoMode = process.env.E2E_DEMO === 'true'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: !isDemoMode,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: isDemoMode ? 1 : process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [['dot']]
    : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: isProdMode ? 'https://awaragi.github.io/glowframe/' : 'http://localhost:5173',
    trace: 'on-first-retry',
    launchOptions: {
      headless: !isDemoMode,
      slowMo: isDemoMode ? 800 : 0,
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  ...(!isProdMode && {
    webServer: {
      command: 'npm run dev',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
    },
  }),
})
