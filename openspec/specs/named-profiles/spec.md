# Named Profiles

## Purpose

Defines the named profiles system — allowing users to create, manage, and switch between multiple named lighting configurations, each with its own set of settings.

## Requirements

### Requirement: Profile data type
The system SHALL define a `Profile` type as `{ id: string; name: string } & ProfileMode`, where `ProfileMode` is a discriminated union with discriminant key `mode` covering six modes: `'full'`, `'full-color'`, `'ring'`, `'ring-color'`, `'spot'`, `'spot-color'`. The flat fields `lightColor`, `brightness`, `colorTemperature`, `ringFormat`, `innerRadius`, and `outerRadius` no longer exist at the top level of `Profile`.

#### Scenario: Profile has base fields plus mode-specific fields
- **WHEN** a profile object is created
- **THEN** it contains `id`, `name`, and `mode`, plus the fields specific to that mode as defined in `profile-modes`

### Requirement: Active profile tracking
The Zustand store SHALL maintain an `activeProfileId` string that always matches the `id` of an entry in `profiles`.

#### Scenario: activeProfileId is always valid
- **WHEN** `activeProfileId` is read from the store
- **THEN** there exists a profile in `profiles` whose `id` equals `activeProfileId`

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

### Requirement: Rename profile
The system SHALL provide a `renameProfile(id, newName)` action that updates the `name` of the specified profile.

#### Scenario: Profile name updates in store
- **WHEN** `renameProfile(existingId, "Studio")` is called
- **THEN** the profile with `id === existingId` has `name === "Studio"`

### Requirement: Delete profile
The system SHALL provide a `deleteProfile(id)` action that removes the specified profile from `profiles`. If the deleted profile was active, the store SHALL activate the nearest remaining profile (previous index, or index 0 if first).

#### Scenario: Non-active profile is removed
- **WHEN** a non-active profile is deleted
- **THEN** it no longer appears in `profiles` and `activeProfileId` is unchanged

#### Scenario: Active profile deletion switches to another
- **WHEN** the active profile is deleted and other profiles exist
- **THEN** `activeProfileId` changes to another valid profile `id`

#### Scenario: Only profile cannot be deleted
- **WHEN** `deleteProfile` is called with the `id` of the only remaining profile
- **THEN** `profiles` still contains that profile (action is a no-op)

### Requirement: Switch active profile
The system SHALL provide a `setActiveProfile(id)` action that sets `activeProfileId` to the given `id`.

#### Scenario: Active profile switches
- **WHEN** `setActiveProfile(otherId)` is called with the id of an existing profile
- **THEN** `activeProfileId` equals `otherId`

### Requirement: Switch profile mode
The system SHALL provide a `switchMode(id, newMode)` action that replaces the mode-specific fields of the specified profile with the default values for `newMode`, preserving `id` and `name`. The `mode` discriminant is updated to `newMode`.

#### Scenario: switchMode replaces mode fields with defaults
- **WHEN** `switchMode(profileId, 'spot-color')` is called on a profile with `mode: 'full'`
- **THEN** the profile has `mode: 'spot-color'`, `lightColor: '#ffffff'`, `radius: 40`, `backgroundColor: '#000000'`, and the previous `lightTemperature` and `lightBrightness` fields are gone

#### Scenario: switchMode preserves id and name
- **WHEN** `switchMode(profileId, 'ring')` is called on a profile named `'Studio'`
- **THEN** the profile still has the same `id` and `name: 'Studio'`
