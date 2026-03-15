# Profile Modes

## Purpose

Defines the discriminated-union `ProfileMode` type and its six mode variants — `full`, `full-color`, `ring`, `ring-color`, `spot`, and `spot-color` — along with the canonical default field values for each mode and the destructive `switchMode` store action.

## Requirements

### Requirement: Profile type is a discriminated union on mode
The system SHALL define `Profile` as `{ id: string; name: string } & ProfileMode` where `ProfileMode` is a discriminated union with discriminant key `mode`.

#### Scenario: Profile type narrows on mode
- **WHEN** code inspects `profile.mode`
- **THEN** TypeScript narrows the type and only mode-specific fields are accessible without a cast

### Requirement: full mode fields
A profile with `mode: 'full'` SHALL contain `lightTemperature` (integer 1000–10000, Kelvin) and `lightBrightness` (integer 0–100, percentage) and no other mode-specific fields.

#### Scenario: full mode profile shape
- **WHEN** a profile with `mode: 'full'` is created
- **THEN** it contains `lightTemperature` and `lightBrightness` and does NOT contain `lightColor`, `innerRadius`, `outerRadius`, `radius`, `backgroundColor`, `backgroundLightTemperature`, or `backgroundLightBrightness`

### Requirement: full-color mode fields
A profile with `mode: 'full-color'` SHALL contain `lightColor` (hex string, e.g. `#rrggbb`) and no other mode-specific fields.

#### Scenario: full-color mode profile shape
- **WHEN** a profile with `mode: 'full-color'` is created
- **THEN** it contains `lightColor` and does NOT contain `lightTemperature`, `lightBrightness`, `innerRadius`, `outerRadius`, `radius`, `backgroundColor`, `backgroundLightTemperature`, or `backgroundLightBrightness`

### Requirement: ring mode fields
A profile with `mode: 'ring'` SHALL contain `lightTemperature` (integer 1000–10000), `lightBrightness` (integer 0–100), `innerRadius` (integer 0–100, percentage of `min(100vw, 100vh)`), `outerRadius` (integer 0–100), `backgroundLightTemperature` (integer 0–10000), and `backgroundLightBrightness` (integer 0–100).

#### Scenario: ring mode profile shape
- **WHEN** a profile with `mode: 'ring'` is created
- **THEN** it contains `lightTemperature`, `lightBrightness`, `innerRadius`, `outerRadius`, `backgroundLightTemperature`, and `backgroundLightBrightness`

### Requirement: ring-color mode fields
A profile with `mode: 'ring-color'` SHALL contain `lightColor` (hex string), `innerRadius` (integer 0–100), `outerRadius` (integer 0–100), and `backgroundColor` (hex string).

#### Scenario: ring-color mode profile shape
- **WHEN** a profile with `mode: 'ring-color'` is created
- **THEN** it contains `lightColor`, `innerRadius`, `outerRadius`, and `backgroundColor`

### Requirement: spot mode fields
A profile with `mode: 'spot'` SHALL contain `lightTemperature` (integer 1000–10000), `lightBrightness` (integer 0–100), `radius` (integer 0–100, percentage of `min(100vw, 100vh)`), `backgroundLightTemperature` (integer 0–10000), and `backgroundLightBrightness` (integer 0–100).

#### Scenario: spot mode profile shape
- **WHEN** a profile with `mode: 'spot'` is created
- **THEN** it contains `lightTemperature`, `lightBrightness`, `radius`, `backgroundLightTemperature`, and `backgroundLightBrightness`

### Requirement: spot-color mode fields
A profile with `mode: 'spot-color'` SHALL contain `lightColor` (hex string), `radius` (integer 0–100), and `backgroundColor` (hex string).

#### Scenario: spot-color mode profile shape
- **WHEN** a profile with `mode: 'spot-color'` is created
- **THEN** it contains `lightColor`, `radius`, and `backgroundColor`

### Requirement: Default values per mode
Each mode SHALL have a canonical set of default field values used when a profile is created with that mode or switches into that mode.

#### Scenario: full mode defaults
- **WHEN** a profile is initialised with `mode: 'full'`
- **THEN** `lightTemperature` is `6500` and `lightBrightness` is `100`

#### Scenario: full-color mode defaults
- **WHEN** a profile is initialised with `mode: 'full-color'`
- **THEN** `lightColor` is `'#ffffff'`

#### Scenario: ring mode defaults
- **WHEN** a profile is initialised with `mode: 'ring'`
- **THEN** `lightTemperature` is `6500`, `lightBrightness` is `100`, `innerRadius` is `20`, `outerRadius` is `80`, `backgroundLightTemperature` is `0`, and `backgroundLightBrightness` is `0`

#### Scenario: ring-color mode defaults
- **WHEN** a profile is initialised with `mode: 'ring-color'`
- **THEN** `lightColor` is `'#ffffff'`, `innerRadius` is `20`, `outerRadius` is `80`, and `backgroundColor` is `'#000000'`

#### Scenario: spot mode defaults
- **WHEN** a profile is initialised with `mode: 'spot'`
- **THEN** `lightTemperature` is `6500`, `lightBrightness` is `100`, `radius` is `40`, `backgroundLightTemperature` is `0`, and `backgroundLightBrightness` is `0`

#### Scenario: spot-color mode defaults
- **WHEN** a profile is initialised with `mode: 'spot-color'`
- **THEN** `lightColor` is `'#ffffff'`, `radius` is `40`, and `backgroundColor` is `'#000000'`

### Requirement: Destructive mode switching
The system SHALL provide a `switchMode(id, newMode)` store action that replaces all mode-specific fields of the specified profile with the defaults for `newMode`, preserving only `id` and `name`.

#### Scenario: Switching mode replaces mode-specific fields
- **WHEN** `switchMode(profileId, 'ring')` is called on a profile that has `mode: 'full'`
- **THEN** the profile has `mode: 'ring'` with ring defaults, and the previous `lightTemperature` and `lightBrightness` values from `full` mode are no longer present on the profile

#### Scenario: id and name preserved on mode switch
- **WHEN** `switchMode(profileId, 'spot-color')` is called
- **THEN** the profile retains its original `id` and `name`

### Requirement: Store version 4
The Zustand persist store SHALL use `version: 4`. No migration function is registered; persisted state from any prior version is abandoned and the store re-seeds to defaults on load.

#### Scenario: Version 4 in persisted state
- **WHEN** the store is initialised with no prior localStorage state
- **THEN** the persisted `_version` field is `4`
