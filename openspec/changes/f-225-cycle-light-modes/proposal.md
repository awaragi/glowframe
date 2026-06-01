## Why

Switching light modes today requires opening the settings modal and using the mode dropdown. Power users who already rely on keyboard shortcuts for brightness, temperature, and preset switching have no quick way to cycle through the six light modes without leaving the light surface. A single `M` key binding closes that gap and pairs naturally with the existing letter shortcuts (`F`, `S`, `?`).

## What Changes

- Add a global `M` keyboard shortcut that cycles the active preset to the next light mode in canonical order: `full` → `full-color` → `ring` → `ring-color` → `spot` → `spot-color` → `full`.
- Introduce a shared `MODE_CYCLE_ORDER` constant and `MODE_LABELS` map in `src/lib/modeDefaults.ts` (or equivalent shared module) so cycle order and human-readable labels are defined once.
- Register the shortcut in `GlobalShortcuts`; cycling calls the existing destructive `switchMode` store action (mode-specific fields reset to defaults; `id` and `name` preserved).
- Add a `ModeNameOverlay` component that briefly displays the new mode label centred on the light surface, using the same legibility treatment as the planned F-220 clock overlay (high-contrast text on a semi-transparent blurred pill).
- Update the `HelpDialog` **Global** group to list `M` — "Cycle light mode (resets mode settings)".
- Add unit tests for the shortcut handler, overlay behaviour, and help dialog entry; add an E2E scenario for mode cycling with and without the settings modal open.

## Capabilities

### New Capabilities

- `mode-name-overlay`: Transient centred overlay that displays the human-readable mode label after a mode cycle, auto-dismisses after a fixed duration, and restarts its timer on rapid successive cycles.

### Modified Capabilities

- `keyboard-shortcuts`: Add `M` to `GlobalShortcuts` for destructive mode cycling; update `HelpDialog` Global group to document the new binding.

## Impact

- **`src/lib/modeDefaults.ts`** — add `MODE_CYCLE_ORDER`, export shared `MODE_LABELS`; optionally add `nextMode(current)` helper.
- **`src/components/shortcuts/GlobalShortcuts.tsx`** — add `M` binding; wire `switchMode` and overlay trigger.
- **`src/components/HelpDialog.tsx`** — add `M` row to Global shortcuts table.
- **`src/pages/LightPage.tsx`** — mount `ModeNameOverlay` (or equivalent state wiring).
- **New files** — `src/components/ModeNameOverlay.tsx` (+ tests); possibly `src/lib/modeCycle.ts` if logic is extracted.
- **`src/components/SettingsModal.tsx`** — import shared `MODE_LABELS` instead of local duplicate (optional refactor, keeps order in sync).
- **No new dependencies** — reuses existing `useKeyboardShortcuts`, Zustand store, and Tailwind styling.
- **Tests** — Vitest unit tests for `GlobalShortcuts`, `ModeNameOverlay`, `HelpDialog`; Playwright E2E for mode cycling.
