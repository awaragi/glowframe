## MODIFIED Requirements

### Requirement: Export all presets as a versioned backup file
The system SHALL let the user export the full preset library as a JSON backup file. The backup payload SHALL contain a top-level `version` field and an ordered `profiles` array. Each serialized profile SHALL include `name`, `light` (the full `LightConfig` sub-object), and `clock` (the full `ClockConfig` sub-object), SHALL exclude `id`, and SHALL preserve the current library order.

#### Scenario: Export downloads all presets with nested light and clock
- **WHEN** the user triggers backup export from the settings flow
- **THEN** the system downloads a JSON file containing `{ version, profiles }` with every preset in current order, each including `name`, `light`, and `clock`, and excluding `id`

### Requirement: Restore replaces the full preset library
The system SHALL let the user restore a backup file by replacing the current preset library with the backup payload's `profiles` array. During restore, the system SHALL validate the full payload (including the new nested `light`/`clock` shape) before mutation, regenerate a new local `id` for every restored preset, and set the active preset to the first restored preset. Backup files exported before F-250 (with the old flat profile shape) SHALL fail validation and be treated as malformed input.

#### Scenario: Valid restore replaces existing presets
- **WHEN** the user confirms restore with a valid backup file containing profiles in the new nested shape
- **THEN** the existing preset library is replaced with the restored presets in file order, each receives a new generated `id`, and the first restored preset becomes active

#### Scenario: Pre-F-250 backup file is rejected
- **WHEN** the user selects a backup file exported before F-250 (flat profile shape, no `light` sub-object)
- **THEN** no presets are added, removed, or replaced and the system reports the restore failure
