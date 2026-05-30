## Why

The `Profile` type mixes identity fields (`id`, `name`), light settings, and clock settings at the same flat level, making the schema hard to read and increasingly messy as new feature groups are added. Restructuring into two explicit sub-objects (`light: LightConfig`, `clock: ClockConfig`) makes the shape self-documenting and provides clean extension points for future groups.

## What Changes

- **BREAKING** `Profile` is restructured from `{ id, name, clock?, ...ProfileMode }` to `{ id, name, light: LightConfig, clock: ClockConfig }`.
- `LightConfig` is introduced as a named type equivalent to the current `ProfileMode` discriminated union (all six modes), nested under `profile.light`.
- `ClockConfig` becomes required on `Profile` (currently optional with `?? CLOCK_DEFAULTS` fallbacks).
- All store actions updated: light-field patches target `profile.light`, clock patches target `profile.clock`.
- Schema version bumped to 5; no migration — existing localStorage data with the old flat shape is treated as a clean install.
- Share URL encode/decode updated to the new nested shape.
- Backup export/import updated to the new nested shape.
- All components, hooks, and tests updated from `profile.X` to `profile.light.X` for light fields.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `named-profiles`: `Profile` type definition changes to `{ id, name, light: LightConfig, clock: ClockConfig }` — both sub-objects required.
- `local-storage-persistence`: Schema version bumps from 4 to 5; no migrate function (flat profiles from v4 are discarded on load).
- `profile-share`: Encode/decode Zod schema restructured to the new nested shape.
- `profile-backup-restore`: Backup schema restructured; import validates new nested shape.
- `clock-overlay`: `ClockConfig` becomes a required field on `Profile` (removes optional `?`).

## Impact

- `src/store/index.ts` — `Profile` type, `_version`, `_defaultProfile`, all actions (`createProfile`, `deleteProfile`, `switchMode`, `updateProfile`, `restoreProfiles`)
- `src/lib/modeDefaults.ts` — `ProfileMode` becomes `LightConfig`; `MODE_DEFAULTS` values become `LightConfig` defaults
- `src/lib/profileShare.ts` — Zod schemas restructured, `encodeProfile` / `decodeProfile` updated
- `src/lib/profileBackup.ts` — Zod schemas restructured, `exportBackup` / `importBackup` updated
- `src/components/mode-settings/` — all six mode-settings components (`profile.X` → `profile.light.X`)
- `src/components/shortcuts/` — clock shortcuts already use `profile.clock.X` (no change); light shortcuts use `profile.X` → `profile.light.X`
- `src/components/ClockOverlay.tsx` — `profile.clock` access unchanged; remove `?? CLOCK_DEFAULTS` fallback
- Tests — unit tests for store, profileShare, profileBackup; E2E tests remain structurally valid (no behavior change)
