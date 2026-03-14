## Why

Playwright tests are currently hardcoded to target the local dev server (`http://localhost:5173`), making it impossible to run them against the deployed GitHub Pages instance without editing config files. This blocks regression verification after a release without manual intervention.

## What Changes

- `playwright.config.ts` is updated to read an `E2E_TARGET` environment variable and conditionally set `baseURL` and `webServer` accordingly.
- A new `npm run test:e2e:prod` script is added to `package.json` that sets `E2E_TARGET=prod` before running Playwright.
- When `E2E_TARGET=prod`, the `webServer` block is omitted and `baseURL` points to `https://awaragi.github.io/glowframe/`.
- When `E2E_TARGET` is unset (default), behaviour is identical to today: `baseURL` is `http://localhost:5173` and `webServer` starts `npm run dev`.
- No test files in `e2e/` are modified — both modes share the same `.spec.ts` files.

## Capabilities

### New Capabilities
- `e2e-targeting`: Dual-mode Playwright configuration that selects between local dev and the production GitHub Pages deployment as the test target via an environment variable, with matching `package.json` scripts.

### Modified Capabilities
- `e2e-testing`: The requirement that `playwright.config.ts` hardcodes `baseURL: 'http://localhost:5173'` and always runs `webServer` is relaxed — both are now conditional on the target mode.

## Impact

- `playwright.config.ts` — logic added to branch on `E2E_TARGET`
- `package.json` — new `test:e2e:prod` script
- No source files under `src/` are affected
- No new runtime dependencies required
