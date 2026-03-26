## 1. Playwright Config

- [x] 1.1 Read `process.env.E2E_DEMO` in `playwright.config.ts` and assign to an `isDemoMode` boolean
- [x] 1.2 Set `headless: !isDemoMode` inside `use.launchOptions` (or top-level `use`) when demo mode is active
- [x] 1.3 Set `slowMo: isDemoMode ? 800 : 0` inside `use.launchOptions`
- [x] 1.4 Set `fullyParallel: !isDemoMode` at the top-level config (overrides the existing `fullyParallel: true`)

## 2. npm Script

- [x] 2.1 Add `"test:e2e:demo": "E2E_DEMO=true playwright test"` to the `scripts` block in `package.json`

## 3. Verification

- [ ] 3.1 Run `npm run test:e2e:demo` and confirm a visible Chrome window opens with noticeably slowed interactions and sequential test execution
- [x] 3.2 Run `npm run test:e2e` and confirm all tests still pass headlessly at full speed (no regression)
- [x] 3.3 Run `npm run build` to confirm no TypeScript compilation errors
