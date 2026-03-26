## Context

The project has a Playwright E2E suite that runs headlessly at full speed. All existing run modes (`test:e2e`, `test:e2e:prod`) are optimised for CI correctness, not human observation. There is no way to watch tests execute in real time without editing the config manually each time.

## Goals / Non-Goals

**Goals:**
- Introduce an opt-in `E2E_DEMO` environment variable that switches the Playwright run into a demonstration-friendly configuration.
- Headed browser, slowed-down actions (~800 ms `slowMo`), and sequential test execution.
- A single `test:e2e:demo` npm script so the mode is one command away.
- Zero impact on existing scripts or CI behaviour.

**Non-Goals:**
- Changing any test logic or selectors.
- Supporting demo mode against the production GitHub Pages deployment (prod mode + demo mode are independent concerns; combining them is a future task if needed).
- Persisting demo settings to a config file — `playwright.config.ts` is the single source of truth.

## Decisions

### D-1: Environment variable (`E2E_DEMO`) rather than a separate config file

**Decision:** Read `process.env.E2E_DEMO` in `playwright.config.ts` and branch on it, similar to the existing `E2E_TARGET` pattern.

**Rationale:** Consistent with the project's established convention. No extra files, no CLI plugins needed. Demo mode is toggled at the `npm run` boundary, not inside tests.

**Alternatives considered:**
- A second `playwright.demo.config.ts` file — adds duplication and drift risk; rejected.
- A Playwright project variant — adds complexity for a single boolean toggle; rejected.

### D-2: `slowMo` of 800 ms

**Decision:** Default `slowMo` to 800 ms when demo mode is active.

**Rationale:** Visible enough for a live audience to follow each interaction without the run becoming tedious. Easily tuned by changing the env-var value in the script if needed.

### D-3: Disable `fullyParallel` and set `workers: 1` in demo mode

**Decision:** Set `fullyParallel: false` and `workers: 1` when `E2E_DEMO=true`.

**Rationale:** `fullyParallel: false` stops test *files* running in parallel, but Playwright still spawns multiple worker processes (one per CPU core) by default. Without `workers: 1`, multiple browser windows open simultaneously. Setting both ensures exactly one visible window runs at a time, which is essential for a coherent demonstration.

## Risks / Trade-offs

- [Risk] Developer accidentally runs `test:e2e:demo` instead of `test:e2e` in a timed context, slowing feedback. → Mitigation: demo script name is clearly distinct; no alias conflicts.
- [Risk] `slowMo` value may feel too fast or too slow depending on the demo context. → Mitigation: the value lives in one place (`playwright.config.ts`) and can be overridden by passing `E2E_SLOW_MO=<ms>` in future if needed; accepted for now.
