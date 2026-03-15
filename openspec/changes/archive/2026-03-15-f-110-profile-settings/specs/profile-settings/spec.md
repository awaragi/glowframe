## ADDED Requirements

### Requirement: Extended Profile type fields
Each `Profile` SHALL include `colorTemperature` (integer 1000–10000, representing Kelvin), `ringFormat` (`"full" | "circle" | "border"`), `innerRadius` (integer 0–100, percentage), and `outerRadius` (integer 0–100, percentage).

#### Scenario: Profile contains all extended fields
- **WHEN** a profile is created or loaded from storage
- **THEN** it has `colorTemperature`, `ringFormat`, `innerRadius`, and `outerRadius` alongside `id`, `name`, `lightColor`, and `brightness`

### Requirement: Default values for extended fields
The default "Default" profile seed SHALL initialise `colorTemperature` to `6500`, `ringFormat` to `"full"`, `innerRadius` to `0`, and `outerRadius` to `100`.

#### Scenario: First launch extended defaults
- **WHEN** the app loads with no prior localStorage state
- **THEN** the default profile has `colorTemperature: 6500`, `ringFormat: "full"`, `innerRadius: 0`, and `outerRadius: 100`

### Requirement: Live profile field update action
The Zustand store SHALL provide an `updateProfile(id, patch)` action that merges a partial `Profile` object (excluding `id`) into the matching profile entry immediately.

#### Scenario: colorTemperature update applies live
- **WHEN** `updateProfile(activeId, { colorTemperature: 3200 })` is called
- **THEN** the active profile's `colorTemperature` is `3200` without a page reload

#### Scenario: ringFormat update applies live
- **WHEN** `updateProfile(activeId, { ringFormat: "circle" })` is called
- **THEN** the active profile's `ringFormat` is `"circle"`

#### Scenario: innerRadius and outerRadius updates apply live
- **WHEN** `updateProfile(activeId, { innerRadius: 20, outerRadius: 80 })` is called
- **THEN** the active profile has `innerRadius: 20` and `outerRadius: 80`

### Requirement: Full ring format rendering
When `ringFormat` is `"full"`, the system SHALL render a solid color filling the entire viewport, identical to the pre-profile rendering.

#### Scenario: Full format fills viewport
- **WHEN** `ringFormat` is `"full"`
- **THEN** the entire viewport background is the computed light color with no transparent areas

### Requirement: Circle ring format rendering
When `ringFormat` is `"circle"`, the system SHALL render an annular ring centred in the viewport. The ring's inner and outer radii are defined as percentages of `min(100vw, 100vh)`.

#### Scenario: Circle ring is visible between inner and outer radius
- **WHEN** `ringFormat` is `"circle"`, `innerRadius` is `20`, and `outerRadius` is `80`
- **THEN** a circular ring is visible between 20% and 80% of the viewport's shorter dimension; areas inside the inner radius and outside the outer radius are transparent

### Requirement: Border ring format rendering
When `ringFormat` is `"border"`, the system SHALL render a rectangular frame band around the viewport edges. The band thickness is derived from `outerRadius - innerRadius` as a percentage of `min(100vw, 100vh)`.

#### Scenario: Border ring frames the edges
- **WHEN** `ringFormat` is `"border"`, `innerRadius` is `0`, and `outerRadius` is `10`
- **THEN** a rectangular light band appears around the perimeter of the viewport; the interior is transparent

### Requirement: Color temperature tinting
The system SHALL blend a warm-to-cool tint derived from `colorTemperature` (warm at low K, cool at high K) over `lightColor` before applying the brightness filter.

#### Scenario: Warm temperature produces warmer tint
- **WHEN** `colorTemperature` is `2700` and `lightColor` is `"#ffffff"`
- **THEN** the rendered surface has a warm orange-yellow tint

#### Scenario: Neutral temperature produces near-white output
- **WHEN** `colorTemperature` is `6500` and `lightColor` is `"#ffffff"`
- **THEN** the rendered surface is close to neutral white
