## 1. Mode Defaults Module

- [ ] 1.1 Create `src/lib/modeDefaults.ts` exporting `MODE_DEFAULTS` — a typed record keyed by `ProfileMode['mode']` with one complete default object per mode:
  - `full`: `{ mode: 'full', lightTemperature: 6500, lightBrightness: 100 }`
  - `full-color`: `{ mode: 'full-color', lightColor: '#ffffff' }`
  - `ring`: `{ mode: 'ring', lightTemperature: 6500, lightBrightness: 100, innerRadius: 20, outerRadius: 80, backgroundLightTemperature: 0, backgroundLightBrightness: 0 }`
  - `ring-color`: `{ mode: 'ring-color', lightColor: '#ffffff', innerRadius: 20, outerRadius: 80, backgroundColor: '#000000' }`
  - `spot`: `{ mode: 'spot', lightTemperature: 6500, lightBrightness: 100, radius: 40, backgroundLightTemperature: 0, backgroundLightBrightness: 0 }`
  - `spot-color`: `{ mode: 'spot-color', lightColor: '#ffffff', radius: 40, backgroundColor: '#000000' }`
- [ ] 1.2 Type `MODE_DEFAULTS` with `as const satisfies Record<ProfileMode['mode'], ProfileMode>` to get exhaustiveness checking
- [ ] 1.3 Write unit tests for `modeDefaults.ts` in `src/lib/modeDefaults.test.ts` — verifies each of the six entries exists, has the correct `mode` discriminant, and all expected fields are present with correct default values

## 2. Store — Profile Type & Actions

- [ ] 2.1 Replace flat `Profile` type with discriminated union `{ id: string; name: string } & ProfileMode` covering all six modes
- [ ] 2.2 Remove `ringFormat`, `colorTemperature`, `brightness`, `innerRadius`, `outerRadius` from the type; rename `colorTemperature` → `lightTemperature`, `brightness` → `lightBrightness`
- [ ] 2.3 Import `MODE_DEFAULTS` from `src/lib/modeDefaults.ts`; no default values defined inline in the store
- [ ] 2.4 Add `switchMode(id, newMode)` action that replaces mode-specific fields with `MODE_DEFAULTS[newMode]`, preserving `id` and `name`
- [ ] 2.5 Update `createProfile` to clone the full active profile state (including `mode` and mode-specific fields)
- [ ] 2.6 Update `updateProfile` patch type to exclude `id`, `name`, and `mode` (mode changes must go through `switchMode`)
- [ ] 2.7 Bump store `version` to `4`; remove any existing `migrate` function
- [ ] 2.8 Update `_defaultProfile` seed using `MODE_DEFAULTS['full']` (no inline values)
- [ ] 2.9 Update `selectActiveProfile` return type to `Profile` (discriminated union)
- [ ] 2.10 Update store unit tests in `src/store/index.test.ts` to cover the new type, `switchMode`, and v4 seeding

## 3. Mode Renderer Components

- [ ] 3.1 Create `src/components/light-modes/FullModeSurface.tsx` — fixed `inset-0`, `blendWithTemperature('#ffffff', lightTemperature)` + `filter: brightness(lightBrightness/100)`; add `data-testid="light-surface"` and `data-mode="full"`
- [ ] 3.2 Create `src/components/light-modes/FullColorModeSurface.tsx` — fixed `inset-0`, `background-color: lightColor`, no filter; `data-testid="light-surface"` and `data-mode="full-color"`
- [ ] 3.3 Create `src/components/light-modes/RingModeSurface.tsx` — two-layer: background div (`data-testid="light-surface-bg"`) with temp-blended bg color + brightness filter; foreground div (`data-testid="light-surface-fg"`) with radial-gradient ring (transparent inside inner, `fgColor` between inner/outer, transparent outside); `data-mode="ring"` on root
- [ ] 3.4 Create `src/components/light-modes/RingColorModeSurface.tsx` — two-layer: background div with `backgroundColor`; foreground div with radial-gradient ring in `lightColor`; `data-mode="ring-color"` on root
- [ ] 3.5 Create `src/components/light-modes/SpotModeSurface.tsx` — two-layer: background div with temp-blended bg color + brightness filter; foreground div with radial-gradient disc in temp-blended fg color; `data-mode="spot"` on root
- [ ] 3.6 Create `src/components/light-modes/SpotColorModeSurface.tsx` — two-layer: background div with `backgroundColor`; foreground div with radial-gradient disc in `lightColor`; `data-mode="spot-color"` on root
- [ ] 3.7 All six renderers use `min(100vw, 100vh)` as the reference dimension for radii (responsive sizing)

