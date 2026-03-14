## Why

The Zustand store already uses the `persist` middleware with a `localStorage` key (`glowframe-store`), but the persisted state currently only includes `lightColor` and `brightness`. As GlowFrame adds profiles and more settings over time, the persist configuration needs to be hardened with a versioned migration strategy so stale cached data from earlier builds never causes runtime crashes.

This change formalises the persistence contract — specifying exactly what is persisted, adding a `version` field, and wiring a `migrate` function so future schema changes can be handled cleanly.

## What Changes

- Document and verify the current `persist` middleware configuration (key, storage, partialize).
- Add a `version` number to the persist options.
- Add a `migrate` function stub that handles future version bumps gracefully.
- Ensure only the intended state fields (`lightColor`, `brightness`) are persisted via `partialize` (actions are never serialised).
- Write unit tests verifying that persisted state is restored on load and that an unknown version triggers a safe reset to defaults.

## Capabilities

### New Capabilities

- `local-storage-persistence`: The Zustand store persists configuration to `localStorage`, restores it on load, excludes action functions from serialization, and handles schema version migrations without crashing.

### Modified Capabilities

<!-- none — persist middleware is already wired; this change formalises and tests it -->

## Impact

- `src/store/index.ts` — add `version`, `migrate`, and `partialize` to persist options.
- `src/store/index.test.ts` — add tests for persistence restore and version migration.
- No new runtime dependencies.
