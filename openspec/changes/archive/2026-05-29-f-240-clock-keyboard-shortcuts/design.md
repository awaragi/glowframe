## Context

GlowFrame already has a mature keyboard shortcut engine (`useKeyboardShortcuts`) and a convention for headless shortcut components (`GlobalShortcuts`, `ActiveModeShortcuts`). The clock overlay (F-220) is fully implemented with `clock.enabled` and `clock.position` stored per profile in Zustand. The HelpDialog renders a hardcoded grouped shortcuts table.

## Goals / Non-Goals

**Goals:**
- Add `T` key to cycle through clock states: off → on at `top-left` → `bottom-left` → `bottom-right` → off.
- Add `Shift+T` key to cycle `clock.size` (`small` → `medium` → `large` → `small`).
- Expose both shortcuts in the HelpDialog under a new "Clock" group.

**Non-Goals:**
- Changing the clock overlay's visual design.
- Adding shortcuts for `clock.format`.
- Making shortcuts configurable at runtime.

## Decisions

### Decision: New `ClockShortcuts` component rather than extending `GlobalShortcuts`

`GlobalShortcuts` handles app-level actions (fullscreen, settings, help, preset selection). Clock shortcuts are feature-specific and conceptually closer to the mode-shortcut pattern. A dedicated `ClockShortcuts` headless component keeps each file focused and mirrors the existing `ActiveModeShortcuts` approach.

**Alternative considered:** Add `T`/`Shift+T` to `GlobalShortcuts` directly. Rejected because it would grow `GlobalShortcuts` into a kitchen-sink component and make it harder to test clock shortcuts in isolation.

### Decision: T cycles a combined enabled+position state machine

Rather than separate keys for on/off and position, `T` advances a single four-state cycle: `off` → `on+top-left` → `on+bottom-left` → `on+bottom-right` → `off`. This keeps the most common workflow (turn on, pick a corner) reachable with a single key and a small number of presses, without requiring the user to remember two separate keys.

**Alternative considered:** Separate `T` (toggle on/off) and `Shift+T` (cycle position). Rejected — the user now wants `Shift+T` for size cycling, and a toggle-only `T` forces two keys to reach a non-default position from an off state.

### Decision: Shift+T cycles clock size

`small` → `medium` → `large` → `small`. All three size values from the clock-overlay spec are covered in one short cycle.

### Decision: `T` is case-insensitive via lowercase key matching

The existing shortcut engine compares `event.key.toLowerCase()` to the registered `key` string (lowercase). Registering `{ key: 't' }` already handles both `T` and `t`. No changes needed to the engine.

## Risks / Trade-offs

- **Risk**: `T` clashes with a future shortcut. → Mitigation: `T` is currently unassigned; document it in the HelpDialog immediately so it is visible to future contributors.
- **Trade-off**: The combined state machine means the clock's position is reset to `top-left` whenever it is turned on via `T`. Users who want a different position must press `T` multiple times. This is acceptable given the small cycle length (3 positions).
