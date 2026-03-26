## ADDED Requirements

### Requirement: E2E_DEMO environment variable activates demonstration mode
The Playwright configuration SHALL read the `E2E_DEMO` environment variable. When `E2E_DEMO` is set to `"true"`, the configuration SHALL activate demonstration mode: headed browser, `slowMo` of 800 ms, and sequential (non-parallel) test execution.

#### Scenario: Demo mode launches a headed browser
- **WHEN** `E2E_DEMO=true` is set and `npm run test:e2e:demo` is executed
- **THEN** Playwright opens a visible Chrome window instead of running headlessly

#### Scenario: Demo mode slows down each action
- **WHEN** `E2E_DEMO=true` is set
- **THEN** each Playwright action is delayed by approximately 800 ms so interactions are clearly observable

#### Scenario: Demo mode runs tests sequentially in a single window
- **WHEN** `E2E_DEMO=true` is set
- **THEN** `fullyParallel` is `false`, `workers` is `1`, and exactly one browser window is open at any time

#### Scenario: Demo mode is inactive by default
- **WHEN** `E2E_DEMO` is unset or any value other than `"true"`
- **THEN** `headless`, `slowMo`, and `fullyParallel` retain their default values and no demo behaviour is applied

### Requirement: npm run test:e2e:demo script executes Playwright in demonstration mode
The project SHALL provide a `test:e2e:demo` script in `package.json` that sets `E2E_DEMO=true` and runs `playwright test`.

#### Scenario: Script is wired in package.json
- **WHEN** the developer runs `npm run test:e2e:demo`
- **THEN** `playwright test` executes with `E2E_DEMO` set to `"true"`, a visible browser opens, and test actions are slowed

### Requirement: Existing E2E scripts are unaffected by demo mode additions
The `test:e2e` and `test:e2e:prod` scripts SHALL behave identically before and after this change is introduced. Demo mode settings SHALL NOT be applied unless `E2E_DEMO=true` is explicitly set.

#### Scenario: Standard local run is unchanged
- **WHEN** `npm run test:e2e` is executed with no `E2E_DEMO` variable set
- **THEN** Playwright runs headlessly in parallel at full speed, identical to pre-change behaviour

#### Scenario: Prod run is unchanged
- **WHEN** `npm run test:e2e:prod` is executed with no `E2E_DEMO` variable set
- **THEN** Playwright runs headlessly in parallel at full speed against the GitHub Pages deployment
