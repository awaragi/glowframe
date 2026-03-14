## 1. Configuration

- [x] 1.1 Add `const isProdMode = process.env.E2E_TARGET === 'prod'` at the top of `playwright.config.ts`
- [x] 1.2 Set `use.baseURL` to `isProdMode ? 'https://awaragi.github.io/glowframe/' : 'http://localhost:5173'` in `playwright.config.ts`
- [x] 1.3 Wrap the `webServer` block in a conditional so it is only included when `!isProdMode`

## 2. Scripts

- [x] 2.1 Add `"test:e2e:prod": "E2E_TARGET=prod playwright test"` to the `scripts` section of `package.json`

## 3. Verification

- [x] 3.1 Run `npm run test:e2e` and confirm all existing E2E tests pass (local mode unchanged)
- [x] 3.2 Run `npm run test:e2e:prod` and confirm the smoke test passes against the live GitHub Pages deployment
