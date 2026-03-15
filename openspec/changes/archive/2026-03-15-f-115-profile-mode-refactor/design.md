## Context

GlowFrame profiles are currently a flat object — all possible fields (`lightColor`, `brightness`, `colorTemperature`, `ringFormat`, `innerRadius`, `outerRadius`) live on every profile regardless of which display mode is active. This makes the type loose (e.g., `innerRadius` is meaningless on a `full` profile), produces a settings UI that shows irrelevant controls, and makes adding new modes increasingly messy. The `ringFormat` discriminant was added after the fact and is now the foundation for a proper discriminated union.

## Goals / Non-Goals

**Goals:**
- Replace the flat `Profile` type with a TypeScript discriminated union keyed on `mode`
- Each mode owns exactly the fields it needs — enforced by the type system
- One renderer component per mode in `LightSurface`; dispatcher switches on `mode`
- One settings component per mode in `SettingsModal`; only relevant controls shown
- Destructive mode switching: only `id` and `name` survive a mode change
- No migration of stored state; store version bumped to `4`

**Non-Goals:**
- Preserving existing stored profiles across the version bump
- Supporting undo/redo of mode switches
- Sharing or exporting profiles (separate feature)
- Any change to the `colorTemperature.ts` utility; `blendWithTemperature` is unchanged

## Decisions

### D1 — Discriminated union over flat type with optional fields

**Chosen:** `type Profile = { id: string; name: string } & ProfileMode` where `ProfileMode` is a union discriminated on `mode`.

**Alternative considered:** Keep flat type, add optional fields, derive which apply from `mode`. Rejected — TypeScript cannot narrow optional fields this way; every consumer would need manual runtime checks; the type contract doesn't enforce completeness per mode.

**Rationale:** Discriminated unions give compile-time exhaustiveness checking at every `switch(profile.mode)`. Adding a new mode is a type error until all consumers handle it.

### D2 — Six modes

```
full          → lightTemperature: number, lightBrightness: number
full-color    → lightColor: string
ring          → lightTemperature, lightBrightness, innerRadius, outerRadius,
                backgroundLightTemperature, backgroundLightBrightness
ring-color    → lightColor, innerRadius, outerRadius, backgroundColor
spot          → lightTemperature, lightBrightness, radius,
                backgroundLightTemperature, backgroundLightBrightness
spot-color    → lightColor, radius, backgroundColor
```

Temperature modes derive color from `lightTemperature` (pure `#ffffff` base passed to `blendWithTemperature`) and apply `lightBrightness` via CSS `filter: brightness()`. Color modes encode luminosity in their color value directly — no brightness slider.

### D3 — Background rendering for ring / spot using two stacked divs

Ring and spot modes show a lit shape over a background. The background and foreground need independent brightness/filter control, making a single layer with a radial-gradient insufficient (CSS `filter` applies to the whole element).

**Chosen:** Two overlaid `fixed inset-0` divs:
1. **Background layer** — solid `background-color` computed from background fields (temp-blended + brightness filter, or raw color), z-index 0
2. **Foreground layer** — radial-gradient with the lit shape in foreground color and `transparent` elsewhere, z-index 1

The foreground gradient uses `radial-gradient(circle at center / <size> <size>, <fgColor> 0%, <fgColor> R%, transparent R%)` for spot, and adds inner radius stops for ring. `<size>` is `min(100vw, 100vh)` so radii stay viewport-proportional regardless of aspect ratio.

**Alternative considered:** Single-layer gradient with both foreground and background colors inline. Rejected — cannot apply independent brightness filters to gradient color stops; would require computing final RGB values in JS (breaking the CSS-filter approach).

### D4 — Destructive mode switch via `switchMode(id, mode)` action

**Chosen:** `switchMode(id, newMode)` sets `profiles[id]` to `{ id, name, ...defaultsFor(newMode) }`. All prior mode fields are lost.

**Alternative considered:** Store all mode fields as a union bag, switch only activates the relevant subset. Rejected — contradicts the discriminated union design (type would be unsound); bloats stored state; confusing UX (user switches back and sees stale old values).

### D5 — Store version 4, no migration

