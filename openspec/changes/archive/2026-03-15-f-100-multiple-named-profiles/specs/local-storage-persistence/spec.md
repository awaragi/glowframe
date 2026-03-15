## MODIFIED Requirements

### Requirement: Settings persisted to localStorage
The Zustand store SHALL persist `profiles`, `activeProfileId`, and `_version` to `localStorage` under the key `glowframe-store`, restoring them on the next page load.

#### Scenario: Profiles survive page reload
- **WHEN** the user creates a profile named "Warm" and reloads the page
- **THEN** `profiles` still contains "Warm" and `activeProfileId` is restored correctly

### Requirement: Only data fields are persisted (no actions)
The persisted `localStorage` value SHALL contain only serialisable state fields (`profiles`, `activeProfileId`, `_version`) and SHALL NOT contain action functions.

#### Scenario: No functions in stored JSON
- **WHEN** the store is initialised and state is written to localStorage
- **THEN** the stored JSON object contains no function-valued keys

### Requirement: Schema version tracked in persist options
The `persist` middleware SHALL use `version: 2` as its baseline schema version identifier, and SHALL provide a `migrate` function that upgrades v1 data (flat `lightColor`/`brightness`) to v2 format (single "Default" profile wrapping those values).

#### Scenario: Version field present in persisted data
- **WHEN** the store writes to localStorage
- **THEN** the stored object includes a version key equal to `2`

#### Scenario: v1 data migrated to v2 on load
- **WHEN** the store loads with v1 localStorage data containing `lightColor: "#ffcc00"` and `brightness: 60`
- **THEN** `profiles` contains one profile named "Default" with `lightColor: "#ffcc00"` and `brightness: 60`
