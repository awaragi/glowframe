## ADDED Requirements

### Requirement: Export all presets as a versioned backup file
The system SHALL let the user export the full preset library as a JSON backup file. The backup payload SHALL contain a top-level `version` field and an ordered `profiles` array. Each serialized profile SHALL include its transferable preset fields and clock configuration, SHALL exclude `id`, and SHALL preserve the current library order.

#### Scenario: Export downloads all presets with clock configuration
- **WHEN** the user triggers backup export from the settings flow
- **THEN** the system downloads a JSON file containing `{ version, profiles }` with every preset in current order, each including `clock` and excluding `id`

### Requirement: Restore replaces the full preset library
The system SHALL let the user restore a backup file by replacing the current preset library with the backup payload's `profiles` array. During restore, the system SHALL validate the full payload before mutation, regenerate a new local `id` for every restored preset, and set the active preset to the first restored preset. The backup payload SHALL NOT contain or restore `activeProfileId`.

#### Scenario: Valid restore replaces existing presets
- **WHEN** the user confirms restore with a valid backup file containing multiple presets
- **THEN** the existing preset library is replaced with the restored presets in file order, each restored preset receives a new generated `id`, and the first restored preset becomes active

### Requirement: Invalid backup files do not mutate presets
The system SHALL reject malformed, tampered, or unsupported backup files. If validation fails, the current preset library SHALL remain unchanged and the user SHALL receive an error indication.

#### Scenario: Invalid backup is rejected without replacement
- **WHEN** the user selects a backup file whose JSON payload is malformed or fails schema validation
- **THEN** no presets are added, removed, or replaced and the system reports the restore failure
