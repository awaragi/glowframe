## Context

The project already has `@playwright/test` installed and a minimal `playwright.config.ts` configured for Chromium with `webServer` integration pointing at `npm run dev`. An initial `e2e/smoke.spec.ts` exists but covers only a basic title check. The `npm run test:e2e` script is wired in `package.json`. The goal of this change is to validate and complete the E2E infrastructure so it is production-ready and can serve as the foundation for all future feature scenarios.

## Goals / Non-Goals

**Goals:**
- Confirm existing Playwright config is complete and correct (Chromium mandatory; Firefox/WebKit optional).
- Establish a reliable smoke scenario that verifies the app loads and renders the main surface.
- Define the conventions (file layout, naming, base URL, auth helpers) that all future E2E tests will follow.
- Ensure `npm run test:e2e` is fully green on a clean checkout.

**Non-Goals:**
- Full scenario coverage for F-060–F-140 features (those are not yet implemented).
- Visual regression testing.
- Accessibility auditing via Playwright (a11y checks belong in unit tests with `axe-core`).
- CI pipeline configuration (out of scope for this feature).

## Decisions

### D-1: Single browser project (Chromium) for now

**Decision**: Target only Chromium in `playwright.config.ts` for the initial setup.

**Rationale**: Firefox and WebKit support can be enabled later when the feature set stabilises. Running a single browser keeps CI fast in the short term.

**Alternatives considered**: Multi-browser from day one — rejected because it increases run time and maintenance burden before any real scenarios exist.

---

### D-2: `webServer` integration with `reuseExistingServer`

**Decision**: Keep `reuseExistingServer: !process.env.CI` so developers can run `npm run dev` in parallel with `npm run test:e2e` without a port conflict.

**Rationale**: Matches the existing config; zero friction for local development.

---

### D-3: Test file location — `e2e/` directory

**Decision**: All Playwright tests live in `e2e/`, co-located by feature area (e.g., `e2e/smoke.spec.ts`, `e2e/settings.spec.ts`).

**Rationale**: Clear separation from Vitest unit tests in `src/`. Matches `testDir: './e2e'` already set in config.

---

### D-4: Smoke test asserts viewport fill

**Decision**: The smoke test verifies that the root element fills the viewport (100vw × 100vh) rather than checking arbitrary text.

**Rationale**: The primary purpose of GlowFrame is a full-screen light surface, so filling the viewport is the most meaningful observable behaviour at this stage.

## Risks / Trade-offs

- **[Risk] Port 5173 already occupied on developer machine** → Mitigated by `reuseExistingServer: !process.env.CI`; Playwright will attach to the running instance.
- **[Risk] `npm run dev` takes too long to start** → Mitigated by Playwright's `timeout` on `webServer.timeout`; default 60 s is sufficient for Vite cold starts.
- **[Trade-off] Chromium-only** → Reduced cross-browser confidence until Firefox/WebKit projects are added in a future iteration.
