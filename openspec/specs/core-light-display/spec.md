# Core Light Display

## Purpose

Defines the core full-viewport light surface — the primary visual output of GlowFrame. The light surface fills the entire screen with a configurable color and brightness, serving as a front-facing fill light for video calls, selfies, and recording.

## Requirements

### Requirement: Full-viewport light surface
The system SHALL render a single `LightSurface` component that fills exactly 100 vw × 100 vh with no scrollbars or visible overflow.

#### Scenario: Light surface fills viewport
- **WHEN** the app loads at the root path `/`
- **THEN** a single background element covers the full viewport width and height with no scrollbars visible

### Requirement: LightSurface mode dispatcher
The `LightSurface` component SHALL read the active profile's `mode` from the Zustand store and render the corresponding mode renderer component. It SHALL NOT contain any rendering logic itself.

#### Scenario: Correct renderer for full mode
- **WHEN** the active profile has `mode: 'full'`
- **THEN** `LightSurface` renders the `FullModeSurface` component

#### Scenario: Correct renderer for spot-color mode
- **WHEN** the active profile has `mode: 'spot-color'`
- **THEN** `LightSurface` renders the `SpotColorModeSurface` component

### Requirement: full mode rendering
The `FullModeSurface` component SHALL render a fixed `inset-0` element whose background color is computed by `blendWithTemperature('#ffffff', lightTemperature)` with `filter: brightness(lightBrightness / 100)` applied.

#### Scenario: full mode fills viewport with temperature-blended color
- **WHEN** `mode` is `'full'`, `lightTemperature` is `6500`, and `lightBrightness` is `100`
- **THEN** the entire viewport is filled with near-neutral white; no transparent areas

#### Scenario: full mode brightness filter applied
- **WHEN** `lightBrightness` is `50`
- **THEN** the CSS `filter: brightness(0.5)` is applied to the full-surface element

### Requirement: full-color mode rendering
The `FullColorModeSurface` component SHALL render a fixed `inset-0` element whose background color is `lightColor` with no brightness filter applied.

#### Scenario: full-color mode fills viewport with explicit color
- **WHEN** `mode` is `'full-color'` and `lightColor` is `'#ff8800'`
- **THEN** the entire viewport is filled with `#ff8800`

### Requirement: ring mode rendering
The `RingModeSurface` component SHALL render two overlaid fixed `inset-0` layers. The background layer displays the background color computed from `blendWithTemperature('#ffffff', backgroundLightTemperature)` with `filter: brightness(backgroundLightBrightness / 100)`. The foreground layer renders an annular ring using a radial-gradient: the ring is visible between `innerRadius`% and `outerRadius`% of `min(100vw, 100vh)`; areas inside the inner radius and outside the outer radius are transparent. The ring color is `blendWithTemperature('#ffffff', lightTemperature)` with `filter: brightness(lightBrightness / 100)`.

#### Scenario: ring mode background is black at default background settings
- **WHEN** `mode` is `'ring'`, `backgroundLightTemperature` is `0`, and `backgroundLightBrightness` is `0`
- **THEN** the background layer is fully black

#### Scenario: ring mode ring is visible between inner and outer radius
- **WHEN** `mode` is `'ring'`, `innerRadius` is `20`, and `outerRadius` is `60`
- **THEN** a circular ring is visible between 20% and 60% of `min(100vw, 100vh)`; areas inside and outside the ring are transparent on the foreground layer

### Requirement: ring-color mode rendering
The `RingColorModeSurface` component SHALL render two overlaid fixed `inset-0` layers. The background layer displays `backgroundColor`. The foreground layer renders an annular ring using a radial-gradient with `lightColor` for the ring and transparent elsewhere; radii proportional to `min(100vw, 100vh)`.

#### Scenario: ring-color mode shows explicit background and ring colors
- **WHEN** `mode` is `'ring-color'`, `lightColor` is `'#00aaff'`, `backgroundColor` is `'#000000'`, `innerRadius` is `10`, and `outerRadius` is `50`
- **THEN** the viewport shows a black background with a blue ring between 10% and 50% of `min(100vw, 100vh)`

### Requirement: spot mode rendering
The `SpotModeSurface` component SHALL render two overlaid fixed `inset-0` layers. The background layer displays the background color computed from `blendWithTemperature('#ffffff', backgroundLightTemperature)` with `filter: brightness(backgroundLightBrightness / 100)`. The foreground layer renders a filled circle centered in the viewport with radius equal to `radius`% of `min(100vw, 100vh)` in the temperature-blended foreground color; the area outside the circle is transparent.

#### Scenario: spot mode renders centered disc over black background
- **WHEN** `mode` is `'spot'`, `backgroundLightBrightness` is `0`, `lightTemperature` is `6500`, `lightBrightness` is `100`, and `radius` is `40`
- **THEN** a white disc centered in the viewport is visible at 40% of `min(100vw, 100vh)` radius against a fully black background

### Requirement: spot-color mode rendering
The `SpotColorModeSurface` component SHALL render two overlaid fixed `inset-0` layers. The background layer displays `backgroundColor`. The foreground layer renders a filled circle in `lightColor` centered in the viewport with radius equal to `radius`% of `min(100vw, 100vh)`; the area outside is transparent.

#### Scenario: spot-color mode shows explicit disc color over background
- **WHEN** `mode` is `'spot-color'`, `lightColor` is `'#ffffff'`, `backgroundColor` is `'#001133'`, and `radius` is `30`
- **THEN** a white disc at 30% of `min(100vw, 100vh)` radius is visible against a dark blue background

### Requirement: All mode renderers are responsive
Each mode renderer component SHALL adapt to any viewport size. All radius and size values are expressed as percentages of `min(100vw, 100vh)` so the light shape scales proportionally on resize.

#### Scenario: Ring shape remains proportional on viewport resize
- **WHEN** the viewport is resized from 1024×768 to 375×812
- **THEN** the ring's visual radii remain at the specified percentages of the new `min(100vw, 100vh)` value

### Requirement: Live re-render on settings change
The system SHALL re-render the `LightSurface` immediately whenever any active profile field changes in the Zustand store — including a mode switch via `switchMode` — with no explicit save or apply action required.

#### Scenario: Any profile field update triggers re-render
- **WHEN** any mode-specific field (e.g., `lightTemperature`, `lightColor`, `radius`, `backgroundColor`) is changed on the active profile via `updateProfile`
- **THEN** the displayed surface updates within the same render cycle

#### Scenario: Mode switch triggers re-render to new mode renderer
- **WHEN** `switchMode(activeProfileId, 'spot')` is called
- **THEN** the displayed surface switches to the spot renderer immediately

### Requirement: No UI chrome on the light surface
The system SHALL display no scrollbars, navigation elements, or other UI chrome while the light surface is active (gear and fullscreen buttons are introduced by later features and are out of scope here).

#### Scenario: Clean full-screen light view
- **WHEN** the app is at the root path `/`
- **THEN** only the light surface background is visible; no scrollbars appear and no other UI elements are rendered

### Requirement: Default Zustand state
The Zustand store SHALL initialise with a default profile of `mode: 'full'`, `lightTemperature: 6500`, and `lightBrightness: 100` when no persisted state exists.

#### Scenario: First launch default full-mode rendering
- **WHEN** the app is loaded for the first time with no prior localStorage state
- **THEN** the light surface renders the `full` mode with near-neutral white light at full brightness
