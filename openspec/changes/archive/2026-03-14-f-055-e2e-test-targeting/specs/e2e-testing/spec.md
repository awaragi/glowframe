## MODIFIED Requirements

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
