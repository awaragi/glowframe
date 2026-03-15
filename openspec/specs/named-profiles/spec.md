# Named Profiles

## Purpose

Defines the named profiles system — allowing users to create, manage, and switch between multiple named lighting configurations, each with its own set of settings.

## Requirements

### Requirement: Profile data type
The system SHALL define a `Profile` type with fields: `id` (UUID string), `name` (string, max 64 characters), `lightColor` (hex string), `brightness` (integer 0–100), `colorTemperature` (integer 1000–10000), `ringFormat` (`"full" | "circle" | "border"`), `innerRadius` (integer 0–100), and `outerRadius` (integer 0–100).

#### Scenario: Profile has all required fields
- **WHEN** a profile object is created
- **THEN** it contains `id`, `name`, `lightColor`, `brightness`, `colorTemperature`, `ringFormat`, `innerRadius`, and `outerRadius` with the correct types

### Requirement: Profiles array in store
The Zustand store SHALL maintain a `profiles` array containing at least one `Profile` object at all times.

#### Scenario: Store always has at least one profile
- **WHEN** the store is inspected at any point
- **THEN** `profiles` contains one or more entries and never an empty array

### Requirement: Active profile tracking
The Zustand store SHALL maintain an `activeProfileId` string that always matches the `id` of an entry in `profiles`.

#### Scenario: activeProfileId is always valid
- **WHEN** `activeProfileId` is read from the store
- **THEN** there exists a profile in `profiles` whose `id` equals `activeProfileId`

### Requirement: Default profile on first launch
The system SHALL seed a single profile named "Default" with `lightColor: "#ffffff"`, `brightness: 100`, `colorTemperature: 6500`, `ringFormat: "full"`, `innerRadius: 0`, and `outerRadius: 100` when no prior localStorage state exists.

#### Scenario: First launch seeds default profile with all fields
- **WHEN** the app loads with no prior localStorage state
- **THEN** `profiles` contains exactly one entry named "Default" and all extended fields are initialised to their defaults

### Requirement: Create new profile
The system SHALL provide a `createProfile` action that duplicates the currently active profile's settings into a new profile with a generated UUID and a user-supplied name.

#### Scenario: New profile clones active settings
- **WHEN** `createProfile("Warm")` is called while the active profile has `lightColor: "#ff8800"` and `brightness: 80`
- **THEN** a new profile named "Warm" exists in `profiles` with `lightColor: "#ff8800"` and `brightness: 80`, and `activeProfileId` switches to the new profile's `id`

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
