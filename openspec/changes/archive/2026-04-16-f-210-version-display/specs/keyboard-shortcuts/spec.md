## MODIFIED Requirements

### Requirement: Keyboard shortcuts help dialog
The system SHALL provide a `HelpDialog` component built on the shadcn/ui `Dialog` primitive that displays a hardcoded, grouped reference of all keyboard shortcuts. The dialog SHALL be closeable via the × button, `Escape`, or clicking outside. Keys SHALL be rendered using `<kbd>` elements.

The dialog SHALL present shortcuts in four named groups:

**Global** (always active):
| Key | Action |
|---|---|
| `F` | Toggle fullscreen |
| `S` | Toggle settings |
| `?` | Toggle this help dialog |

**Light surface** (active for temperature-based modes: `full`, `ring`, `spot`):
| Key | Action |
|---|---|
| `↑` / `↓` | Foreground brightness +5% / −5% |
| `←` / `→` | Colour temperature −100 K / +100 K |
| `1`–`9` | Switch to preset #1–#9 |

**Ring & Spot radius** (active for ring/ring-color/spot/spot-color modes):
| Key | Action |
|---|---|
| `]` / `[` | Outer radius (ring) or radius (spot) +2% / −2% |
| `}` / `{` | Inner radius (ring only) +2% / −2% |

**Settings modal**:
| Key | Action |
|---|---|
| `Escape` | Close settings |

The dialog SHALL display a footer below the shortcut groups that shows the current application version in the format `v<semver>` (e.g., `v1.2.0`), sourced from `import.meta.env.VITE_APP_VERSION`. The version text SHALL be visually de-emphasised (muted colour, small type) so it does not compete with the shortcut content.

#### Scenario: Help dialog opens when HelpButton is clicked
- **WHEN** the help button is clicked
- **THEN** the dialog becomes visible with a title or accessible label

#### Scenario: Help dialog closes on Escape
- **WHEN** the help dialog is open
- **WHEN** the user presses `Escape`
- **THEN** the dialog closes

#### Scenario: Help dialog closes on outside click
- **WHEN** the help dialog is open
- **WHEN** the user clicks outside the dialog
- **THEN** the dialog closes

#### Scenario: All four shortcut groups are rendered
- **WHEN** the help dialog is open
- **THEN** the dialog contains sections for Global, Light surface, Ring & Spot radius, and Settings modal shortcuts

#### Scenario: kbd elements are used for key display
- **WHEN** the help dialog is open
- **THEN** shortcut keys are rendered inside `<kbd>` elements

#### Scenario: Version string is rendered in the dialog footer
- **WHEN** the help dialog is open
- **WHEN** `import.meta.env.VITE_APP_VERSION` is `"1.2.0"`
- **THEN** the dialog footer contains the text `v1.2.0`

#### Scenario: Version text is visually de-emphasised
- **WHEN** the help dialog is open
- **THEN** the version string is rendered with muted colour and small typography, distinct from the shortcut content
