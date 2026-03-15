## Context

GlowFrame's Zustand store currently holds a single flat set of light settings (`lightColor`, `brightness`). All components read these values directly. There is no concept of profiles — every change overwrites the single global setting.

F-100 introduces a `Profile` type and a profiles array into the store, making the current active profile the source of truth for all rendering decisions. This is a data-model change that touches the store, all consumers that read `lightColor`/`brightness`, and the localStorage persistence schema.

## Goals / Non-Goals

**Goals:**
- Define the `Profile` TypeScript type (id, name, lightColor, brightness, and the additional fields introduced by F-110).
- Extend the Zustand store with `profiles`, `activeProfileId`, and profile management actions.
- Ensure a default "Default" profile is seeded when no prior localStorage state exists.
- Migrate stored v1 data to v2: wrap existing `lightColor`/`brightness` into a single default profile.
- Persist `profiles` and `activeProfileId` to `localStorage`; bump schema version to `2`.
- Update all existing store consumers to read from the active profile.

**Non-Goals:**
- UI for profile management (F-120).
- The extra profile fields introduced by F-110 (`colorTemperature`, `ringFormat`, `innerRadius`, `outerRadius`) — F-110 extends the `Profile` type; F-100 only needs to hold `lightColor` and `brightness`.
- Profile sharing via URL (F-140).

## Decisions

### D-1: Profile shape (F-100 scope only)
The `Profile` type for F-100 holds only the fields already present in the store (`lightColor`, `brightness`) plus `id` (UUID string) and `name`. F-110 will extend this type. Keeping the type minimal avoids pre-empting F-110 design decisions.

```ts
interface Profile {
  id: string       // crypto.randomUUID()
  name: string     // max 64 chars
  lightColor: string
  brightness: number
}
```

### D-2: Store shape
Two top-level fields are added:
```ts
profiles: Profile[]        // ordered list; at least one always present
activeProfileId: string    // UUID matching an entry in profiles
```
Existing flat `lightColor`/`brightness` are removed. Consumers derive the active values via a selector.

### D-3: Active profile deletion fallback
When the active profile is deleted the store switches to the profile at the previous index, or index 0 if the deleted profile was first. This preference keeps the user's context stable.

### D-4: localStorage migration (v1 → v2)
The `migrate` function in Zustand persist wraps the existing v1 flat state into a single profile named "Default", generating a new UUID. This ensures no data loss on upgrade.

### D-5: UUID generation
Use `crypto.randomUUID()` — available in all modern browsers and in the Node test environment (>=18). No extra dependency needed.

### D-6: Partialised persistence
Only `profiles`, `activeProfileId`, and `_version` are saved; action functions are excluded as before.

## Risks / Trade-offs

- **Breaking existing localStorage** → Mitigated by the v1→v2 `migrate` function; old data is mapped, not discarded.
- **Consumers must update to active-profile selector** → Any consumer reading `lightColor`/`brightness` directly from the store will break; fixed by updating `LightSurface` and `ConfigPage` as part of this change.
- **Minimum one profile invariant** → Enforced in the `deleteProfile` action; the action is a no-op when only one profile remains.
