## ADDED Requirements

### Requirement: Full-viewport light surface
The system SHALL render a single `LightSurface` component that fills exactly 100 vw × 100 vh with no scrollbars or visible overflow.

#### Scenario: Light surface fills viewport
- **WHEN** the app loads at the root path `/`
- **THEN** a single background element covers the full viewport width and height with no scrollbars visible

### Requirement: Background color derived from lightColor and brightness
The system SHALL compute the displayed background color from the active `lightColor` (hex string) and `brightness` (0–100 integer) Zustand state values, applying brightness via CSS `filter: brightness(<value>)` where `<value>` is `brightness / 100`.

#### Scenario: Default white light at full brightness
- **WHEN** `lightColor` is `#ffffff` and `brightness` is `100`
- **THEN** the light surface background is white and the brightness filter equals `1`

#### Scenario: Reduced brightness dims the surface
- **WHEN** `brightness` is set to `50`
- **THEN** the CSS `filter: brightness(0.5)` is applied to the light surface

#### Scenario: Custom color is reflected immediately
- **WHEN** `lightColor` is updated in the Zustand store to any valid hex value
- **THEN** the light surface background color updates without a page reload

### Requirement: Live re-render on settings change
The system SHALL re-render the `LightSurface` immediately whenever `lightColor` or `brightness` changes in the Zustand store, with no explicit save or apply action required.

#### Scenario: Brightness update triggers re-render
- **WHEN** `brightness` is changed in the Zustand store
- **THEN** the displayed surface updates within the same render cycle

#### Scenario: Color update triggers re-render
- **WHEN** `lightColor` is changed in the Zustand store
- **THEN** the displayed surface updates within the same render cycle

### Requirement: No UI chrome on the light surface
The system SHALL display no scrollbars, navigation elements, or other UI chrome while the light surface is active (gear and fullscreen buttons are introduced by later features and are out of scope here).

#### Scenario: Clean full-screen light view
- **WHEN** the app is at the root path `/`
- **THEN** only the light surface background is visible; no scrollbars appear and no other UI elements are rendered

### Requirement: Default Zustand state
The Zustand store SHALL provide default values of `lightColor: "#ffffff"` and `brightness: 100` when no persisted state exists.

#### Scenario: First launch defaults
- **WHEN** the app is loaded for the first time with no prior localStorage state
- **THEN** `lightColor` is `"#ffffff"` and `brightness` is `100`
