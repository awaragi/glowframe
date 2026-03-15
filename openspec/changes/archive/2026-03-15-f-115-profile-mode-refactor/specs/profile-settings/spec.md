## REMOVED Requirements

### Requirement: Extended Profile type fields
**Reason:** Replaced by the discriminated union `Profile` type in the `profile-modes` capability. Flat fields `colorTemperature`, `ringFormat`, `innerRadius`, `outerRadius` no longer exist on `Profile`.
**Migration:** Use `profile.mode` to narrow and access per-mode fields (e.g., `lightTemperature`, `innerRadius`) as defined in `profile-modes`.

### Requirement: Default values for extended fields
**Reason:** Default values are now per-mode and defined in the `profile-modes` capability.
**Migration:** See `profile-modes` — each mode has its own canonical defaults.

### Requirement: Full ring format rendering
**Reason:** `ringFormat: 'full'` is replaced by `mode: 'full'` and `mode: 'full-color'`; rendering is now defined in `core-light-display`.
**Migration:** See `core-light-display` — full mode renderer requirements.

### Requirement: Circle ring format rendering
**Reason:** `ringFormat: 'circle'` is replaced by `mode: 'ring'` and `mode: 'ring-color'`; rendering is now defined in `core-light-display`.
**Migration:** See `core-light-display` — ring mode renderer requirements.

### Requirement: Border ring format rendering
**Reason:** `ringFormat: 'border'` is removed entirely; the border/frame display shape is not carried forward.
**Migration:** No equivalent mode. Users who relied on border format should use ring mode with narrow radii.

### Requirement: Color temperature tinting
**Reason:** Temperature tinting is now scoped to temperature-based modes (`full`, `ring`, `spot`) and rendered per their respective components; it is no longer a profile-settings-level requirement.
**Migration:** See `core-light-display` — per-mode rendering requirements for `full`, `ring`, and `spot`.

## MODIFIED Requirements

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

## ADDED Requirements

### Requirement: Mode selector in settings UI
The settings panel SHALL display a mode selector that shows the active profile's current `mode` and allows the user to switch to any of the six modes. Selecting a new mode triggers `switchMode` and is destructive.

#### Scenario: Mode selector shows current mode
- **WHEN** the settings panel is open and the active profile has `mode: 'ring'`
- **THEN** the mode selector displays `ring` as the selected value

#### Scenario: Switching mode via selector updates profile mode
- **WHEN** the user selects `spot-color` in the mode selector
- **THEN** `switchMode(activeProfileId, 'spot-color')` is called and the settings panel updates to show spot-color fields

### Requirement: Mode-scoped settings sections
The settings panel SHALL render only the fields relevant to the active profile's `mode`. When the mode changes, the displayed fields update accordingly.

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
