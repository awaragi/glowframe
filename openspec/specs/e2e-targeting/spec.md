# E2E Targeting

## Purpose

This capability defines how Playwright E2E tests select their target environment. Tests run against either the local dev server (default) or the live production deployment, controlled via an environment variable — without modifying any test files.

## Requirements

### Requirement: E2E_TARGET environment variable selects the test target
The Playwright configuration SHALL read the `E2E_TARGET` environment variable to determine which target to run tests against. When `E2E_TARGET` is `prod`, the test target SHALL be the live GitHub Pages deployment. When `E2E_TARGET` is unset or any other value, the target SHALL be the local dev server. The configuration SHALL also read the `E2E_DEMO` environment variable independently; `E2E_TARGET` and `E2E_DEMO` are orthogonal controls.

#### Scenario: Default mode targets local dev server
- **WHEN** `npm run test:e2e` is executed with no `E2E_TARGET` variable set
- **THEN** Playwright uses `http://localhost:5173` as `baseURL` and starts `npm run dev` via `webServer`

#### Scenario: Prod mode targets GitHub Pages
- **WHEN** `E2E_TARGET=prod npm run test:e2e:prod` is executed
- **THEN** Playwright uses `https://awaragi.github.io/glowframe/` as `baseURL` and does NOT start a local `webServer`

### Requirement: npm run test:e2e:prod script executes Playwright against the production deployment
The project SHALL provide a `test:e2e:prod` script in `package.json` that sets `E2E_TARGET=prod` and runs `playwright test`.

#### Scenario: Script is wired in package.json
- **WHEN** the developer runs `npm run test:e2e:prod`
- **THEN** `playwright test` is executed with `E2E_TARGET` set to `prod` and no local server is started

### Requirement: Same test files run in both modes
The test files in `e2e/` SHALL execute unchanged in both local and prod modes. No test file SHALL hardcode a URL.

#### Scenario: Smoke test runs in local mode
- **WHEN** `npm run test:e2e` is executed (local mode)
- **THEN** `e2e/smoke.spec.ts` runs against `http://localhost:5173` without modification

#### Scenario: Smoke test runs in prod mode
- **WHEN** `npm run test:e2e:prod` is executed (prod mode)
- **THEN** `e2e/smoke.spec.ts` runs against `https://awaragi.github.io/glowframe/` without modification