## 4. LightSurface Dispatcher

- [ ] 4.1 Rewrite `src/components/LightSurface.tsx` to read `profile.mode` from the store and render the corresponding mode renderer; remove all inline rendering logic
- [ ] 4.2 Pass the narrowed profile object as a prop to each mode renderer (no store reads inside renderers)

## 5. Mode Renderer Unit Tests

- [ ] 5.1 Write unit tests for `FullModeSurface` — verifies temperature-blended color and brightness filter are applied; `data-mode="full"` present
- [ ] 5.2 Write unit tests for `FullColorModeSurface` — verifies `lightColor` is the background; no filter; `data-mode="full-color"` present
- [ ] 5.3 Write unit tests for `RingModeSurface` — verifies `data-testid="light-surface-bg"` and `data-testid="light-surface-fg"` are rendered; foreground has radial-gradient style; background brightness filter reflects `backgroundLightBrightness`; `data-mode="ring"` present
- [ ] 5.4 Write unit tests for `RingColorModeSurface` — verifies `lightColor` in foreground gradient, `backgroundColor` on background layer, `innerRadius`/`outerRadius` in gradient stops; `data-mode="ring-color"` present
- [ ] 5.5 Write unit tests for `SpotModeSurface` — verifies two layers rendered; foreground has spot radial-gradient; background is black (`brightness(0)`) at default `backgroundLightBrightness: 0`; `data-mode="spot"` present
- [ ] 5.6 Write unit tests for `SpotColorModeSurface` — verifies `lightColor` in foreground gradient, `backgroundColor` on background layer, `radius` in gradient stops; `data-mode="spot-color"` present
- [ ] 5.7 Rewrite `src/components/LightSurface.test.tsx` — verifies dispatcher renders the correct `data-mode` component for each of the six modes

## 6. Mode Settings Components

- [ ] 6.1 Create `src/components/mode-settings/FullModeSettings.tsx` — sliders for `lightTemperature` and `lightBrightness`
- [ ] 6.2 Create `src/components/mode-settings/FullColorModeSettings.tsx` — color picker for `lightColor`
- [ ] 6.3 Create `src/components/mode-settings/RingModeSettings.tsx` — sliders for `lightTemperature`, `lightBrightness`, `innerRadius`, `outerRadius`, `backgroundLightTemperature`, `backgroundLightBrightness`
- [ ] 6.4 Create `src/components/mode-settings/RingColorModeSettings.tsx` — color picker for `lightColor`; sliders for `innerRadius`, `outerRadius`; color picker for `backgroundColor`
- [ ] 6.5 Create `src/components/mode-settings/SpotModeSettings.tsx` — sliders for `lightTemperature`, `lightBrightness`, `radius`, `backgroundLightTemperature`, `backgroundLightBrightness`
- [ ] 6.6 Create `src/components/mode-settings/SpotColorModeSettings.tsx` — color picker for `lightColor`; slider for `radius`; color picker for `backgroundColor`
- [ ] 6.7 Each settings component uses React Hook Form + Zod with a schema scoped to that mode's fields; calls `updateProfile` on change

## 7. SettingsModal Refactor

- [ ] 7.1 Add a mode selector (shadcn/ui Select) to `SettingsModal` that calls `switchMode` and shows all six mode options; add `data-testid="mode-selector"` to the trigger
- [ ] 7.2 Replace the existing mode-specific settings block with a switch on `activeProfile.mode` that renders the correct `<*ModeSettings />` component
- [ ] 7.3 Remove the old `ringFormat`, `innerRadius`, `outerRadius`, `colorTemperature`, `brightness` form fields and their Zod schema entries from `SettingsModal`
- [ ] 7.4 Rewrite `src/components/SettingsModal.test.tsx` — verifies mode selector presence, correct settings section rendered per mode, and that switching mode shows the new mode's fields

## 8. E2E — Page Object & Shared Infrastructure

