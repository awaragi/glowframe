# Profile Settings

## Purpose

Defines the extended profile settings capabilities — adding color temperature, ring format, and radius fields to the Profile type, along with their rendering behaviours and live-update action.

## Requirements

### Requirement: Live profile field update action
The Zustand store SHALL provide an `updateProfile(id, patch)` action that merges a partial set of mode-specific fields (excluding `id`, `name`, and `mode`) into the matching profile entry immediately. Changing the `mode` discriminant is NOT permitted via `updateProfile`; use `switchMode` instead.

#### Scenario: lightTemperature update applies live
- **WHEN** `updateProfile(activeId, { lightTemperature: 3200 })` is called on a temperature-based mode profile
- **THEN** the active profile's `lightTemperature` is `3200` without a page reload

#### Scenario: lightColor update applies live
- **WHEN** `updateProfile(activeId, { lightColor: '#ff8800' })` is called on a color-based mode profile
- **THEN** the active profile's `lightColor` is `'#ff8800'`

#### Scenario: radius update applies live
- **WHEN** `updateProfile(activeId, { radius: 30 })` is called on a spot or spot-color profile
- **THEN** the active profile's `radius` is `30`

### Requirement: Mode selector in settings UI
The settings panel SHALL display a mode selector that shows the active profile's current `mode` and allows the user to switch to any of the six modes. Selecting a new mode triggers `switchMode` and is destructive.

#### Scenario: Mode selector shows current mode
- **WHEN** the settings panel is open and the active profile has `mode: 'ring'`
- **THEN** the mode selector displays `ring` as the selected value

#### Scenario: Switching mode via selector updates profile mode
- **WHEN** the user selects `spot-color` in the mode selector
- **THEN** `switchMode(activeProfileId, 'spot-color')` is called and the settings panel updates to show spot-color fields

### Requirement: Mode-scoped settings sections
The settings panel SHALL render only the fields relevant to the active profile's `mode`. When the mode changes, the displayed fields update accordingly. When `mode` is `ring` or `ring-color`, the `innerRadius` and `outerRadius` sliders SHALL be rendered together as a group. Below the radius slider group, an inline validation error message SHALL be displayed when `innerRadius >= outerRadius`. The error message text SHALL be `"Inner radius must be less than outer radius."` and SHALL be visually associated with the slider group.

#### Scenario: full mode shows temperature and brightness controls only
- **WHEN** active profile has `mode: 'full'`
- **THEN** the settings panel shows `lightTemperature` and `lightBrightness` sliders and does NOT show `lightColor`, radius, or background controls

#### Scenario: full-color mode shows color picker only
- **WHEN** active profile has `mode: 'full-color'`
- **THEN** the settings panel shows the `lightColor` picker and does NOT show temperature, brightness, or background controls

#### Scenario: ring mode shows all ring fields
- **WHEN** active profile has `mode: 'ring'`
- **THEN** the settings panel shows `lightTemperature`, `lightBrightness`, `innerRadius`, `outerRadius`, `backgroundLightTemperature`, and `backgroundLightBrightness` controls

#### Scenario: ring-color mode shows ring-color fields
- **WHEN** active profile has `mode: 'ring-color'`
- **THEN** the settings panel shows `lightColor`, `innerRadius`, `outerRadius`, and `backgroundColor` controls

#### Scenario: spot mode shows all spot fields
- **WHEN** active profile has `mode: 'spot'`
- **THEN** the settings panel shows `lightTemperature`, `lightBrightness`, `radius`, `backgroundLightTemperature`, and `backgroundLightBrightness` controls

#### Scenario: spot-color mode shows spot-color fields
- **WHEN** active profile has `mode: 'spot-color'`
- **THEN** the settings panel shows `lightColor`, `radius`, and `backgroundColor` controls

#### Scenario: Radius cross-validation error appears when inner meets outer
- **WHEN** `mode` is `ring` or `ring-color` and the user sets `innerRadius` equal to `outerRadius`
- **THEN** an inline error message reading `"Inner radius must be less than outer radius."` is displayed below the radius sliders

#### Scenario: Radius cross-validation error clears when constraint is satisfied
- **WHEN** the user corrects the radii so that `innerRadius` is strictly less than `outerRadius`
- **THEN** the inline error message disappears

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
