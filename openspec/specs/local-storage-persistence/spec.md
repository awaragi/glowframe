## Purpose

Defines local storage persistence requirements — ensuring user settings survive page reloads and browser restarts via Zustand's `persist` middleware, with an explicit schema version and partialised field list.

## Requirements

### Requirement: Settings persisted to localStorage
The Zustand store SHALL persist `lightColor` and `brightness` to `localStorage` under the key `glowframe-store`, restoring them on the next page load.

#### Scenario: Settings survive page reload
- **WHEN** the user sets `lightColor` to `"#ff8800"` and `brightness` to `75`, then reloads the page
- **THEN** `lightColor` is `"#ff8800"` and `brightness` is `75` after reload

### Requirement: Only data fields are persisted (no actions)
The persisted `localStorage` value SHALL contain only serialisable state fields (`lightColor`, `brightness`, `_version`) and SHALL NOT contain action functions.

#### Scenario: No functions in stored JSON
- **WHEN** the store is initialised and state is written to localStorage
- **THEN** the stored JSON object contains no function-valued keys

### Requirement: Schema version tracked in persist options
The `persist` middleware SHALL use `version: 1` as its baseline schema version identifier.

#### Scenario: Version field present in persisted data
- **WHEN** the store writes to localStorage
- **THEN** the stored object includes a version key matching the configured schema version