- [ ] 8.1 Update `e2e/pages/settings.page.ts` — remove stale `brightnessSlider`, `colorTemperatureSlider` accessors; add `modeSelector` accessor (`[data-testid="mode-selector"]`); add `lightSurface` accessor (`[data-testid="light-surface"]`); add `selectMode(mode)` helper that opens the mode selector and picks the given option
- [ ] 8.2 Add `lightSurfaceMode()` helper to `e2e/pages/settings.page.ts` that returns the current `data-mode` attribute value from `[data-testid="light-surface"]`

## 9. E2E — Mode Rendering Tests (`e2e/light-modes.spec.ts`)

- [ ] 9.1 **full mode** — navigate to home, verify `data-mode="full"` on the light surface; open settings, confirm `lightTemperature` and `lightBrightness` sliders are visible; adjust `lightBrightness` slider and verify `filter: brightness(...)` changes on the surface
- [ ] 9.2 **full-color mode** — switch to `full-color`; verify `data-mode="full-color"` on surface; confirm only the `lightColor` picker is visible in settings; no brightness or temperature slider shown
- [ ] 9.3 **ring mode** — switch to `ring`; verify `data-mode="ring"` on surface; confirm settings shows `lightTemperature`, `lightBrightness`, `innerRadius`, `outerRadius`, `backgroundLightTemperature`, `backgroundLightBrightness` sliders; adjust `innerRadius` slider and verify the inline style of the foreground layer updates
- [ ] 9.4 **ring-color mode** — switch to `ring-color`; verify `data-mode="ring-color"` on surface; confirm settings shows `lightColor` picker, `innerRadius` slider, `outerRadius` slider, `backgroundColor` picker; no temperature or brightness slider
- [ ] 9.5 **spot mode** — switch to `spot`; verify `data-mode="spot"` on surface; confirm settings shows `lightTemperature`, `lightBrightness`, `radius`, `backgroundLightTemperature`, `backgroundLightBrightness` sliders; adjust `radius` slider and verify foreground layer gradient updates
- [ ] 9.6 **spot-color mode** — switch to `spot-color`; verify `data-mode="spot-color"` on surface; confirm settings shows `lightColor` picker, `radius` slider, `backgroundColor` picker; no temperature or brightness slider

## 10. E2E — Mode Switching Tests (`e2e/mode-switching.spec.ts`)

- [ ] 10.1 **Destructive switch clears old fields** — start in `ring` mode, adjust `innerRadius` to a non-default value; switch to `full`; verify `data-mode="full"` on surface and that no ring-specific controls are visible in settings
- [ ] 10.2 **Switch through all six modes in sequence** — cycle through `full` → `full-color` → `ring` → `ring-color` → `spot` → `spot-color`; after each switch verify the correct `data-mode` attribute is present on the light surface
- [ ] 10.3 **Default values applied on switch** — switch to `spot`; open settings and verify `lightBrightness` slider label shows `100` and `radius` slider label shows `40` (the defaults from `MODE_DEFAULTS`)
- [ ] 10.4 **Profile identity preserved on switch** — create a profile named `Studio`; switch its mode to `ring-color`; verify the profile is still listed as `Studio` with `aria-pressed="true"`
- [ ] 10.5 **Multiple profiles with different modes** — create two profiles; set first to `full`, second to `spot-color`; switch between profiles and verify the light surface `data-mode` attribute changes accordingly

## 11. E2E — Settings Persistence Tests (update `e2e/settings.spec.ts`)

- [ ] 11.1 Remove or rewrite tests that reference the old `brightnessSlider` and `colorTemperatureSlider` accessors from the `full` mode era; replace with mode-aware equivalents using `selectMode` helper
- [ ] 11.2 **full mode brightness persists** — in `full` mode, lower `lightBrightness` slider; reload the page; verify the brightness slider still reflects the saved value and the surface filter matches
- [ ] 11.3 **ring-color mode fields persist** — switch to `ring-color`, change `innerRadius`; reload; verify `innerRadius` slider label shows the saved value
- [ ] 11.4 **Mode selection persists across reload** — switch to `spot-color`; reload the page; verify `data-mode="spot-color"` is present without opening settings

## 12. Cleanup & Verification

- [ ] 12.1 Delete or update `ExampleForm.tsx` if it references any removed profile fields
- [ ] 12.2 Run `npm run test` — all unit tests pass
- [ ] 12.3 Run `npm run build` — TypeScript compiles with no errors
- [ ] 12.4 Run `npm run test:e2e` — all E2E specs pass
