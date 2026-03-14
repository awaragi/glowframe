## Why

GlowFrame has no unit or component test infrastructure beyond a minimal scaffold. Without a tested foundation, building features like the Zustand store, Wake Lock hook, and settings modal carries high regression risk. Establishing Vitest + React Testing Library now enables TDD from the first feature.

## What Changes

- Add `npm run test:coverage` script and `@vitest/coverage-v8` dev dependency.
- Move `src/test/App.test.tsx` → `src/App.test.tsx` to co-locate it with its source.
- Write co-located unit tests for `cn()` (`src/lib/utils.test.ts`) and `useAppStore` (`src/store/index.test.ts`).
- Establish convention: unit/component tests live alongside source as `*.test.ts(x)` siblings; `src/test/` is reserved for Vitest setup infrastructure only.

## Capabilities

### New Capabilities

- `unit-testing`: Vitest + React Testing Library configuration and initial test suite covering the existing store, utilities, and App component.

### Modified Capabilities

## Impact

- `package.json`: new `test:coverage` script; verify existing `test` script uses Vitest with jsdom.
- `vite.config.ts` (or `vitest.config.ts`): add/extend `test` block with `environment: "jsdom"` and `setupFiles`.
- `src/test/setup.ts`: add `@testing-library/jest-dom` matchers import (likely already present).
- `src/lib/utils.test.ts`, `src/store/index.test.ts`, `src/App.test.tsx`: new co-located unit/component tests.
- `src/test/App.test.tsx` → moved to `src/App.test.tsx` (co-located with `src/App.tsx`).
