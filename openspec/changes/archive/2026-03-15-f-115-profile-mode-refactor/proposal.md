## Why

The current `Profile` type is a flat object where all fields coexist regardless of which display mode is active — leading to irrelevant controls in the settings UI, weak type safety, and no clear per-mode contract. The `ringFormat` discriminant was bolted on after the fact, making the model hard to extend and reason about cleanly.

## What Changes

- **BREAKING** Replace flat `Profile` type with a discriminated union on `mode`; each mode owns exactly the fields it needs.
- **BREAKING** Remove `ringFormat`, `colorTemperature`, `brightness`, `innerRadius`, `outerRadius` as top-level flat fields.
- **BREAKING** Field renames: `colorTemperature` → `lightTemperature`, `brightness` → `lightBrightness`.
- Introduce six named modes: `full`, `full-color`, `ring`, `ring-color`, `spot`, `spot-color`.
- Temperature modes (`full`, `ring`, `spot`) use `lightTemperature` + `lightBrightness` to derive color; color modes (`full-color`, `ring-color`, `spot-color`) use `lightColor` only (picker encodes luminosity, no separate brightness).
- Background fields for `ring` / `spot` modes follow the same temperature/color split as the foreground: `backgroundLightTemperature` + `backgroundLightBrightness` for temp modes, `backgroundColor` for color modes. Defaults produce black so the lit shape appears immediately.
- Mode switching is destructive: switching to a different mode replaces all mode-specific fields with defaults; only `id` and `name` are preserved.
- Split `LightSurface` into one renderer component per mode; the dispatcher switches on `mode`.
- Split `SettingsModal` into one settings section component per mode; only the active mode's controls are shown.
- **BREAKING** Bump store version to `4`; no migration — stored state from version 3 is abandoned on next load.

## Capabilities

### New Capabilities
- `profile-modes`: The discriminated-union `Profile` type with six modes (`full`, `full-color`, `ring`, `ring-color`, `spot`, `spot-color`), per-mode field contracts, default values, and destructive mode-switching behaviour.

### Modified Capabilities
- `profile-settings`: Per-mode field requirements replace the previous flat-field requirements; settings UI is now mode-scoped.
- `named-profiles`: `Profile` type definition changes to a discriminated union; `createProfile` and store version bump to 4.
- `core-light-display`: `LightSurface` rendering requirements change — each mode has distinct rendering behaviour and its own renderer component.

## Impact

- `src/store/index.ts` — `Profile` type replaced, version bumped to 4, `createProfile` / `updateProfile` updated, new `switchMode` action added.
- `src/components/LightSurface.tsx` — Becomes a mode dispatcher; six new sibling renderer components added under `src/components/light-modes/`.
- `src/components/SettingsModal.tsx` — Mode selector added; mode-specific settings extracted to sibling components under `src/components/mode-settings/`.
- `src/lib/colorTemperature.ts` — No changes; `blendWithTemperature` continues to serve temperature-based renderers.
- All existing `LightSurface` and `SettingsModal` unit tests require rewriting; new unit tests required per mode renderer.
