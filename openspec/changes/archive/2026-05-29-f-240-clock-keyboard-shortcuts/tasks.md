## 1. ClockShortcuts Component

- [x] 1.1 Create `src/components/shortcuts/ClockShortcuts.tsx` — headless component that reads the active profile's clock state from the Zustand store and registers `t` (four-state cycle: off → on+top-left → on+bottom-left → on+bottom-right → off) and `Shift+T` (cycle `clock.size`: small → medium → large → small) bindings via `useKeyboardShortcuts`
- [x] 1.2 Mount `<ClockShortcuts />` in `LightPage` (or `App.tsx`) alongside `GlobalShortcuts` and `ActiveModeShortcuts`

## 2. HelpDialog Update

- [x] 2.1 Add a "Clock" section to `src/components/HelpDialog.tsx` with rows for `T` (Toggle clock visibility) and `Shift+T` (Cycle clock position), placed between the "Ring & Spot radius" and "Settings modal" sections

## 3. Unit Tests

- [x] 3.1 Create `src/components/shortcuts/ClockShortcuts.test.tsx` — test the full `T` four-state cycle (off→top-left→bottom-left→bottom-right→off), `Shift+T` size cycle (small→medium→large→small), and that both shortcuts are suppressed when an input has focus
- [x] 3.2 Update `src/components/HelpDialog.test.tsx` — add assertions that the Clock group is rendered with `T` and `Shift+T` entries

## 4. E2E Tests

- [x] 4.1 Add a `clock-keyboard-shortcuts.spec.ts` Playwright test that opens the app, presses `T` to toggle the clock, presses `Shift+T` to cycle the clock position, and verifies the help dialog displays the Clock section

## 5. Build & Verify

- [x] 5.1 Run `npm run build` — confirm no TypeScript or Vite compilation errors
- [x] 5.2 Run `npm run test` — confirm all Vitest unit tests pass
