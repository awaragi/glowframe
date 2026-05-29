## Why

GlowFrame has a clock overlay (F-220) that can only be toggled and repositioned through the settings modal. Adding `T` and `Shift+T` keyboard shortcuts gives users instant, hands-free control over the clock without opening any dialog — consistent with how other features (fullscreen, settings, presets) already work.

## What Changes

- Add `T` key shortcut: cycles through clock states in sequence — off → on at `top-left` → `bottom-left` → `bottom-right` → off.
- Add `Shift+T` key shortcut: cycles `clock.size` through `'small'` → `'medium'` → `'large'` → back to `'small'`.
- Register both shortcuts in a new `ClockShortcuts` component on `LightPage`.
- List both shortcuts in the `HelpDialog` grouped reference table under a "Clock" group.

## Capabilities

### New Capabilities

- `clock-keyboard-shortcuts`: Keyboard shortcuts for cycling clock visibility+position (`T`) and cycling clock size (`Shift+T`), integrated into the shortcut engine and discoverable in the help dialog.

### Modified Capabilities

- `keyboard-shortcuts`: The `HelpDialog` grouped table gains a new "Clock" shortcut group with `T` and `Shift+T` entries.
- `clock-overlay`: The clock `enabled`, `position`, and `size` fields become mutatable via keyboard in addition to the settings modal.

## Impact

- `src/hooks/useKeyboardShortcuts.ts` — no changes needed (existing engine handles `shift` modifier).
- `src/components/shortcuts/` — new `ClockShortcuts` component (or added bindings to existing `GlobalShortcuts`).
- `src/store/` — clock state updates triggered via existing Zustand profile store actions.
- `src/components/HelpDialog.tsx` — new "Clock" row group added to the shortcuts table.
- `src/App.tsx` or `LightPage` — `ClockShortcuts` mounted alongside other shortcut components.
