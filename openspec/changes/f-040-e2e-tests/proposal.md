## Why

The project has unit test coverage but no end-to-end tests to verify real user flows in a browser. Playwright E2E tests are required by the project's ATDD workflow and by several upcoming features (core light display, settings modal, profiles, fullscreen, share URL) that need scenario-level validation.

## What Changes

- Configure Playwright for Chromium (and optionally Firefox / WebKit).
- Add an initial smoke test suite covering the app loading correctly.
- Wire `npm run test:e2e` to start the dev server and execute Playwright tests.
- Add Playwright config (`playwright.config.ts`) and the `e2e/` test directory structure.

## Capabilities

### New Capabilities

- `e2e-testing`: End-to-end test infrastructure with Playwright — configuration, test runner setup, dev-server integration, and an initial smoke scenario verifying the app loads.

### Modified Capabilities

## Impact

- New dev dependency: `@playwright/test` (already present in `package.json`; configuration needs to be completed).
- `playwright.config.ts` at the repo root.
- `e2e/` directory containing test files.
- `package.json` `test:e2e` script updated to use `playwright test`.
- No runtime production code changes.
