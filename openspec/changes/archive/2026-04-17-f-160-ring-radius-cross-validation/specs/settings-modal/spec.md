## MODIFIED Requirements

### Requirement: Conditional radius sliders
The settings modal SHALL show `innerRadius` and `outerRadius` sliders ONLY when `mode` is `ring` or `ring-color`. These controls SHALL be hidden for all other modes. When visible, the radius sliders SHALL be rendered as a group with an inline validation error slot immediately below them. The error slot SHALL display `"Inner radius must be less than outer radius."` when `innerRadius >= outerRadius`, and SHALL be empty otherwise.

#### Scenario: Radius sliders hidden for non-ring modes
- **WHEN** the active profile has `mode: 'full'`, `'full-color'`, `'spot'`, or `'spot-color'`
- **THEN** the `innerRadius` and `outerRadius` sliders are not visible in the settings modal

#### Scenario: Radius sliders visible in ring mode
- **WHEN** the active profile has `mode: 'ring'`
- **THEN** both `innerRadius` and `outerRadius` sliders become visible

#### Scenario: Radius sliders visible in ring-color mode
- **WHEN** the active profile has `mode: 'ring-color'`
- **THEN** both `innerRadius` and `outerRadius` sliders become visible

#### Scenario: Inline error appears when inner radius meets outer radius
- **WHEN** the user sets `innerRadius` equal to or greater than `outerRadius` via a slider
- **THEN** the text `"Inner radius must be less than outer radius."` appears below the radius sliders

#### Scenario: Inline error disappears when constraint is resolved
- **WHEN** the user adjusts the sliders so that `innerRadius` is strictly less than `outerRadius`
- **THEN** the validation error text is no longer visible

#### Scenario: Store is not updated while radius constraint is violated
- **WHEN** `innerRadius >= outerRadius` in the form
- **THEN** the Zustand store's `innerRadius` and `outerRadius` values remain at their last valid state
