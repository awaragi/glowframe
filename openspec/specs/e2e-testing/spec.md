# E2E Testing

## Purpose

This capability defines the end-to-end testing requirements for the GlowFrame project using Playwright, covering configuration, scripts, smoke tests, and test file organisation.

## Requirements

### Requirement: Playwright configuration is complete and targets Chromium
The project SHALL have a `playwright.config.ts` at the repo root that configures the Chromium browser project, sets `testDir` to `./e2e`, and sets `baseURL` based on the active target mode. In local mode (default), `webServer` SHALL start `npm run dev` and `baseURL` SHALL be `http://localhost:5173`. In prod mode (`E2E_TARGET=prod`), `webServer` SHALL be omitted and `baseURL` SHALL be `https://awaragi.github.io/glowframe/`.

#### Scenario: Config file exists and is valid
- **WHEN** the developer runs `npx playwright test --list`
- **THEN** Playwright resolves the config without errors and lists discovered tests

#### Scenario: Chromium project is present
- **WHEN** the config is loaded
- **THEN** at least one project named `chromium` using `devices['Desktop Chrome']` is defined

#### Scenario: webServer integration starts the dev server in local mode
- **WHEN** `npm run test:e2e` is executed on a machine with no running dev server
- **THEN** Playwright starts `npm run dev` automatically and waits for `http://localhost:5173` to respond before running tests

#### Scenario: webServer is absent in prod mode
- **WHEN** `npm run test:e2e:prod` is executed
- **THEN** Playwright does NOT attempt to start any local server process

### Requirement: npm run test:e2e script executes Playwright tests
The project SHALL provide a `test:e2e` script in `package.json` that runs `playwright test` (or `npx playwright test`) so developers and CI can execute all E2E tests with one command.

#### Scenario: Script is wired in package.json
- **WHEN** the developer runs `npm run test:e2e`
- **THEN** `playwright test` is executed against the `e2e/` directory

### Requirement: Smoke test verifies the app loads
The `e2e/` directory SHALL contain a smoke test that navigates to the root URL and confirms the app has loaded without errors.

#### Scenario: App title is present
- **WHEN** the browser navigates to the base URL
- **THEN** the page title matches `/GlowFrame|Vite/` (during early development the Vite default is acceptable)

#### Scenario: App root element is visible
- **WHEN** the browser navigates to the base URL
- **THEN** the `#root` element is visible in the DOM

### Requirement: E2E test files are co-located under e2e/
All Playwright test files SHALL reside in the `e2e/` directory and use the `.spec.ts` extension. Files MUST NOT be placed inside `src/`.

#### Scenario: Existing smoke spec is in the correct location
- **WHEN** the repository is cloned
- **THEN** `e2e/smoke.spec.ts` exists and is the entry-point smoke scenario

#### Scenario: Playwright does not pick up Vitest unit tests
- **WHEN** `npm run test:e2e` is executed
- **THEN** no files from `src/` are discovered or executed by Playwright
