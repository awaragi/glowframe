## Why

The existing Playwright suite runs headlessly at full speed, making it unsuitable for live technical demonstrations where reviewers need to follow the interactions visually. A dedicated demo mode with a visible browser and deliberate pacing lets the team showcase the app's behaviour during presentations and walkthroughs without modifying any test logic.

## What Changes

- Add an `E2E_DEMO` environment variable that activates demo mode in `playwright.config.ts`.
- When `E2E_DEMO=true`: launch Chrome in headed (non-headless) mode, apply `slowMo` of ~800 ms per action, and disable `fullyParallel` so tests run one at a time.
- Add a `test:e2e:demo` npm script that sets `E2E_DEMO=true` and invokes `playwright test`.
- Existing `test:e2e` and `test:e2e:prod` scripts remain unchanged.

## Capabilities

### New Capabilities

- `e2e-demo-mode`: Opt-in Playwright configuration that runs the full E2E suite in a visible, slowed-down, sequential manner for demonstration purposes.

### Modified Capabilities

- `e2e-targeting`: The Playwright config gains a new environment-variable branch (`E2E_DEMO`) alongside the existing `E2E_TARGET` branch.

## Impact

- `playwright.config.ts` — reads `E2E_DEMO` and conditionally overrides `headless`, `slowMo`, and `fullyParallel`.
- `package.json` — new `test:e2e:demo` script.
- No test files, application source, or production build are affected.
