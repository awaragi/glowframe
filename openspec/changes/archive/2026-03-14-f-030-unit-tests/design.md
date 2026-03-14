## Context

Vitest is already wired into `vite.config.ts` with `environment: 'jsdom'` and `setupFiles: ['./src/test/setup.ts']`. `@testing-library/jest-dom` matchers are already imported in the setup file. The `test` script runs `vitest run`. What is missing is:
- A `test:coverage` npm script.
- Actual test files covering the current codebase (`cn()`, `useAppStore`, `App`).

The Zustand store (`src/store/index.ts`) is a skeleton — it holds only `_version: 1`. The `cn()` utility wraps `clsx` + `tailwind-merge`. The `App` component is the root rendered by React Router.

The existing `src/test/App.test.tsx` was placed in a dedicated test folder during scaffolding; this change relocates it to sit alongside its source (`src/App.test.tsx`). The setup infrastructure (`src/test/setup.ts`) stays in place as it is referenced by `vite.config.ts` `setupFiles`.

## Goals / Non-Goals

**Goals:**
- Add `npm run test:coverage` script (Vitest `--coverage` flag).
- Write unit tests for `cn()` utility.
- Write unit tests for `useAppStore` initial state.
- Write a smoke render test for `<App />`.
- Establish where tests live: `src/test/setup.ts` for shared Vitest setup only; all unit/component tests co-located with their source (`*.test.ts(x)` siblings).
- Move existing `src/test/App.test.tsx` → `src/App.test.tsx`.

**Non-Goals:**
- Testing features not yet implemented (profiles, Wake Lock, settings modal).
- Achieving a specific coverage percentage threshold (enforced in a later task).
- Playwright / E2E tests (F-040).

## Decisions

**1. Coverage via `@vitest/coverage-v8`**
Vitest's built-in v8 coverage provider requires only `@vitest/coverage-v8` and a `--coverage` flag. Alternative: `c8` or Istanbul (`@vitest/coverage-istanbul`). V8 is simpler — no extra Babel transforms.

**2. No separate `vitest.config.ts`**
The `test` block already lives in `vite.config.ts` (using `vitest/config`). Adding a separate config would duplicate resolver/alias settings. Decision: extend the existing `vite.config.ts` test block with `coverage` options.

**3. Co-location for all unit/component tests**
All unit and component tests live alongside their source files (e.g., `src/lib/utils.test.ts`, `src/App.test.tsx`). The existing `src/test/App.test.tsx` is moved to `src/App.test.tsx` as part of this change. Only infrastructure stays in `src/test/`: the Vitest `setup.ts` file referenced by `vite.config.ts`.

## Risks / Trade-offs

- **Store tests are thin today** — the store holds only `_version`; tests will need expanding as features land. → Mitigation: tests document current contract and will fail loudly when store shape changes.
- **jsdom doesn't support CSS variables or Canvas** — visual/rendering assertions are limited. → Mitigation: stick to DOM structure / attribute assertions in component tests.
