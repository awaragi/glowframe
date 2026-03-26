## MODIFIED Requirements

### Requirement: E2E_TARGET environment variable selects the test target
The Playwright configuration SHALL read the `E2E_TARGET` environment variable to determine which target to run tests against. When `E2E_TARGET` is `prod`, the test target SHALL be the live GitHub Pages deployment. When `E2E_TARGET` is unset or any other value, the target SHALL be the local dev server. The configuration SHALL also read the `E2E_DEMO` environment variable independently; `E2E_TARGET` and `E2E_DEMO` are orthogonal controls.

#### Scenario: Default mode targets local dev server
- **WHEN** `npm run test:e2e` is executed with no `E2E_TARGET` variable set
- **THEN** Playwright uses `http://localhost:5173` as `baseURL` and starts `npm run dev` via `webServer`

#### Scenario: Prod mode targets GitHub Pages
- **WHEN** `E2E_TARGET=prod npm run test:e2e:prod` is executed
- **THEN** Playwright uses `https://awaragi.github.io/glowframe/` as `baseURL` and does NOT start a local `webServer`
