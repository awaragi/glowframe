## 1. Store Extension

- [x] 1.1 Extend the `Profile` interface in `src/store/index.ts` with `colorTemperature: number`, `ringFormat: "full" | "circle" | "border"`, `innerRadius: number`, `outerRadius: number`
- [x] 1.2 Update the default "Default" profile seed to include `colorTemperature: 6500`, `ringFormat: "full"`, `innerRadius: 0`, `outerRadius: 100`
- [x] 1.3 Add `updateProfile(id: string, patch: Partial<Omit<Profile, "id">>)` action that merges the patch into the matching profile
- [x] 1.4 Bump persist `version` to `3`; add `migrate` case for v2→v3 that applies default values for the four new fields on each existing profile

## 2. Color Temperature Helper

- [x] 2.1 Create `src/lib/colorTemperature.ts` exporting `kelvinToHex(k: number): string` — interpolates between warm-white (`#ffb347` at 1000 K) and cool-white (`#cce8ff` at 10000 K)
- [x] 2.2 Create `src/lib/colorTemperature.test.ts` with unit tests for edge values (1000, 6500, 10000) and mid-range values

## 3. LightSurface Rendering

- [x] 3.1 Update `LightSurface.tsx` to read `colorTemperature`, `ringFormat`, `innerRadius`, `outerRadius` from the active profile
- [x] 3.2 Blend `lightColor` with `kelvinToHex(colorTemperature)` tint to produce the final render color
- [x] 3.3 Implement `"full"` rendering — `backgroundColor` fills `fixed inset-0` (existing behaviour, now reading from profile)
- [x] 3.4 Implement `"circle"` rendering — `radial-gradient` using `at center / min(100vw,100vh) min(100vw,100vh)` with inner and outer radius stops
- [x] 3.5 Implement `"border"` rendering — `box-shadow: inset` or CSS custom property `--ring-thickness` for the rectangular frame band

## 4. Unit Tests

- [x] 4.1 Update `LightSurface.test.tsx` to cover: `"full"` format with color temperature, `"circle"` format renders ring class/style, `"border"` format renders frame style
- [x] 4.2 Update `src/store/index.test.ts`: add tests for `updateProfile` action, v2→v3 migration with default extended field values

## 5. E2E Smoke Check

- [x] 5.1 Verify existing E2E smoke test still passes after `LightSurface` changes (`npm run test:e2e`)
