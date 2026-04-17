## MODIFIED Requirements

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
