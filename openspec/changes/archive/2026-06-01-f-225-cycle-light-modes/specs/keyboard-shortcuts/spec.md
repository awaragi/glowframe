## MODIFIED Requirements

### Requirement: Global shortcut components
The system SHALL provide a `GlobalShortcuts` headless React component (renders `null`) that registers the following bindings via `useKeyboardShortcuts`:

| Key | Action |
|---|---|
| `f` (case-insensitive) | Toggle fullscreen (no-op when `isAvailable` is `false`) |
| `s` (case-insensitive) | Toggle settings modal open/closed |
| `?` / Shift+`/` | Toggle help dialog open/closed |
| `m` (case-insensitive) | Cycle active preset to next light mode (destructive; calls `switchMode`) |
| `1`–`9` | Select profile at array index `n-1`; no-op if index out of bounds |

`GlobalShortcuts` SHALL be mounted once in `LightPage` and SHALL replace the existing inline `useEffect` `F` key handler. When the `m` binding fires, the component SHALL call `switchMode(activeProfileId, nextMode(currentMode))` using the canonical cycle order from `src/lib/modeCycle.ts`, then invoke an `onModeCycled(label)` callback with the human-readable label for the new mode.

#### Scenario: F key toggles fullscreen
- **WHEN** no form control has focus
- **WHEN** the user presses `F` or `f`
- **THEN** the fullscreen toggle is called

#### Scenario: S key toggles settings modal
- **WHEN** no form control has focus
- **WHEN** the user presses `S` or `s`
- **THEN** the settings modal open state toggles

#### Scenario: Question mark key toggles help dialog
- **WHEN** no form control has focus
- **WHEN** the user presses `?` (Shift+`/`)
- **THEN** the help dialog open state toggles

#### Scenario: M key cycles to next light mode
- **WHEN** no form control has focus
- **WHEN** the active profile has `mode: 'full'`
- **WHEN** the user presses `M` or `m`
- **THEN** `switchMode` is called with the active profile id and `'full-color'`
- **THEN** `onModeCycled` is called with `'Full Color'`

#### Scenario: M key wraps from last mode to first
- **WHEN** no form control has focus
- **WHEN** the active profile has `mode: 'spot-color'`
- **WHEN** the user presses `M` or `m`
- **THEN** `switchMode` is called with the active profile id and `'full'`
- **THEN** `onModeCycled` is called with `'Full'`

#### Scenario: M key fires when settings modal is open
- **WHEN** the settings modal is open
- **WHEN** no form control has focus
- **WHEN** the user presses `M` or `m`
- **THEN** `switchMode` is called for the active profile

#### Scenario: M key is silent when a form control has focus
- **WHEN** an `HTMLInputElement` has focus
- **WHEN** the user presses `M` or `m`
- **THEN** `switchMode` is not called

#### Scenario: 1 key selects first profile
- **WHEN** no form control has focus
- **WHEN** at least one profile exists
- **WHEN** the user presses `1`
- **THEN** the first profile in the profiles array becomes the active profile

#### Scenario: Number key is no-op when profile does not exist
- **WHEN** no form control has focus
- **WHEN** fewer than `n` profiles exist
- **WHEN** the user presses digit `n`
- **THEN** no profile change occurs

#### Scenario: 9 key selects ninth profile when it exists
- **WHEN** no form control has focus
- **WHEN** at least 9 profiles exist
- **WHEN** the user presses `9`
- **THEN** the ninth profile (index 8) becomes the active profile

---

### Requirement: Keyboard shortcuts help dialog
The system SHALL provide a `HelpDialog` component built on the shadcn/ui `Dialog` primitive that displays a hardcoded, grouped reference of all keyboard shortcuts. The dialog SHALL be closeable via the × button, `Escape`, or clicking outside. Keys SHALL be rendered using `<kbd>` elements.

The dialog SHALL present shortcuts in five named groups:

**Global** (always active):
| Key | Action |
|---|---|
| `F` | Toggle fullscreen |
| `S` | Toggle settings |
| `?` | Toggle this help dialog |
| `M` | Cycle light mode (resets mode settings) |

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

**Clock** (always active):
| Key | Action |
|---|---|
| `T` | Cycle clock: off → top-left → bottom-left → bottom-right → off |
| `Shift+T` | Cycle clock size: small → medium → large |

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

#### Scenario: All five shortcut groups are rendered
- **WHEN** the help dialog is open
- **THEN** the dialog contains sections for Global, Light surface, Ring & Spot radius, Clock, and Settings modal shortcuts

#### Scenario: Global group lists M key
- **WHEN** the help dialog is open
- **THEN** the Global section contains a row for `M` with action text indicating mode cycling resets mode settings

#### Scenario: Clock group lists T and Shift+T
- **WHEN** the help dialog is open
- **THEN** the Clock section contains a row for `T` (cycle clock visibility+position) and a row for `Shift+T` (cycle clock size)

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
