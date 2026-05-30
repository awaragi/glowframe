## 1. Core Types

- [x] 1.1 In `src/lib/modeDefaults.ts`, rename exported type `ProfileMode` → `LightConfig`; update `MODE_DEFAULTS` type annotation to `Record<LightConfig['mode'], LightConfig>`
- [x] 1.2 In `src/store/index.ts`, redefine `Profile` as `{ id: string; name: string; light: LightConfig; clock: ClockConfig }` (both required, no `&` spread); rename `AllModeFields` → `AllLightFields` scoped to light-only fields (drop `clock?` from union); update `AppState` to expose `updateLight` and `updateClock` in place of `updateProfile`

## 2. Store Implementation

- [x] 2.1 Update `_defaultProfile` to `{ id, name, light: { ...MODE_DEFAULTS['full'] }, clock: { ...CLOCK_DEFAULTS } }`
- [x] 2.2 Update `createProfile`: clone `{ ...active, id: newId, name, light: { ...active.light }, clock: { ...active.clock } }`
- [x] 2.3 Update `deleteProfile` fresh-profile fallback to use the same nested shape as `_defaultProfile`
- [x] 2.4 Update `switchMode`: replace `profile.light` with `MODE_DEFAULTS[newMode]`, preserve `id`, `name`, and `clock`
- [x] 2.5 Implement `updateLight(id, patch: AllLightFields)`: merge patch into `profile.light`; implement `updateClock(id, patch: Partial<ClockConfig>)`: merge patch into `profile.clock`; remove `updateProfile`
- [x] 2.6 Update `restoreProfiles`: map each entry to `{ id: newUUID, name, light: entry.light, clock: entry.clock }`
- [x] 2.7 Bump `_version` to `5` and `persist version` to `5`; remove the existing `migrate` function (old localStorage data is discarded)
- [x] 2.8 Update `selectActiveProfile` return type annotation if needed (no logic change expected)

## 3. Serialization

- [x] 3.1 In `src/lib/profileShare.ts`, define per-mode light Zod schemas (`lightFullSchema`, `lightRingSchema`, etc.) without `name` or `clock`; compose `lightConfigSchema` as `z.discriminatedUnion('mode', [...])` over those schemas; define `sharedProfileSchema` as `z.object({ name, light: lightConfigSchema, clock: clockConfigSchema })`
- [x] 3.2 Update `encodeProfile`: serialize `{ name: profile.name, light: profile.light, clock: profile.clock }` (exclude `id`)
- [x] 3.3 Update `decodeProfile`: validate against the new `sharedProfileSchema`; update `SharedProfile` type to match new shape
- [x] 3.4 In `src/lib/profileBackup.ts`, update `backupProfileSchema` to use the same `sharedProfileSchema`; update `exportBackup` to serialize `{ name, light, clock }` per profile; no logic change needed in `importBackup` (Zod validation already rejects mismatched shapes)

## 4. Component and Hook Updates

- [x] 4.1 `src/components/LightSurface.tsx`: `profile.mode` → `profile.light.mode` in the mode switch; pass `profile.light` (typed as `LightConfig`) to mode surface sub-components if needed
- [x] 4.2 `src/components/SettingsModal.tsx`: replace `updateProfile` store selector with `updateLight` + `updateClock`; update clock-field handler to call `updateClock`; rename `updateProfile` prop passed to mode-settings components to `updateLight`; update `renderModeSettings` mode switch from `profile.mode` → `profile.light.mode`
- [x] 4.3 `src/components/ImportProfileDialog.tsx`: update `profile.mode` → `profile.light.mode` in the dialog label; update `importProfile` call to pass the new nested shape
- [x] 4.4 `src/components/ClockOverlay.tsx`: remove any `?? CLOCK_DEFAULTS` fallback (clock is now required); no path changes needed

## 5. Mode Settings Components

