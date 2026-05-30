## MODIFIED Requirements

### Requirement: Profile data type
The system SHALL define a `Profile` type as `{ id: string; name: string; light: LightConfig; clock: ClockConfig }`, where `LightConfig` is a discriminated union with discriminant key `mode` covering six modes: `'full'`, `'full-color'`, `'ring'`, `'ring-color'`, `'spot'`, `'spot-color'`. All light-surface fields (e.g., `lightTemperature`, `lightBrightness`, `lightColor`, `innerRadius`, `outerRadius`) live under `profile.light`. Clock fields (`enabled`, `position`, `size`, `format`) live under `profile.clock`. Both `light` and `clock` are required — no optional `?` on either.

#### Scenario: Profile has base fields plus nested light and clock sub-objects
- **WHEN** a profile object is created
- **THEN** it contains `id`, `name`, `light` (with `mode` and all mode-specific fields), and `clock` (with `enabled`, `position`, `size`, `format`)

### Requirement: Default profile on first launch
The system SHALL seed a single profile named `'Default'` with `light: { mode: 'full', lightTemperature: 6500, lightBrightness: 100 }` and `clock: { enabled: true, position: 'bottom-left', size: 'medium', format: 'HH:mm' }` when no prior localStorage state exists.

#### Scenario: First launch seeds default full-mode profile with clock defaults
- **WHEN** the app loads with no prior localStorage state
- **THEN** `profiles` contains exactly one entry named `'Default'` with `light.mode: 'full'`, `light.lightTemperature: 6500`, `light.lightBrightness: 100`, and `clock.enabled: true`

### Requirement: Create new profile
The system SHALL provide a `createProfile` action that duplicates the currently active profile's full `light` and `clock` sub-objects into a new profile with a generated UUID and a user-supplied name.

#### Scenario: New profile clones active light and clock settings
- **WHEN** `createProfile('Warm')` is called while the active profile has `light: { mode: 'ring', lightTemperature: 3200, lightBrightness: 80, innerRadius: 10, outerRadius: 70, backgroundLightTemperature: 0, backgroundLightBrightness: 0 }` and `clock: { enabled: false, position: 'bottom-right', size: 'small', format: 'HH:mm' }`
- **THEN** a new profile named `'Warm'` exists in `profiles` with identical `light` and `clock` values, and `activeProfileId` switches to the new profile's `id`

### Requirement: Switch profile mode
The system SHALL provide a `switchMode(id, newMode)` action that replaces the `light` sub-object of the specified profile with the default `LightConfig` values for `newMode`, preserving `id`, `name`, and `clock`.

#### Scenario: switchMode replaces light sub-object with defaults
- **WHEN** `switchMode(profileId, 'spot-color')` is called on a profile with `light.mode: 'full'`
- **THEN** the profile has `light: { mode: 'spot-color', lightColor: '#ffffff', radius: 40, backgroundColor: '#000000' }` and `clock` is unchanged

#### Scenario: switchMode preserves id, name, and clock
- **WHEN** `switchMode(profileId, 'ring')` is called on a profile named `'Studio'` with `clock.enabled: true`
- **THEN** the profile still has the same `id`, `name: 'Studio'`, and `clock.enabled: true`
