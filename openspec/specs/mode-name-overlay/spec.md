# Mode Name Overlay

## Purpose

Defines the transient centred mode-name overlay shown after cycling light modes with the `M` keyboard shortcut. Provides the shared `MODE_CYCLE_ORDER`, `MODE_LABELS`, `nextMode()` helper, and `MODE_OVERLAY_DURATION_MS` constant used by the shortcut system.

## Requirements

### Requirement: Mode cycle order and labels
The system SHALL export a canonical `MODE_CYCLE_ORDER` array, a `MODE_LABELS` record mapping each mode to a human-readable label, a `nextMode(current)` function that returns the next mode in cycle order (wrapping from the last mode to the first), and a `MODE_OVERLAY_DURATION_MS` constant from `src/lib/modeCycle.ts`. The cycle order SHALL be: `full` → `full-color` → `ring` → `ring-color` → `spot` → `spot-color` → `full`.

#### Scenario: nextMode advances in order
- **WHEN** `nextMode('full')` is called
- **THEN** the result is `'full-color'`

#### Scenario: nextMode wraps from last to first
- **WHEN** `nextMode('spot-color')` is called
- **THEN** the result is `'full'`

#### Scenario: MODE_LABELS provides human-readable names
- **WHEN** `MODE_LABELS['ring-color']` is accessed
- **THEN** the result is `'Ring Color'`

### Requirement: ModeNameOverlay transient display
The system SHALL provide a `ModeNameOverlay` component that displays a human-readable mode label centred on the light surface when the `label` prop is a non-null string. When `label` is `null`, the component SHALL render nothing.

#### Scenario: Overlay visible when label is set
- **WHEN** `ModeNameOverlay` is rendered with `label="Ring"`
- **THEN** the text `Ring` is visible in the DOM

#### Scenario: Overlay absent when label is null
- **WHEN** `ModeNameOverlay` is rendered with `label={null}`
- **THEN** no mode overlay element is present in the DOM

#### Scenario: Overlay auto-dismisses after fixed duration
- **WHEN** `ModeNameOverlay` is rendered with `label="Spot"`
- **WHEN** `MODE_OVERLAY_DURATION_MS` elapses
- **THEN** the component invokes its `onDismiss` callback exactly once

#### Scenario: Rapid label changes restart dismiss timer
- **WHEN** `ModeNameOverlay` is rendered with `label="Full"`
- **WHEN** the label changes to `"Ring"` before `MODE_OVERLAY_DURATION_MS` elapses
- **THEN** the displayed text updates to `Ring`
- **THEN** `onDismiss` is not called until `MODE_OVERLAY_DURATION_MS` after the label changed to `"Ring"`

### Requirement: ModeNameOverlay legibility backdrop
The `ModeNameOverlay` SHALL render the mode label inside a container with a semi-transparent dark backdrop matching the clock overlay legibility treatment (e.g., `bg-black/40 backdrop-blur-sm rounded-lg`) so the label remains readable against any light surface colour or brightness level.

#### Scenario: Backdrop is present on the overlay element
- **WHEN** `ModeNameOverlay` is rendered with a non-null label
- **THEN** the label container has a background opacity class (e.g., `bg-black/40`)

### Requirement: ModeNameOverlay non-blocking behaviour
The `ModeNameOverlay` SHALL be rendered with `pointer-events-none` so it does not intercept clicks or trap focus. It SHALL use a `z-index` below the application button cluster (gear, fullscreen, help) so it never covers interactive controls.

#### Scenario: Overlay does not block pointer events
- **WHEN** `ModeNameOverlay` is visible
- **THEN** the overlay wrapper element has `pointer-events-none`

### Requirement: ModeNameOverlay accessibility
The `ModeNameOverlay` root element SHALL have `role="status"` and `aria-live="polite"` so screen readers announce the mode name once when it appears.

#### Scenario: Accessibility attributes are present
- **WHEN** `ModeNameOverlay` is rendered with `label="Full Color"`
- **THEN** the overlay root has `role="status"` and `aria-live="polite"`
