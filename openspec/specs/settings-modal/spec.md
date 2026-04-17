# Settings Modal

## Purpose

Defines the live settings panel — a right-side Sheet that allows users to manage profiles and adjust all lighting parameters with immediate live preview on the light surface.

## Requirements

### Requirement: Gear icon button
The system SHALL render a fixed-position button in the top-right corner of the screen at all times, using a gear or settings icon. The button SHALL have an accessible `aria-label` of "Open settings".

#### Scenario: Gear button is visible on the light surface
- **WHEN** the app is at the root path `/`
- **THEN** a button with `aria-label="Open settings"` is visible in the top-right corner

### Requirement: Gear button opens settings modal
The system SHALL open the settings Sheet/panel when the gear button is activated (click or keyboard Enter/Space).

#### Scenario: Clicking gear opens settings
- **WHEN** the user clicks the gear button
- **THEN** the settings panel becomes visible

### Requirement: Settings modal closes
The system SHALL close the settings Sheet when the user activates the close button (×), presses Escape, or clicks outside the Sheet.

#### Scenario: Escape closes settings
- **WHEN** the settings panel is open and the user presses Escape
- **THEN** the settings panel closes

#### Scenario: Outside click closes settings
- **WHEN** the settings panel is open and the user clicks outside of it
- **THEN** the settings panel closes

### Requirement: Profile list and switcher
The settings modal SHALL display a list of all profiles. The active profile SHALL be visually distinguished. Clicking a non-active profile SHALL switch to it immediately.

#### Scenario: Active profile is indicated
- **WHEN** the settings modal is open
- **THEN** the currently active profile is visually distinct from other profiles in the list

#### Scenario: Switching profile
- **WHEN** the user clicks on a non-active profile in the list
- **THEN** `activeProfileId` updates and all controls reflect the newly active profile's values

### Requirement: Create new profile
The settings modal SHALL provide a control to create a new profile. The new profile SHALL be a clone of the currently active profile and SHALL become active immediately.

#### Scenario: Creating a new profile
- **WHEN** the user activates the create profile control
- **THEN** a new profile appears in the list and becomes active

### Requirement: Rename profile inline
The settings modal SHALL allow the user to rename the active profile inline. The new name SHALL be validated (non-empty, max 64 characters) before being applied.

#### Scenario: Renaming a profile
- **WHEN** the user edits the profile name field and submits a valid name
- **THEN** the active profile's name is updated in the list

### Requirement: Delete profile
The settings modal SHALL provide a delete control per profile. The delete control SHALL be disabled when only one profile remains. Deleting a profile switches the active profile to the next available one.

#### Scenario: Delete is disabled with one profile
- **WHEN** only one profile exists
- **THEN** the delete control for that profile is disabled

#### Scenario: Deleting a profile removes it from the list
- **WHEN** there are two or more profiles and the user deletes a non-active profile
- **THEN** the deleted profile no longer appears in the list

### Requirement: Light color picker
The settings modal SHALL provide a colour picker control bound to the active profile's `lightColor`. Changes SHALL apply to the light surface immediately.

#### Scenario: Color picker updates light surface
- **WHEN** the user changes the colour picker value
- **THEN** the light surface background color updates immediately

### Requirement: Color temperature slider
The settings modal SHALL provide a slider for `colorTemperature` ranging from 1000 K to 10000 K. Changes SHALL apply live.

#### Scenario: Color temperature slider is present and functional
- **WHEN** the settings modal is open
- **THEN** a slider for colour temperature exists with a range of 1000 to 10000

### Requirement: Brightness slider
The settings modal SHALL provide a slider for `brightness` ranging from 0 to 100. Changes SHALL apply live.

#### Scenario: Brightness slider updates brightness immediately
- **WHEN** the user moves the brightness slider to 50
- **THEN** the active profile's `brightness` is `50` and the light surface dims accordingly

### Requirement: Ring format control
The settings modal SHALL provide a segmented control or select for `ringFormat` with options: `"full"`, `"circle"`, `"border"`. Changes SHALL apply live.

#### Scenario: Ring format selection updates rendering
- **WHEN** the user selects `"circle"` from the ring format control
- **THEN** the active profile's `ringFormat` is `"circle"` and the light surface switches to ring mode

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

### Requirement: All settings apply without explicit save
The system SHALL apply every settings change immediately to the Zustand store and the light surface. There SHALL be no "Save", "Apply", or "Confirm" button for individual parameter changes.

#### Scenario: Settings are applied live without save
- **WHEN** the user adjusts any control in the settings modal
- **THEN** the light surface updates immediately and the new value is persisted to `localStorage` without any additional user action

### Requirement: Profile list drag-and-drop container
The profile list in the settings modal SHALL be wrapped in a `DndContext` + `SortableContext` (from `@dnd-kit`) so that profile rows can be reordered by drag-and-drop.

#### Scenario: Drag-and-drop context is active
- **WHEN** the settings modal is open
- **THEN** the profile list is rendered inside a sortable drag-and-drop context

### Requirement: Profile row sequence badge
Each profile row in the settings modal profile list SHALL display a numeric badge showing its 1-based sequence position (derived from array index). The badge SHALL be visually distinct from the profile name and SHALL not overflow for values 1–99.

#### Scenario: Sequence badge is visible
- **WHEN** the settings modal is open with multiple profiles
- **THEN** each profile row shows a sequence badge reflecting its position (first row = `1`, second = `2`, etc.)

### Requirement: Profile row drag handle
Each profile row in the settings modal SHALL include a drag handle icon (e.g., a grip icon from `lucide-react`) with `aria-label="Drag to reorder"`. Activating the handle initiates the drag interaction (pointer or keyboard).

#### Scenario: Drag handle appears on each row
- **WHEN** the settings modal is open
- **THEN** each profile row contains a focusable drag handle with the accessible label "Drag to reorder"