- [x] 5.1 `src/components/mode-settings/FullModeSettings.tsx`: `profile.lightTemperature` → `profile.light.lightTemperature`, `profile.lightBrightness` → `profile.light.lightBrightness`; rename `updateProfile` prop → `updateLight`
- [x] 5.2 `src/components/mode-settings/FullColorModeSettings.tsx`: `profile.lightColor` → `profile.light.lightColor`; rename `updateProfile` prop → `updateLight`
- [x] 5.3 `src/components/mode-settings/RingModeSettings.tsx`: update all field accesses to `profile.light.X`; rename `updateProfile` prop → `updateLight`
- [x] 5.4 `src/components/mode-settings/RingColorModeSettings.tsx`: update all field accesses to `profile.light.X`; rename `updateProfile` prop → `updateLight`
- [x] 5.5 `src/components/mode-settings/SpotModeSettings.tsx`: update all field accesses to `profile.light.X`; rename `updateProfile` prop → `updateLight`
- [x] 5.6 `src/components/mode-settings/SpotColorModeSettings.tsx`: update all field accesses to `profile.light.X`; rename `updateProfile` prop → `updateLight`

## 6. Shortcut Components

- [x] 6.1 `src/components/shortcuts/FullModeShortcuts.tsx`: replace `updateProfile` store selector with `updateLight`; update field accesses from `profile.X` → `profile.light.X`
- [x] 6.2 `src/components/shortcuts/RingModeShortcuts.tsx`: same as 6.1
- [x] 6.3 `src/components/shortcuts/SpotModeShortcuts.tsx`: same as 6.1
- [x] 6.4 `src/components/shortcuts/RingColorModeShortcuts.tsx`: same as 6.1
- [x] 6.5 `src/components/shortcuts/SpotColorModeShortcuts.tsx`: same as 6.1
- [x] 6.6 `src/components/shortcuts/ClockShortcuts.tsx`: replace `updateProfile` store selector with `updateClock`; clock field accesses (`profile.clock.X`) are already correct
- [x] 6.7 `src/components/shortcuts/ActiveModeShortcuts.tsx`: update `profile.mode` → `profile.light.mode` if used for mode-switching logic

## 7. Unit Tests

- [x] 7.1 `src/store/index.test.ts`: update all profile fixture objects to nested `{ light: {...}, clock: {...} }` shape; update action test scenarios for `createProfile`, `deleteProfile`, `switchMode`, `updateLight`, `updateClock`, `restoreProfiles`; add test for `updateLight` not affecting `clock` and `updateClock` not affecting `light`
- [x] 7.2 `src/lib/profileShare.test.ts`: update test profile objects to nested shape; update schema assertion tests
- [x] 7.3 `src/lib/profileBackup.test.ts`: update test profile objects to nested shape; add scenario asserting pre-F-250 flat backup is rejected
- [x] 7.4 `src/lib/modeDefaults.test.ts`: update any `ProfileMode` type references to `LightConfig`
- [x] 7.5 `src/components/LightSurface.test.tsx`: update profile mock objects to nested shape
- [x] 7.6 `src/components/SettingsModal.test.tsx`: update profile mock objects; update any `updateProfile` mock references
- [x] 7.7 `src/components/mode-settings/RingModeSettings.test.tsx` + `RingColorModeSettings.test.tsx`: update profile fixtures to nested shape
- [x] 7.8 `src/components/shortcuts/FullModeShortcuts.test.tsx`, `RingModeShortcuts.test.tsx`, `SpotModeShortcuts.test.tsx`, `ClockShortcuts.test.tsx`: update profile fixtures; update store mock for `updateLight`/`updateClock` in place of `updateProfile`
- [x] 7.9 `src/components/light-modes/*.test.tsx` (6 files): update any profile fixture objects to nested shape if used
- [x] 7.10 Run `npm test` — all unit tests must pass

## 8. E2E Tests

- [x] 8.1 Run `npm run test:e2e` — all E2E tests must pass with no changes (behaviour is unchanged; only internal structure differs)
