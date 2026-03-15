## 1. Store Refactor

- [x] 1.1 Define `Profile` interface in `src/store/index.ts` with fields: `id`, `name`, `lightColor`, `brightness`
- [x] 1.2 Update `AppState` to replace flat `lightColor`/`brightness` fields with `profiles: Profile[]` and `activeProfileId: string`
- [x] 1.3 Implement `createProfile(name: string)` action — clones active profile settings, generates UUID via `crypto.randomUUID()`, appends to `profiles`, sets `activeProfileId`
- [x] 1.4 Implement `renameProfile(id: string, newName: string)` action — updates `name` of the matching profile
- [x] 1.5 Implement `deleteProfile(id: string)` action — removes profile; if active, switches to previous index or index 0; no-op if only one profile remains
- [x] 1.6 Implement `setActiveProfile(id: string)` action — sets `activeProfileId`
- [x] 1.7 Seed default "Default" profile (`lightColor: "#ffffff"`, `brightness: 100`) as initial store state

## 2. Persistence Migration

- [x] 2.1 Update `partialize` to persist `profiles`, `activeProfileId`, and `_version` (remove flat `lightColor`/`brightness`)
- [x] 2.2 Bump `persist` `version` to `2`
- [x] 2.3 Add `migrate` function: wrap v1 `{ lightColor, brightness }` into a single "Default" profile with a generated UUID

## 3. Consumer Updates

- [x] 3.1 Update `LightSurface.tsx` to derive `lightColor` and `brightness` from the active profile via a store selector
- [x] 3.2 Update `ConfigPage.tsx` (if it reads flat store fields) to use the active profile selector
- [x] 3.3 Add and export a `selectActiveProfile` selector helper for convenience

## 4. Unit Tests

- [x] 4.1 Update `src/store/index.test.ts` — rewrite existing tests to match new store shape (profiles array + activeProfileId)
- [x] 4.2 Add test: `createProfile` clones active settings and switches active id
- [x] 4.3 Add test: `renameProfile` updates name without affecting other profiles
- [x] 4.4 Add test: `deleteProfile` removes profile and switches active when needed; no-op with single profile
- [x] 4.5 Add test: `setActiveProfile` updates `activeProfileId`
- [x] 4.6 Add test: `migrate` converts v1 data to v2 profile shape

## 5. E2E Smoke Check

- [x] 5.1 Verify existing E2E smoke test still passes after store refactor (`npm run test:e2e`)
