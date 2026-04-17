## Why

Users currently cannot control the order of their saved presets, meaning the keyboard shortcuts (`1`–`9`) and swipe navigation (F-180) are locked to creation order. Allowing reordering gives users deliberate control over which preset is reachable by which shortcut key, and visible sequence numbers make the mapping transparent.

## What Changes

- Each preset entry in the settings modal profile list gains a sequence number badge (e.g., `1`, `2`, `3`, …) to the left of the preset name.
- A drag-and-drop mechanism is added to the profile list in the settings modal, allowing users to reorder presets.
- Drag-and-drop is keyboard-accessible so the order can also be changed without a pointer device.
- Preset order is persisted in Zustand / `localStorage` via the existing array ordering of the profile list — no new `order` field is required.
- Only the first 9 presets map to keyboard shortcuts (`1`–`9`); presets beyond position 9 remain accessible via the modal only.
- Reordering does not mutate any preset's settings, name, or ID — only its position in the array.

## Capabilities

### New Capabilities

- `preset-reordering`: Drag-and-drop (pointer + keyboard) reordering of presets in the settings modal, with live sequence number badges reflecting current list position.

### Modified Capabilities

- `named-profiles`: The profile list now supports reordering actions (move-up / move-down / drag) that update array position in the store.
- `settings-modal`: The profile list section gains sequence number badges and drag-and-drop handles.

## Impact

- **`src/store/index.ts`** — new `reorderProfiles` action that moves a profile from one index to another.
- **`src/components/SettingsModal.tsx`** — profile list updated with sequence badges and a drag-and-drop wrapper.
- **`src/hooks/useKeyboardShortcuts.ts`** — preset-switch bindings (`1`–`9`) already depend on array index order; no logic change required, but the mapping is now user-controlled via reordering.
- **No new external dependencies** if using a Radix UI–compatible drag-and-drop primitive; otherwise `@dnd-kit/core` + `@dnd-kit/sortable` (lightweight, accessible) would be added.
- Existing Vitest unit tests for the store and Playwright E2E scenarios for settings remain valid; new tests are added for the reorder action and E2E drag scenario.
