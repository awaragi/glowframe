## Context

The Zustand `persist` middleware is already configured in `src/store/index.ts` with key `glowframe-store`. There are no existing users so no backward compatibility is required. This change simply formalises the persist configuration as v1: explicitly listing which fields are stored and adding a version marker.

## Goals / Non-Goals

**Goals:**
- Explicitly define which state fields are persisted via `partialize` (data only, no functions).
- Add `version: 1` to the persist options to establish a baseline for future changes.
- Verify persistence with unit tests.

**Non-Goals:**
- Migration or backward-compatibility logic — not needed, no existing users.
- Persisting profile list or active profile ID (those are F-100/F-110 scope).
- Encrypting or obfuscating stored data.
- Cloud or cross-device sync.

## Decisions

### `partialize` to exclude actions

**Decision:** Add `partialize: (state) => ({ lightColor: state.lightColor, brightness: state.brightness, _version: state._version })` to explicitly list persisted fields.

**Rationale:** Without `partialize`, Zustand serialises all enumerable keys including functions (they stringify to `undefined` but pollute the stored object). Explicit `partialize` is the correct Zustand pattern and makes the persisted schema self-documenting.

### `version: 1` as the baseline, no `migrate`

**Decision:** Set `version: 1` in Zustand persist options. No `migrate` function is added.

**Rationale:** There are no existing users and no stale data to handle. Adding a `migrate` function now would be premature. Future schema changes can add migration logic at that point.

## Risks / Trade-offs

- [No migration means future version bumps will silently drop any cached data] → Acceptable; a `migrate` function can be added when the first schema-breaking change occurs.

## Open Questions

<!-- none -->
