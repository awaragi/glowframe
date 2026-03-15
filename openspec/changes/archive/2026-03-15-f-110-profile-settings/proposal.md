## Why

The profile data model introduced by F-100 only stores `lightColor` and `brightness`. A realistic fill light needs colour temperature, ring format, and radius controls to cover the diverse lighting scenarios users encounter. F-110 extends each profile with the full parameter set needed to produce any light configuration the app will ever support.

## What Changes

- The `Profile` type is extended with four additional fields: `colorTemperature`, `ringFormat`, `innerRadius`, and `outerRadius`.
- Default values for the new fields are added to the "Default" profile seed.
- The `LightSurface` component is updated to render ring formats (`"full"`, `"circle"`, `"border"`) using the active profile's shape parameters.
- `setProfileField(id, field, value)` (or per-field setters) are added to the store so any parameter can be updated live.
- All parameter changes apply immediately with no save button required.
- **BREAKING** (store shape): The `Profile` type gains four new required fields; v2 persisted data that lacks them is migrated to v3 with defaults applied.

## Capabilities

### New Capabilities
- `profile-settings`: The extended `Profile` type and its rendering semantics — `colorTemperature`, `ringFormat`, `innerRadius`, `outerRadius` — including the three ring-format rendering modes and live update behaviour.

### Modified Capabilities
- `named-profiles`: `Profile` type gains four new fields; the store's default seed and migration must be updated.
- `core-light-display`: `LightSurface` rendering is now driven by `ringFormat`, `innerRadius`, and `outerRadius` in addition to `lightColor` and `brightness`; the colour output is also blended with `colorTemperature`.

## Impact

- `src/store/index.ts` — `Profile` type extended; new per-field update action(s); schema bumps to v3; migrate v2→v3 applies defaults for new fields.
- `src/components/LightSurface.tsx` — must handle the three `ringFormat` values and apply `colorTemperature` tinting alongside `brightness`.
- `src/components/LightSurface.test.tsx` — new test cases for each ring format.
- No new runtime dependencies required (CSS clip-path or border-radius handles the ring shapes).
