## ADDED Requirements

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
The settings modal SHALL show `innerRadius` and `outerRadius` sliders ONLY when `ringFormat` is `"circle"` or `"border"`. These controls SHALL be hidden when `ringFormat` is `"full"`.

#### Scenario: Radius sliders hidden in full mode
- **WHEN** `ringFormat` is `"full"`
- **THEN** the `innerRadius` and `outerRadius` sliders are not visible in the settings modal

#### Scenario: Radius sliders visible in circle mode
- **WHEN** `ringFormat` is set to `"circle"`
- **THEN** both `innerRadius` and `outerRadius` sliders become visible

### Requirement: All settings apply without explicit save
The system SHALL apply every settings change immediately to the Zustand store and the light surface. There SHALL be no "Save", "Apply", or "Confirm" button for individual parameter changes.

#### Scenario: Settings are applied live without save
- **WHEN** the user adjusts any control in the settings modal
- **THEN** the light surface updates immediately and the new value is persisted to `localStorage` without any additional user action
