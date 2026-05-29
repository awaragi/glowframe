## 1. Profile Schema — Types and Store

- [x] 1.1 Add `ClockConfig` type and `ClockFormat` type alias to `src/store/index.ts`; extend `Profile` type with `clock: ClockConfig`
- [x] 1.2 Add `clock` defaults to `_defaultProfile` in `src/store/index.ts`
- [x] 1.3 Update `createProfile` in `src/store/index.ts` to always set `clock` defaults on the new profile (not inherited from active)
- [x] 1.4 Update `updateProfile` in `src/store/index.ts` to deep-merge `clock` patch: `{ ...p, ...patch, clock: { ...p.clock, ...patch.clock } }`
- [x] 1.5 Extend `AllModeFields` (or the `updateProfile` patch type) to accept `Partial<{ clock: Partial<ClockConfig> }>` so the deep merge is type-safe

## 2. formatTime Utility

- [x] 2.1 Create `src/lib/clockFormat.ts` exporting `ClockFormat` type and pure `formatTime(date: Date, format: ClockFormat): string` function
- [x] 2.2 Create `src/lib/clockFormat.test.ts` with unit tests covering all four format tokens (HH:mm, HH:mm:ss, hh:mm a, hh:mm:ss a) and edge cases (midnight, PM conversion)

## 3. useClockTime Hook

- [x] 3.1 Create `src/hooks/useClockTime.ts` exporting `useClockTime(format: ClockFormat): string` hook using `setInterval(1000)` with cleanup on unmount
- [x] 3.2 Create `src/hooks/useClockTime.test.ts` with unit tests: verifies formatted string returned and interval cleared on unmount (using fake timers / mocked Date)

## 4. ClockOverlay Component

- [x] 4.1 Create `src/components/ClockOverlay.tsx`: fixed-position element, reads `profile.clock` from Zustand, uses `useClockTime`, applies position/size Tailwind class maps, includes `aria-label="Digital clock"` and `aria-live="off"`, renders nothing when `clock.enabled` is false
- [x] 4.2 Create `src/components/ClockOverlay.test.tsx` with unit tests covering: renders when enabled, absent when disabled, correct position classes for top-left/bottom-left/bottom-right, correct size classes for small/medium/large, backdrop classes present, accessibility attributes present

## 5. Wire ClockOverlay into the Light Surface

- [x] 5.1 Import and render `<ClockOverlay />` in `src/components/LightSurface.tsx` as a sibling of the mode surface, ensuring it appears as an overlay with z-index below the button cluster

## 6. SettingsModal — Tab Restructure and Clock Controls

- [x] 6.1 Wrap existing light-surface controls in a `Tabs.Panel` (Tab 1 — Light) and add a new `Tabs.Panel` (Tab 2 — Clock) inside `src/components/SettingsModal.tsx` using `@base-ui/react/tabs`; profile management panel remains above the `Tabs.Root`; default active tab is `"light"`
- [x] 6.2 Add Clock tab content to `src/components/SettingsModal.tsx`: Show clock toggle (`clock.enabled`), Position selector, Size selector, Format selector — all bound to Zustand via `updateProfile`; position/size/format controls disabled when `clock.enabled` is false

## 7. SettingsModal Tests

- [x] 7.1 Update `src/components/SettingsModal.test.tsx` to account for the tab layout: navigate to Light tab before asserting light controls, navigate to Clock tab to assert clock controls

## 8. E2E Tests

- [x] 8.1 Create `e2e/clock-overlay.spec.ts` with scenarios: clock absent by default, enabling clock shows overlay, position change moves overlay, format change updates display, disabling clock hides overlay
- [x] 8.2 Update `e2e/settings.spec.ts` (and any other settings-related specs) to click the Light tab before interacting with existing light controls
