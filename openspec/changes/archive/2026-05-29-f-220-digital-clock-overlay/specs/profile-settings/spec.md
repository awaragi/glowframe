## ADDED Requirements

### Requirement: Clock object on the Profile type
The `Profile` type SHALL include a `clock` object shared across all light modes with the following shape:

| Field | Type | Default |
|---|---|---|
| `clock.enabled` | `boolean` | `false` |
| `clock.position` | `'top-left' \| 'bottom-left' \| 'bottom-right'` | `'bottom-right'` |
| `clock.size` | `'small' \| 'medium' \| 'large'` | `'medium'` |
| `clock.format` | `'HH:mm' \| 'HH:mm:ss' \| 'hh:mm a' \| 'hh:mm:ss a'` | `'HH:mm'` |

The `clock` object SHALL be present on every newly created profile with its default values. `top-right` is NOT a valid `clock.position` value.

#### Scenario: New profile includes clock defaults
- **WHEN** `createProfile('My Light')` is called
- **THEN** the new profile has `clock: { enabled: false, position: 'bottom-right', size: 'medium', format: 'HH:mm' }`

#### Scenario: Default profile includes clock defaults
- **WHEN** the app initialises with no stored state
- **THEN** the default profile has `clock: { enabled: false, position: 'bottom-right', size: 'medium', format: 'HH:mm' }`

### Requirement: Clock object updated via updateProfile
The existing `updateProfile(id, patch)` action SHALL accept a patch containing a partial `clock` object (e.g. `{ clock: { enabled: true } }`). The patch SHALL be merged with the existing `clock` object so only the specified sub-fields are changed. Changes SHALL be reflected immediately in the store and persisted to `localStorage`.

#### Scenario: clock.enabled update applies live
- **WHEN** `updateProfile(activeId, { clock: { enabled: true } })` is called
- **THEN** the active profile's `clock.enabled` is `true` without a page reload

#### Scenario: clock.format update applies live
- **WHEN** `updateProfile(activeId, { clock: { format: 'HH:mm:ss' } })` is called
- **THEN** the active profile's `clock.format` is `'HH:mm:ss'`

#### Scenario: clock.position update applies live
- **WHEN** `updateProfile(activeId, { clock: { position: 'top-left' } })` is called
- **THEN** the active profile's `clock.position` is `'top-left'`
