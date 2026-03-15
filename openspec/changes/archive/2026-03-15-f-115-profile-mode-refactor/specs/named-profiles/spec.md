## MODIFIED Requirements

### Requirement: Profile data type
The system SHALL define a `Profile` type as `{ id: string; name: string } & ProfileMode`, where `ProfileMode` is a discriminated union with discriminant key `mode` covering six modes: `'full'`, `'full-color'`, `'ring'`, `'ring-color'`, `'spot'`, `'spot-color'`. The flat fields `lightColor`, `brightness`, `colorTemperature`, `ringFormat`, `innerRadius`, and `outerRadius` no longer exist at the top level of `Profile`.

#### Scenario: Profile has base fields plus mode-specific fields
- **WHEN** a profile object is created
- **THEN** it contains `id`, `name`, and `mode`, plus the fields specific to that mode as defined in `profile-modes`

### Requirement: Default profile on first launch
The system SHALL seed a single profile named `'Default'` with `mode: 'full'`, `lightTemperature: 6500`, and `lightBrightness: 100` when no prior localStorage state exists.

#### Scenario: First launch seeds default full-mode profile
- **WHEN** the app loads with no prior localStorage state
- **THEN** `profiles` contains exactly one entry named `'Default'` with `mode: 'full'`, `lightTemperature: 6500`, and `lightBrightness: 100`

### Requirement: Create new profile
The system SHALL provide a `createProfile` action that duplicates the currently active profile's full state (including its `mode` and all mode-specific fields) into a new profile with a generated UUID and a user-supplied name.

#### Scenario: New profile clones active mode and settings
- **WHEN** `createProfile('Warm')` is called while the active profile has `mode: 'ring'`, `lightTemperature: 3200`, `lightBrightness: 80`, `innerRadius: 10`, `outerRadius: 70`, `backgroundLightTemperature: 0`, `backgroundLightBrightness: 0`
- **THEN** a new profile named `'Warm'` exists in `profiles` with the identical mode and field values, and `activeProfileId` switches to the new profile's `id`

## ADDED Requirements

### Requirement: Switch profile mode
The system SHALL provide a `switchMode(id, newMode)` action that replaces the mode-specific fields of the specified profile with the default values for `newMode`, preserving `id` and `name`. The `mode` discriminant is updated to `newMode`.

#### Scenario: switchMode replaces mode fields with defaults
- **WHEN** `switchMode(profileId, 'spot-color')` is called on a profile with `mode: 'full'`
- **THEN** the profile has `mode: 'spot-color'`, `lightColor: '#ffffff'`, `radius: 40`, `backgroundColor: '#000000'`, and the previous `lightTemperature` and `lightBrightness` fields are gone

#### Scenario: switchMode preserves id and name
- **WHEN** `switchMode(profileId, 'ring')` is called on a profile named `'Studio'`
- **THEN** the profile still has the same `id` and `name: 'Studio'`
