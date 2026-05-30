## Context

`Profile` is currently defined as `{ id: string; name: string; clock?: ClockConfig } & ProfileMode`, where `ProfileMode` is spread flat onto the top level. This mixes identity fields, light settings, and clock settings at the same level. The `clock` optionality (`?`) forces `?? CLOCK_DEFAULTS` fallbacks at every write site. The refactor nests these into explicit `light: LightConfig` and `clock: ClockConfig` sub-objects — both required.

## Goals / Non-Goals

**Goals:**
- Define `LightConfig` as the renamed `ProfileMode` discriminated union, nested under `profile.light`
- Make `clock: ClockConfig` required on `Profile` (no optional `?`, no fallbacks)
- Bump store schema version to 5 with no migration (old localStorage discarded)
- Update all consumers (components, hooks, serialization) from `profile.X` → `profile.light.X`

**Non-Goals:**
- No behavior change of any kind — this is purely structural
- No migration of existing localStorage data
- No new UI, no new capabilities

## Decisions

### Decision 1 — `LightConfig` = renamed `ProfileMode`

`LightConfig` is a type alias for the existing six-way discriminated union (`FullProfile | FullColorProfile | RingProfile | RingColorProfile | SpotProfile | SpotColorProfile`). The union shape is unchanged; only the alias name changes. `modeDefaults.ts` exports `LightConfig` (replacing `ProfileMode`), and `MODE_DEFAULTS` values are typed as `LightConfig`.

**Rationale:** Minimum viable rename — no structural changes to the union itself, all type-narrowing at `profile.light.mode` instead of `profile.mode`.

### Decision 2 — `ClockConfig` required on `Profile`

`clock` changes from `clock?: ClockConfig` to `clock: ClockConfig`. All `?? CLOCK_DEFAULTS` fallbacks in `createProfile`, `deleteProfile`, `switchMode`, and `restoreProfiles` are removed. The `_defaultProfile` constant always includes `clock: { ...CLOCK_DEFAULTS }`.

### Decision 3 — `updateProfile` split into `updateLight` + `updateClock`

The combined `updateProfile(id, patch: AllModeFields)` action is replaced by:
- `updateLight(id, patch: AllLightFields)` — patches `profile.light` fields; `AllLightFields` is the same flat-partial-of-all-modes pattern as the old `AllModeFields`, scoped to light fields only
- `updateClock(id, patch: Partial<ClockConfig>)` — patches `profile.clock` fields

**Rationale:** Clean separation matches the new schema shape. All six mode-settings components currently call `updateProfile` with light fields → they call `updateLight`. Clock settings in the settings modal call `updateProfile` with `{ clock: ... }` → they call `updateClock`.

### Decision 4 — No migration; version → 5

The store `version` in `persist` options bumps from 4 to 5. No `migrate` function is added. Any persisted state with an older version (including the existing v1→v2 migrate function) is dropped — Zustand discards unrecognised versions and initialises from `_defaultProfile`.

**Rationale:** No user data is worth migrating (the app is young, the user population is small). Migration complexity is not justified.

### Decision 5 — `sharedProfileSchema` restructured (share + backup)

The Zod schema in `profileShare.ts` changes from a top-level discriminated union (by `mode`) to a flat object with `light` as the discriminated union:

```ts
// Before: top-level discriminated union
z.discriminatedUnion('mode', [fullSchema, fullColorSchema, ...])

// After: flat object, light contains the discriminated union
z.object({
  name: nameField,
  light: z.discriminatedUnion('mode', [lightFullSchema, lightFullColorSchema, ...]),
  clock: clockConfigSchema,
})
```

Old shared URLs and backup files from before F-250 are invalid under the new schema and will fail Zod validation — treated as malformed inputs (error toast for share, error feedback for backup). No backward compatibility shim.

## Risks / Trade-offs

- **Wide consumer churn** → Mitigation: the change is purely `profile.X → profile.light.X`; TypeScript type errors will catch every missed callsite.
- **Old shared URLs break** → Mitigation: acceptable; the app is in early development with a small user base. No workaround offered.
- **Old backup files rejected** → Mitigation: same rationale. Users are advised to re-export after upgrading.
