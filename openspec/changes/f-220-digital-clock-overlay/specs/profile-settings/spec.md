## ADDED Requirements

### Requirement: Clock fields on the Profile type
The `Profile` type SHALL include four clock configuration fields shared across all light modes:

| Field | Type | Default |
|---|---|---|
| `clockEnabled` | `boolean` | `false` |
| `clockPosition` | `'top-left' \| 'bottom-left' \| 'bottom-right'` | `'bottom-right'` |
| `clockSize` | `'small' \| 'medium' \| 'large'` | `'medium'` |
| `clockFormat` | `'HH:mm' \| 'HH:mm:ss' \| 'hh:mm a' \| 'hh:mm:ss a'` | `'HH:mm'` |

These fields SHALL be present on every newly created profile with their default values. `top-right` is NOT a valid `clockPosition` value.

#### Scenario: New profile includes clock defaults
- **WHEN** `createProfile('My Light')` is called
- **THEN** the new profile has `clockEnabled: false`, `clockPosition: 'bottom-right'`, `clockSize: 'medium'`, and `clockFormat: 'HH:mm'`

#### Scenario: Default profile includes clock defaults
- **WHEN** the app initialises with no stored state
- **THEN** the default profile has `clockEnabled: false`, `clockPosition: 'bottom-right'`, `clockSize: 'medium'`, and `clockFormat: 'HH:mm'`

### Requirement: Clock fields updated via updateProfile
The existing `updateProfile(id, patch)` action SHALL accept patches containing any combination of `clockEnabled`, `clockPosition`, `clockSize`, and `clockFormat`. Changes SHALL be reflected immediately in the store and persisted to `localStorage`.

#### Scenario: clockEnabled update applies live
- **WHEN** `updateProfile(activeId, { clockEnabled: true })` is called
- **THEN** the active profile's `clockEnabled` is `true` without a page reload

#### Scenario: clockFormat update applies live
- **WHEN** `updateProfile(activeId, { clockFormat: 'HH:mm:ss' })` is called
- **THEN** the active profile's `clockFormat` is `'HH:mm:ss'`

#### Scenario: clockPosition update applies live
- **WHEN** `updateProfile(activeId, { clockPosition: 'top-left' })` is called
- **THEN** the active profile's `clockPosition` is `'top-left'`
