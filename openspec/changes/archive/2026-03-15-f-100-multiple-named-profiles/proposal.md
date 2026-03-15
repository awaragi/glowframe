## Why

GlowFrame currently stores a single global set of light settings. Users who switch between different lighting setups (e.g., warm fill for video calls vs. cool white for reading) must manually re-adjust sliders every time. Named profiles let users save and switch between configurations instantly.

## What Changes

- The Zustand store is extended to hold an array of `Profile` objects, each with a unique UUID, a name, and a complete set of light parameters.
- A single `activeProfileId` field tracks which profile is currently active.
- Actions are added to: create a new profile (cloned from active), rename a profile, delete a profile, and switch the active profile.
- If an active profile is deleted the store automatically activates the next available profile.
- A default "Default" profile is seeded on first launch (no prior localStorage data).
- All profile data and `activeProfileId` are persisted to `localStorage` under `glowframe-store`.

## Capabilities

### New Capabilities
- `named-profiles`: Management of multiple named light profiles in the Zustand store — create, rename, duplicate, delete, and switch the active profile.

### Modified Capabilities
- `local-storage-persistence`: Persistence schema expands to include the `profiles` array and `activeProfileId`; schema version bumps to `2`.

## Impact

- `src/store/index.ts` — complete rework of the state shape; new `Profile` type and profile actions.
- `src/pages/LightPage.tsx` / `src/components/LightSurface.tsx` — must now read `lightColor` and `brightness` from the active profile rather than flat store fields.
- `src/store/index.test.ts` — existing tests will need to be updated to reflect the new store shape.
- No new runtime dependencies required.
