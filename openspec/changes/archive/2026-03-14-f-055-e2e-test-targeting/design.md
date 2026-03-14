## Context

Playwright is configured in `playwright.config.ts` with a hardcoded `baseURL` of `http://localhost:5173` and an unconditional `webServer` block that starts `npm run dev`. This is correct for local development but prevents tests from running against the live GitHub Pages deployment at `https://awaragi.github.io/glowframe/` without manual config edits.

## Goals / Non-Goals

**Goals:**
- Support two test targets (local dev, production GitHub Pages) without modifying any test files.
- Select the target via an environment variable (`E2E_TARGET`).
- Add a `test:e2e:prod` npm script for convenience.
- Keep the default (`npm run test:e2e`) behaviour identical to today.

**Non-Goals:**
- Supporting more than two targets at this time.
- Parallelising tests across both targets in a single run.
- Changes to test assertions or page object models.

## Decisions

### Decision: Environment variable `E2E_TARGET` controls mode
`E2E_TARGET=prod` activates prod mode; any other value (including unset) activates local mode. A boolean check (`process.env.E2E_TARGET === 'prod'`) keeps the config readable and avoids magic strings proliferating.

**Alternative considered**: A separate `playwright.prod.config.ts` — rejected because it duplicates project/browser config and makes maintenance harder.

### Decision: `webServer` is omitted entirely in prod mode
When targeting the production deployment, there is no local server to start. Setting `webServer: undefined` (by not including the key) is the cleanest approach; Playwright simply skips the lifecycle step. This avoids the need to set a dummy command or a skip flag.

**Alternative considered**: A `webServer.skip` flag — not supported by Playwright's config type; would require workarounds.

### Decision: `baseURL` and `webServer` are derived from a single `isProdMode` flag
A single `const isProdMode = process.env.E2E_TARGET === 'prod'` at the top of the config file drives both `use.baseURL` and the conditional `webServer` property. This minimises the number of places that reference `E2E_TARGET` and makes the relationship obvious.

## Risks / Trade-offs

- **Risk**: GitHub Pages URL changes (e.g., custom domain added) → The URL is a single string in `playwright.config.ts`; updating it is a one-line change. No config variable is introduced to keep things simple at this stage.
- **Risk**: Prod mode runs against the live deployment, so a broken release could cause unrelated test failures → Acceptable; this is the intended behaviour for release regression testing.
- **Trade-off**: `E2E_TARGET=prod` must be set in the shell or CI environment; it is not read from a `.env` file — intentional to avoid accidental targeting of production from a mis-configured local `.env`.

## Migration Plan

1. Update `playwright.config.ts` to branch on `isProdMode`.
2. Add `"test:e2e:prod"` script to `package.json`.
3. Update the `e2e-targeting` spec and delta `e2e-testing` spec.
4. Verify `npm run test:e2e` still passes (local smoke).
5. Verify `npm run test:e2e:prod` passes against the live site (manual check, or CI step).
