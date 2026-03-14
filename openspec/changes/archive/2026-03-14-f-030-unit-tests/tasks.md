## 1. Coverage Infrastructure

- [x] 1.1 Install `@vitest/coverage-v8` as a dev dependency
- [x] 1.2 Add `"test:coverage": "vitest run --coverage"` script to `package.json`
- [x] 1.3 Extend the `test` block in `vite.config.ts` with a `coverage` config (provider: `v8`, include: `src/**`)

## 2. Utility Tests

- [x] 2.1 Create `src/lib/utils.test.ts` with unit tests for `cn()`: merging, conditional exclusion, and Tailwind conflict resolution

## 3. Store Tests

- [x] 3.1 Create `src/store/index.test.ts` with a test verifying `useAppStore` initial state (`_version === 1`)

## 4. Component Tests

- [x] 4.1 Move `src/test/App.test.tsx` → `src/App.test.tsx` (co-locate with `src/App.tsx`)
- [x] 4.2 Verify the moved test still passes (`<App />` renders without error)
- [x] 4.3 Create `src/components/ui/button.test.tsx` with tests for `buttonVariants`: default variant, destructive variant, icon size, custom className merge, and `data-slot="button"` attribute

## 5. Verification

- [x] 5.1 Run `npm run test` — all unit tests pass
- [x] 5.2 Run `npm run test:coverage` — coverage report generates without error