**Chosen:** `version: 4`, no `migrate` function. Zustand persist drops stored state that doesn't match the current version when no migrator is registered. First load after upgrade re-seeds the default `full` profile.

**Rationale:** No production users exist yet. Migration complexity is not justified.

### D6 — Component file structure

```
src/
  lib/
    modeDefaults.ts                   ← MODE_DEFAULTS map, one entry per mode, single source of truth
  store/
    index.ts                          ← Profile union type, v4 store, switchMode action (imports from modeDefaults)
  components/
    LightSurface.tsx                  ← mode dispatcher only (switch on profile.mode)
    light-modes/
      FullModeSurface.tsx
      FullColorModeSurface.tsx
      RingModeSurface.tsx
      RingColorModeSurface.tsx
      SpotModeSurface.tsx
      SpotColorModeSurface.tsx
    SettingsModal.tsx                 ← adds ModeSelector, delegates to mode settings
    mode-settings/
      FullModeSettings.tsx
      FullColorModeSettings.tsx
      RingModeSettings.tsx
      RingColorModeSettings.tsx
      SpotModeSettings.tsx
      SpotColorModeSettings.tsx
```

Each mode renderer accepts the narrowed profile type as a prop (e.g., `FullModeProfile`), keeping the component pure and easily testable without a store.

Each mode settings component receives the narrowed profile and `updateProfile` / `switchMode` callbacks as props, also keeping it store-independent for unit testing.

### D7 — `lightTemperature: 0` / `lightBrightness: 0` as "black" background default

`backgroundLightBrightness: 0` produces `filter: brightness(0)` = fully black regardless of temperature value. `backgroundLightTemperature: 0` is technically out of the Kelvin range but is only ever rendered at brightness 0, so no visible artifact. This keeps the default clean without requiring a special `null`/`"none"` case.

### D8 — Isolated `modeDefaults.ts` module as single source of truth

**Chosen:** All canonical default field values live in `src/lib/modeDefaults.ts` as a typed `MODE_DEFAULTS` record keyed by mode string. No other file hard-codes default values.

```typescript
// src/lib/modeDefaults.ts
export const MODE_DEFAULTS = {
  'full':         { mode: 'full',         lightTemperature: 6500, lightBrightness: 100 },
  'full-color':   { mode: 'full-color',   lightColor: '#ffffff' },
  'ring':         { mode: 'ring',         lightTemperature: 6500, lightBrightness: 100, innerRadius: 20, outerRadius: 80, backgroundLightTemperature: 0, backgroundLightBrightness: 0 },
  'ring-color':   { mode: 'ring-color',   lightColor: '#ffffff', innerRadius: 20, outerRadius: 80, backgroundColor: '#000000' },
  'spot':         { mode: 'spot',         lightTemperature: 6500, lightBrightness: 100, radius: 40, backgroundLightTemperature: 0, backgroundLightBrightness: 0 },
  'spot-color':   { mode: 'spot-color',   lightColor: '#ffffff', radius: 40, backgroundColor: '#000000' },
} as const satisfies Record<ProfileMode['mode'], ProfileMode>
```

The store's `switchMode` action reads from `MODE_DEFAULTS[newMode]`. The store's `_defaultProfile` seed is built from `MODE_DEFAULTS['full']`. Unit tests for defaults import directly from `modeDefaults.ts`, not from the store.

**Alternative considered:** Inline defaults in the store file. Rejected — duplicates the values and makes them hard to test in isolation; any new mode requires edits in multiple places.

**Rationale:** Mirrors the same separation principle applied to renderers (`light-modes/`) and settings (`mode-settings/`): each concern has one authoritative location.

## Risks / Trade-offs

- **Existing localStorage wiped on v4 bump** → Accepted; no production users. Seeded default profile always ensures the app works.
- **Six renderer + six settings components adds file count** → Trade-off for clean per-mode separation, testability, and exhaustive type checking. Not premature abstraction — each component has distinct rendering logic.
- **`backgroundLightTemperature: 0` is out-of-range** → Mitigated by `lightBrightness: 0` always producing black; the temperature value is never computed visually.
- **`blendWithTemperature` base is hardcoded `#ffffff` for temp modes** → Temperature modes have no color picker by design; white base is the correct light-source assumption.
