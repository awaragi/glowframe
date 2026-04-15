## Context

GlowFrame currently has one keyboard shortcut (`F` for fullscreen) wired inline in `LightPage.tsx` via a `useEffect`. The codebase already uses a per-mode component pattern for both rendering (`light-modes/`) and settings (`mode-settings/`): `LightSurface` and `SettingsModal` both switch on the active profile's `mode` and mount the appropriate sub-component. This change extends that same pattern to keyboard shortcuts, adding a centralised engine hook, per-mode headless components, a help button, and a help dialog.

The app has six profile modes (`full`, `full-color`, `ring`, `ring-color`, `spot`, `spot-color`) where each mode has a distinct set of adjustable parameters. Shortcuts must only fire for parameters that exist in the active mode.

## Goals / Non-Goals

**Goals:**
- Centralise all `keydown` handling behind a single reusable `useKeyboardShortcuts` hook with a consistent focus guard
- Replace the existing inline `F` key handler without changing its behaviour
- Deliver per-mode parameter shortcuts (brightness, temperature, radii) that update Zustand state live
- Deliver global shortcuts (`F`, `S`, `?`, `1`–`9`)
- Deliver a discoverable help dialog with hardcoded shortcut groups
- Centralise all step values in one constants file

**Non-Goals:**
- Shortcut customisation / rebinding by the user
- Preset reordering (F-165); `1`–`9` maps directly to `profiles[]` array index in this change
- Touch gesture handling (F-180)
- Any shortcut that targets the background light parameters (background brightness/temperature remain settings-modal-only)

## Decisions

### D1 — Single `useKeyboardShortcuts` hook as the engine; per-mode headless components as consumers

**Decision:** One engine hook accepts a flat `KeyBinding[]` array. Per-mode headless components (`GlobalShortcuts`, `FullModeShortcuts`, etc.) each call the hook with their own binding array. `LightPage` mounts `<GlobalShortcuts />` and `<ActiveModeShortcuts />` side by side.

**Rationale:** Mirrors the existing `light-modes/` and `mode-settings/` pattern already in the codebase. Each mode component is self-contained, easy to test in isolation, and trivially extended (F-175 ring shortcuts are just a `RingModeShortcuts` component; they don't touch the engine). An alternative of a single monolithic hook that contains all bindings would require a large conditional tree and makes per-mode testing harder.

**Alternative considered:** A context-based registry where components push/pop bindings. Rejected — more complex, no benefit here since the binding set is static per mounted mode.

### D2 — Bindings keyed on `{ key, shift }` with lowercase key matching

**Decision:** `KeyBinding.key` is matched case-insensitively by comparing `e.key.toLowerCase()` with `key.toLowerCase()`. The `shift` field (`boolean`, default `false`) gates the `e.shiftKey` check. Arrow keys use the full `e.key` value (`'ArrowUp'`, `'ArrowDown'`, `'ArrowLeft'`, `'ArrowRight'`).

**Rationale:** Handles `F`/`f` with a single binding registration, avoids duplicating identical upper/lower bindings. `?` is naturally `Shift+/` — registering `{ key: '/', shift: true }` would also work, but the browser delivers `e.key === '?'` for that keystroke, so registering `{ key: '?' }` is simpler and more readable. Arrow key `e.key` values are already unambiguous.

**Alternative considered:** Using `e.code` (physical key) instead of `e.key`. Rejected — `e.code` is layout-independent but makes `[`/`{` harder (they're the same physical key on US layout; `e.key` distinguishes them by shift state naturally).

### D3 — Step values centralised in `src/lib/keyboardShortcutConstants.ts`

**Decision:** Export `BRIGHTNESS_STEP`, `TEMPERATURE_STEP`, and `RADIUS_STEP` as named numeric constants. All per-mode shortcut components import from this file.

**Rationale:** A single place to tune step feel without grep-and-replace. The constants file also serves as documentation of intended granularity. Vitest tests for the constants file verify the exports exist and are positive numbers.

### D4 — Clamping happens inside each mode shortcut component, not in the hook

**Decision:** Each mode shortcut component computes the new clamped value before calling `updateProfile`. The engine hook only dispatches handlers — it has no knowledge of parameters or ranges.

**Rationale:** Keeps the engine hook a pure event dispatcher with no domain logic, making it easier to test and reuse. Clamping logic is co-located with the knowledge of which parameter is being adjusted and what its valid range is.

### D5 — HelpDialog content is hardcoded; not data-driven from the binding arrays

**Decision:** `HelpDialog` renders a static table with four named groups. It is not linked to the live binding arrays registered by shortcut components.

**Rationale:** The user confirmed this is the desired approach. A data-driven system would require `KeyBinding` to carry `description` and `group` metadata, adding complexity to the engine for no runtime benefit. Hardcoded content is simpler to write, easier to localise later, and decoupled from the runtime shortcut system.

### D6 — All shortcuts remain active regardless of modal open state; only the focus guard applies

**Decision:** Shortcuts fire even when the settings or help dialog is open. Changes to Zustand state (brightness, temperature, radii) propagate live to any open settings modal via the shared store subscription.

**Rationale:** The user confirmed this is the desired behaviour (settings modal reflects changes immediately). The alternative — disabling all shortcuts when a modal is open — would require tracking modal open state in `GlobalShortcuts` and `ActiveModeShortcuts`, adding coupling for no benefit since the Zustand store already handles live sync.

### D7 — `LightPage.tsx` inline `F` key `useEffect` is removed and replaced by `GlobalShortcuts`

**Decision:** The existing `useEffect` in `LightPage.tsx` that handles the `F` key is deleted. `GlobalShortcuts` mounted in `LightPage` picks up the behaviour identically.

**Rationale:** Zero behaviour change to the existing fullscreen-toggle spec. Consolidates all keyboard handling behind the new system.

### D8 — `HelpButton` positioned at `right-28`, joining the existing button row

**Decision:** `HelpButton` is `fixed top-4 right-28 z-50`, consistent with `FullscreenButton` at `right-16` and `GearButton` at `right-4`. Gap is 48px (12 Tailwind units) between each button.

**Rationale:** Maintains the existing spacing pattern already established by the two buttons. No layout changes needed beyond adding the new button.

## Risks / Trade-offs

**Arrow keys swallowed by sliders** → The focus guard blocks all shortcuts when any `HTMLInputElement` has focus, which includes sliders (`type="range"`). A user interacting with a slider in the settings modal will be unable to also use `↑`/`↓` shortcuts simultaneously — but this is the correct behaviour (the slider should handle arrow keys natively).

**`keydown` on `document` vs `window`** → Using `document` is consistent with the existing fullscreen shortcut. Events reach `document` unless explicitly stopped. If any future component calls `e.stopPropagation()`, shortcuts will stop working for that interaction. Mitigation: document this in the hook's file.

**Per-mode component mounting/unmounting on mode switch** → When the active profile's mode changes, `ActiveModeShortcuts` unmounts the old mode component and mounts the new one. This removes and re-adds the `keydown` listener, which is a tiny but real cost. At application scale this is negligible.

**Hardcoded help content drifts from actual bindings** → If a future change adds or removes a shortcut without updating `HelpDialog`, the dialog will show stale info. Mitigation: the design doc and tasks explicitly require updating `HelpDialog` as part of any future shortcut change.

## Migration Plan

No data migration required. `LightPage.tsx` is modified to remove the inline `useEffect` and mount the two new shortcut components. All other files are additive. No breaking changes.
