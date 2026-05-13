## ADDED Requirements

### Requirement: Settings modal two-tab layout
The settings modal SHALL be restructured into a two-tab layout using `@base-ui/react/tabs`. The layout order, top to bottom, SHALL be: profile management panel → tab bar → tab content panel. The profile management panel (profile list, create, rename, delete, reorder) SHALL remain above the tab bar and be visible regardless of which tab is active. The tab bar SHALL contain exactly two tabs: **Light** (Tab 1) and **Clock** (Tab 2). The default active tab on modal open SHALL be **Light**.

#### Scenario: Light tab is active by default on open
- **WHEN** the user opens the settings modal
- **THEN** the Light tab is active and its content is visible

#### Scenario: Tab bar is keyboard-accessible
- **WHEN** the settings modal is open and focus is on the tab bar
- **THEN** pressing the left/right arrow keys moves focus between the Light and Clock tabs

#### Scenario: Profile panel is always visible
- **WHEN** the Clock tab is active
- **THEN** the profile list and management controls are still visible above the tab bar

### Requirement: Light tab content
The **Light** tab panel SHALL contain all existing light-surface settings controls: mode selector, light colour picker, colour temperature slider, brightness slider, ring format selector, inner and outer radius sliders (conditional on ring/border mode). No existing control SHALL be removed or altered in behaviour.

#### Scenario: Light tab shows existing light controls
- **WHEN** the user opens the settings modal and the Light tab is active
- **THEN** the light colour, brightness, and mode controls are visible

### Requirement: Clock tab content
The **Clock** tab panel SHALL contain the following controls, each bound to the active profile's clock fields via React Hook Form and Zustand, applying changes live:

- **Show clock toggle** — a labelled toggle switch bound to `clockEnabled`. Label: `"Show clock"`.
- **Position selector** — a select/segmented control bound to `clockPosition`. Options: `Top-left`, `Bottom-left`, `Bottom-right`. Label: `"Position"`.
- **Size selector** — a select/segmented control bound to `clockSize`. Options: `Small`, `Medium`, `Large`. Label: `"Size"`.
- **Format selector** — a select control bound to `clockFormat`. Options: `HH:mm`, `HH:mm:ss`, `hh:mm a`, `hh:mm:ss a`. Label: `"Format"`.

All controls SHALL be disabled or hidden when `clockEnabled` is `false` (except the Show clock toggle itself). Changes SHALL be reflected on the clock overlay immediately.

#### Scenario: Clock tab is reachable via click
- **WHEN** the user clicks the Clock tab
- **THEN** the Clock tab panel becomes visible with Show clock toggle, Position, Size, and Format controls

#### Scenario: Enabling the clock via toggle shows it on the light surface
- **WHEN** the user toggles "Show clock" to on
- **THEN** the clock overlay appears on the light surface immediately

#### Scenario: Clock controls reflect active profile values
- **WHEN** the user switches to a different profile
- **THEN** the Clock tab controls update to show the new profile's clock settings

#### Scenario: Format change updates clock display immediately
- **WHEN** the user selects `HH:mm:ss` in the Format selector
- **THEN** the clock overlay switches to showing seconds without a page reload

#### Scenario: Position change moves clock immediately
- **WHEN** the user selects `Top-left` in the Position selector
- **THEN** the clock overlay moves to the top-left corner of the screen immediately
