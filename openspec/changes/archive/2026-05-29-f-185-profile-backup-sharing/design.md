## Context

GlowFrame persists a profile library in a Zustand store keyed by `profiles` and `activeProfileId`. Each profile already carries per-profile clock settings, but the existing share-link contract serializes only the light preset fields for one profile and there is no bulk backup or restore path.

F-185 adds two transfer surfaces with different semantics:

1. **Share link**: transfer one preset through `?profile=` and import it as a new preset.
2. **Backup file**: transfer the full preset library through a downloaded JSON file and restore it by replacing the current library.

The change must preserve the current product rules already agreed in exploration:

- restored libraries replace all existing presets
- serialized profile IDs are never preserved
- backup files do not persist `activeProfileId`
- the first restored preset becomes active
- clock configuration is included in both share-link and backup payloads

## Goals / Non-Goals

**Goals:**
- Define a single transferable preset shape that includes clock configuration and excludes runtime-only identifiers.
- Define a versioned backup file contract for exporting and restoring all presets.
- Keep share-link imports and backup restores behaviorally distinct while reusing validation rules.
- Make restore atomic so invalid backups do not partially replace the current preset library.

**Non-Goals:**
- Sync presets between devices or accounts.
- Preserve profile IDs across transfer operations.
- Preserve active-profile selection across backup export/import.
- Introduce partial merge behavior for backup restore.

## Decisions

### Decision: Use a canonical transferable preset schema for both share and backup

The change will define a canonical transferable preset payload equal to the current profile data minus `id`, with `clock` included as a required validated object. Share links will serialize one transferable preset. Backup files will serialize an array of the same transferable preset shape.

**Why:** This keeps one validation contract for transferable data while still allowing different transport containers.

**Alternatives considered:**
- **Separate share and backup preset schemas**: rejected because they would duplicate the same mode and clock validation logic.
- **Serialize the raw persisted `Profile` shape**: rejected because it would leak runtime IDs and make restore semantics harder to control.

### Decision: Normalize missing clock data at the transfer boundary

Transferred presets will be treated as complete presets with explicit clock configuration. Existing in-memory or persisted profiles that lack `clock` due to older state will be normalized to clock defaults before export or share generation.

**Why:** The new contract says clock is part of the preset, so transfer payloads should not rely on optional fields or implicit fallback behavior.

**Alternatives considered:**
- **Keep `clock` optional in serialized payloads**: rejected because it weakens the transfer contract and complicates restore/import validation.
- **Migrate localStorage data eagerly before transfer**: not required for this change; boundary normalization is enough.

### Decision: Use a versioned backup container without `activeProfileId`

Backup export will produce a JSON object shaped as `{ version, profiles }`, where `profiles` is an ordered array of transferable presets. The payload will not include `activeProfileId`.

**Why:** A versioned container gives the app a stable upgrade point for future backup changes, while excluding `activeProfileId` matches the chosen restore rule that the first restored preset becomes active.

**Alternatives considered:**
- **Export a bare array**: rejected because it gives no evolution point for future format changes.
- **Include `activeProfileId` and remap it on restore**: rejected because IDs are intentionally regenerated and the product decision is to derive active selection from order.

### Decision: Restore by replacing profiles atomically in the store

Bulk restore will use a dedicated store path that validates the entire backup, regenerates IDs for every restored preset, replaces the `profiles` array in one state update, and sets `activeProfileId` to the first restored preset's generated ID.

**Why:** Replace semantics are destructive, so the update should be atomic and all-or-nothing.

**Alternatives considered:**
- **Loop through the existing single-profile import action**: rejected because it creates intermediate states and does not model destructive replace semantics cleanly.
- **Merge restored presets into the existing array**: rejected because it contradicts the requested behavior.

### Decision: Keep share import and backup restore as separate UX flows

Share links will continue using the existing confirmation dialog for importing one preset as a new profile. Backup restore will use a file-selection flow plus an explicit destructive confirmation before replacing the library.

**Why:** The actions look similar at the data level but are materially different in impact and should not share the same confirmation UX.

**Alternatives considered:**
- **Reuse the single-profile import dialog for backups**: rejected because it does not communicate destructive replace semantics clearly.
- **Make backup restore silent on valid files**: rejected because destructive replacement requires deliberate user action.

## Risks / Trade-offs

- **[Old persisted profiles may have missing `clock`]** → Normalize to `CLOCK_DEFAULTS` before serializing or replacing data.
- **[Backup schema may drift from store profile shape over time]** → Keep the transferable schema centralized and version the backup container.
- **[Restore is destructive and easy to misuse]** → Require explicit confirmation and reject invalid files without mutating state.
- **[Share links become slightly longer by carrying clock fields]** → Accept the modest payload increase because the clock contract is now part of a complete preset.

## Migration Plan

1. Introduce the transferable preset schema with required clock validation.
2. Update share-link encode/decode to use the new transferable shape.
3. Add backup export/import helpers and a store action for atomic replacement restore.
4. Expose backup export and restore controls in the settings flow with confirmation.
5. Add unit and e2e coverage for clock-inclusive sharing and destructive restore.

Rollback is low risk because the feature is client-only; reverting the change restores the prior share contract and removes backup controls. Existing local persisted presets remain local state and do not require server migration.

## Open Questions

No open product questions remain for this change. Future enhancements such as merge restore, cloud sync, or named backup metadata are intentionally deferred.
