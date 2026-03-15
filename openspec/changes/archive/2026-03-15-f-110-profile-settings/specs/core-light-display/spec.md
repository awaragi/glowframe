## MODIFIED Requirements

### Requirement: Background color derived from lightColor, brightness, and colorTemperature
The system SHALL compute the displayed background color from the active profile's `lightColor`, `brightness`, and `colorTemperature` values. `brightness` is applied via CSS `filter: brightness(<value>)`. `colorTemperature` modulates a warm-to-cool tint blended over `lightColor`.

#### Scenario: Default white light at full brightness and neutral temperature
- **WHEN** `lightColor` is `"#ffffff"`, `brightness` is `100`, and `colorTemperature` is `6500`
- **THEN** the light surface is near-neutral white with the brightness filter equal to `1`

#### Scenario: Reduced brightness dims the surface
- **WHEN** `brightness` is set to `50`
- **THEN** the CSS `filter: brightness(0.5)` is applied to the light surface

#### Scenario: Custom color is reflected immediately
- **WHEN** `lightColor` is updated in the Zustand store to any valid hex value
- **THEN** the light surface background color updates without a page reload

### Requirement: Ring format controls light shape
The system SHALL render the `LightSurface` according to the active profile's `ringFormat` value. In `"full"` mode it fills the viewport; in `"circle"` mode an annular ring is visible; in `"border"` mode a rectangular frame band is visible.

#### Scenario: Full format fills viewport
- **WHEN** `ringFormat` is `"full"`
- **THEN** the entire `fixed inset-0` element is the computed light color

#### Scenario: Circle format renders ring
- **WHEN** `ringFormat` is `"circle"`, `innerRadius` is `20`, and `outerRadius` is `80`
- **THEN** a circular ring between 20% and 80% of `min(100vw, 100vh)` is visible and the rest is transparent

#### Scenario: Border format renders frame
- **WHEN** `ringFormat` is `"border"`, `innerRadius` is `0`, and `outerRadius` is `10`
- **THEN** a rectangular frame band is rendered around the viewport edges and the interior is transparent

### Requirement: Live re-render on settings change
The system SHALL re-render the `LightSurface` immediately whenever any active profile field changes in the Zustand store, with no explicit save or apply action required.

#### Scenario: Any profile field update triggers re-render
- **WHEN** any of `lightColor`, `brightness`, `colorTemperature`, `ringFormat`, `innerRadius`, or `outerRadius` is changed on the active profile
- **THEN** the displayed surface updates within the same render cycle
