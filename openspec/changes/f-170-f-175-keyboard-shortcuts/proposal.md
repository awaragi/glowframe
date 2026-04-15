## Why

GlowFrame is keyboard-operable but has only one ad-hoc shortcut (`F` for fullscreen) wired inline in `LightPage.tsx`, with no discoverability and no systematic way to add more. As the feature set grows (profiles, brightness, colour temperature, ring radii), power users need quick keyboard access to these parameters without opening the settings modal, and a discoverable reference for all shortcuts.

## What Changes

- Add a `src/lib/keyboardShortcutConstants.ts` file that centralises all adjustment step values (`BRIGHTNESS_STEP`, `TEMPERATURE_STEP`, `RADIUS_STEP`); no step value is hardcoded inline.
- Add a centralised `useKeyboardShortcuts` hook that accepts a binding array, attaches a single `keydown` listener on `document`, and enforces a shared focus guard (blocks when active element is an `input`, `select`, `textarea`, or `contentEditable` element).
- Introduce per-mode headless shortcut components (`GlobalShortcuts`, `ActiveModeShortcuts`, and one component per profile mode) that mirror the existing `light-modes/` / `mode-settings/` pattern; each mode component registers the shortcuts that are applicable to that mode's parameters.
- Migrate the existing inline `F` key handler from `LightPage.tsx` into `GlobalShortcuts` (no behaviour change to the fullscreen requirement).
- Add global shortcuts: `F` fullscreen toggle, `S` settings toggle, `?` help toggle.
- Add preset-switching shortcuts: `1`–`9` select the preset at that array index (no-op if index out of bounds).
- Add per-mode parameter shortcuts: `↑`/`↓` foreground brightness, `←`/`→` foreground colour temperature, `]`/`[` outer radius (ring/ring-color) or single radius (spot/spot-color), `{`/`}` inner radius (ring/ring-color only).
- Add a `HelpButton` (`?`) fixed in the top-right corner at `right-28` (alongside the existing fullscreen and gear buttons).
- Add a `HelpDialog` — a hardcoded, grouped shortcut reference table using `<kbd>` elements, opened via the `?` button or `?` keystroke (toggles).
- All shortcuts remain active regardless of whether the settings or help modal is open (changes reflect live via Zustand); only the focus guard against form controls applies.

## Capabilities

### New Capabilities

- `keyboard-shortcuts`: The full keyboard shortcut system — the `useKeyboardShortcuts` engine hook, per-mode headless shortcut components, global/mode-specific bindings (F-175 parameters + preset switching), `HelpButton`, and `HelpDialog` (F-170).

### Modified Capabilities

_(none — the fullscreen-toggle spec requirement is unchanged; only the implementation location moves)_

## Impact

- **`src/pages/LightPage.tsx`** — inline `useEffect` for `F` key removed; replaced by mounting `<GlobalShortcuts />` and `<ActiveModeShortcuts />`.
- **New files** — `src/lib/keyboardShortcutConstants.ts` (step values); `src/hooks/useKeyboardShortcuts.ts` and `src/components/shortcuts/` directory with `GlobalShortcuts.tsx`, `ActiveModeShortcuts.tsx`, and one component per mode (`FullModeShortcuts.tsx`, `FullColorModeShortcuts.tsx`, `RingModeShortcuts.tsx`, `RingColorModeShortcuts.tsx`, `SpotModeShortcuts.tsx`, `SpotColorModeShortcuts.tsx`); `src/components/HelpButton.tsx`; `src/components/HelpDialog.tsx`.
- **`src/components/FullscreenButton.tsx`** — no changes; button position unchanged.
- **`src/components/GearButton.tsx`** — no changes; button position unchanged.
- **No new dependencies** — uses existing React, Zustand, Radix UI/shadcn `Dialog`, and Lucide icons already in the project.
- **Tests** — new Vitest unit tests for `useKeyboardShortcuts` (focus guard, each binding, clamping logic) and new Playwright E2E scenario for shortcut interactions.
