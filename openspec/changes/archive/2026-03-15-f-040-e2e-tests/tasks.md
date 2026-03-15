## 1. Verify Playwright Configuration

- [x] 1.1 Confirm `@playwright/test` is listed in `devDependencies` in `package.json`
- [x] 1.2 Confirm `playwright.config.ts` exists at the repo root with Chromium project, `testDir: './e2e'`, `baseURL: 'http://localhost:5173'`, and `webServer` integration pointing at `npm run dev`
- [x] 1.3 Confirm `npm run test:e2e` script in `package.json` executes `playwright test`
- [x] 1.4 Install Playwright browser binaries (`npx playwright install --with-deps chromium`) if not already installed

## 2. Smoke Test

- [x] 2.1 Confirm `e2e/smoke.spec.ts` exists with a scenario that navigates to `/` and asserts the page title matches `/GlowFrame|Vite/`
- [x] 2.2 Add an assertion to the smoke test that the `#root` element is visible
- [x] 2.3 Run `npm run test:e2e` and confirm all smoke tests pass on Chromium

## 3. Validation

- [x] 3.1 Verify Playwright does not discover any files from `src/` (run `npx playwright test --list` and confirm only `e2e/` files appear)
- [x] 3.2 Confirm `npm run test` (Vitest) still passes and is unaffected by the Playwright setup
