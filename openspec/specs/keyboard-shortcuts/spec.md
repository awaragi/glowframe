## Purpose

Centralised keyboard shortcut system for GlowFrame. Provides a reusable `useKeyboardShortcuts` engine hook, per-mode headless shortcut components, global bindings (`F`, `S`, `?`, `1`–`9`), and a discoverable `HelpDialog` with a hardcoded grouped reference table.

## Requirements

### Requirement: Keyboard shortcuts engine hook
The system SHALL provide a `useKeyboardShortcuts(bindings: KeyBinding[])` hook where `KeyBinding` is `{ key: string; shift?: boolean; handler: () => void }`. The hook SHALL attach a single `keydown` listener on `document` and call the matching binding's `handler` when the pressed key matches. The hook SHALL enforce a focus guard that silently skips all handlers when `document.activeElement` is an `HTMLInputElement`, `HTMLSelectElement`, `HTMLTextAreaElement`, or an element with `contentEditable === 'true'`. The hook SHALL remove the listener when the component unmounts.

#### Scenario: Handler fires when key matches and no form control has focus
- **WHEN** no form control has focus
- **WHEN** the user presses a key that matches a registered binding
- **THEN** the binding's `handler` is called exactly once

#### Scenario: Handler is silent when an input has focus
- **WHEN** an `HTMLInputElement` (including `type="range"`) has focus
- **WHEN** the user presses a registered key
- **THEN** no handler is called

#### Scenario: Handler is silent when a select has focus
- **WHEN** an `HTMLSelectElement` has focus
- **WHEN** the user presses a registered key
- **THEN** no handler is called

#### Scenario: Handler is silent when a textarea has focus
- **WHEN** an `HTMLTextAreaElement` has focus
- **WHEN** the user presses a registered key
- **THEN** no handler is called

#### Scenario: Handler is silent when a contentEditable element has focus
- **WHEN** an element with `contentEditable="true"` has focus
- **WHEN** the user presses a registered key
- **THEN** no handler is called

#### Scenario: Shift modifier is respected
- **WHEN** a binding is registered with `{ key: '[', shift: true }`
- **WHEN** the user presses Shift+`[`
- **THEN** the handler fires

#### Scenario: Shift binding does not fire without shift
- **WHEN** a binding is registered with `{ key: '[', shift: true }`
- **WHEN** the user presses `[` without Shift
- **THEN** the handler does NOT fire

#### Scenario: Listener is removed on unmount
- **WHEN** the component using `useKeyboardShortcuts` unmounts
- **THEN** the `keydown` listener is removed from `document`

---

### Requirement: Global shortcut components
The system SHALL provide a `GlobalShortcuts` headless React component (renders `null`) that registers the following bindings via `useKeyboardShortcuts`:

| Key | Action |
|---|---|
| `f` (case-insensitive) | Toggle fullscreen (no-op when `isAvailable` is `false`) |
| `s` (case-insensitive) | Toggle settings modal open/closed |
| `?` / Shift+`/` | Toggle help dialog open/closed |
| `1`–`9` | Select profile at array index `n-1`; no-op if index out of bounds |

`GlobalShortcuts` SHALL be mounted once in `LightPage` and SHALL replace the existing inline `useEffect` `F` key handler.

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

### Requirement: Keyboard shortcut step constants
The system SHALL define all keyboard shortcut adjustment step values in a single constants object exported from `src/lib/keyboardShortcutConstants.ts`. All per-mode shortcut components SHALL import their step values from this file; no step value SHALL be hardcoded inline in a component or hook. The constants SHALL include at minimum:

| Constant | Value | Description |
|---|---|---|
| `BRIGHTNESS_STEP` | 5 | Increment/decrement for `lightBrightness` |
| `TEMPERATURE_STEP` | 100 | Increment/decrement for `lightTemperature` (Kelvin) |
| `RADIUS_STEP` | 2 | Increment/decrement for `outerRadius`, `innerRadius`, and `radius` |

#### Scenario: Constants file exports all required step values
- **WHEN** `src/lib/keyboardShortcutConstants.ts` is imported
- **THEN** `BRIGHTNESS_STEP`, `TEMPERATURE_STEP`, and `RADIUS_STEP` are all exported as numeric constants

#### Scenario: Step values are used by shortcut components
- **WHEN** a per-mode shortcut component adjusts a parameter
- **THEN** the delta applied equals the value from the corresponding constant in `keyboardShortcutConstants.ts`

---

### Requirement: Per-mode shortcut components
The system SHALL provide an `ActiveModeShortcuts` headless component that reads the active profile's `mode` and mounts the appropriate mode-specific shortcut component. One headless shortcut component SHALL exist for each profile mode. Each mode component SHALL register only the shortcuts applicable to that mode's parameters via `useKeyboardShortcuts`. All step values SHALL be sourced from `src/lib/keyboardShortcutConstants.ts`.

Mode-to-shortcut mapping:

| Mode | `↑`/`↓` | `←`/`→` | `]`/`[` | `{`/`}` |
|---|---|---|---|---|
| `full` | `lightBrightness` ±`BRIGHTNESS_STEP` | `lightTemperature` ±`TEMPERATURE_STEP` | — | — |
| `full-color` | — | — | — | — |
| `ring` | `lightBrightness` ±`BRIGHTNESS_STEP` | `lightTemperature` ±`TEMPERATURE_STEP` | `outerRadius` ±`RADIUS_STEP` | `innerRadius` ±`RADIUS_STEP` |
| `ring-color` | — | — | `outerRadius` ±`RADIUS_STEP` | `innerRadius` ±`RADIUS_STEP` |
| `spot` | `lightBrightness` ±`BRIGHTNESS_STEP` | `lightTemperature` ±`TEMPERATURE_STEP` | `radius` ±`RADIUS_STEP` | — |
| `spot-color` | — | — | `radius` ±`RADIUS_STEP` | — |

All numeric adjustments SHALL be clamped to the parameter's valid range before being written to the store. `lightBrightness` clamps to 0–100. `lightTemperature` clamps to 1000–10000. All radius values clamp to 0–100. When adjusting `outerRadius`, the result SHALL be clamped to `max(innerRadius + 1, min(100, current + delta))`. When adjusting `innerRadius`, the result SHALL be clamped to `min(outerRadius - 1, max(0, current + delta))`.

#### Scenario: Up arrow increases foreground brightness on full mode
- **WHEN** active profile mode is `full`
- **WHEN** no form control has focus
- **WHEN** the user presses `ArrowUp`
- **THEN** `lightBrightness` increases by `BRIGHTNESS_STEP`, clamped to 100

#### Scenario: Down arrow decreases foreground brightness on full mode
- **WHEN** active profile mode is `full`
- **WHEN** no form control has focus
- **WHEN** the user presses `ArrowDown`
- **THEN** `lightBrightness` decreases by `BRIGHTNESS_STEP`, clamped to 0

#### Scenario: Right arrow increases colour temperature on full mode
- **WHEN** active profile mode is `full`
- **WHEN** no form control has focus
- **WHEN** the user presses `ArrowRight`
- **THEN** `lightTemperature` increases by `TEMPERATURE_STEP`, clamped to 10000

#### Scenario: Left arrow decreases colour temperature on full mode
- **WHEN** active profile mode is `full`
- **WHEN** no form control has focus
- **WHEN** the user presses `ArrowLeft`
- **THEN** `lightTemperature` decreases by `TEMPERATURE_STEP`, clamped to 1000

#### Scenario: Arrow keys are no-ops on full-color mode
- **WHEN** active profile mode is `full-color`
- **WHEN** no form control has focus
- **WHEN** the user presses any arrow key
- **THEN** no profile parameter changes

#### Scenario: ] key increases outerRadius on ring mode
- **WHEN** active profile mode is `ring`
- **WHEN** no form control has focus
- **WHEN** the user presses `]`
- **THEN** `outerRadius` increases by `RADIUS_STEP`, clamped to 100

#### Scenario: [ key decreases outerRadius on ring mode
- **WHEN** active profile mode is `ring`
- **WHEN** no form control has focus
- **WHEN** the user presses `[`
- **THEN** `outerRadius` decreases by `RADIUS_STEP`, clamped to `innerRadius + 1`

#### Scenario: } key increases innerRadius on ring mode
- **WHEN** active profile mode is `ring`
- **WHEN** no form control has focus
- **WHEN** the user presses Shift+`[` (i.e., `{`)
- **THEN** `innerRadius` increases by `RADIUS_STEP`, clamped to `outerRadius - 1`

#### Scenario: { key decreases innerRadius on ring mode
- **WHEN** active profile mode is `ring`
- **WHEN** no form control has focus
- **WHEN** the user presses Shift+`]` (i.e., `}`)
- **THEN** `innerRadius` decreases by `RADIUS_STEP`, clamped to 0

#### Scenario: ] key increases single radius on spot mode
- **WHEN** active profile mode is `spot`
- **WHEN** no form control has focus
- **WHEN** the user presses `]`
- **THEN** `radius` increases by `RADIUS_STEP`, clamped to 100

#### Scenario: { and } keys are no-ops on spot mode
- **WHEN** active profile mode is `spot` or `spot-color`
- **WHEN** no form control has focus
- **WHEN** the user presses `{` or `}`
- **THEN** no profile parameter changes

#### Scenario: Brightness clamped at maximum
- **WHEN** active profile `lightBrightness` is 100
- **WHEN** the user presses `ArrowUp`
- **THEN** `lightBrightness` remains 100

#### Scenario: Temperature clamped at minimum
- **WHEN** active profile `lightTemperature` is 1000
- **WHEN** the user presses `ArrowLeft`
- **THEN** `lightTemperature` remains 1000

#### Scenario: outerRadius clamps to innerRadius + 1
- **WHEN** active profile `innerRadius` is 40 and `outerRadius` is 42
- **WHEN** the user presses `[` to decrease `outerRadius` by 2
- **THEN** `outerRadius` is clamped to 41 (innerRadius + 1)

#### Scenario: innerRadius clamps to outerRadius - 1
- **WHEN** active profile `innerRadius` is 38 and `outerRadius` is 40
- **WHEN** the user presses `{` to increase `innerRadius` by 2
- **THEN** `innerRadius` is clamped to 39 (outerRadius - 1)

---

### Requirement: Help button
The system SHALL render a `HelpButton` component — a `<button>` fixed at `top-4 right-28 z-50` with `aria-label="Keyboard shortcuts"` — that toggles the help dialog open/closed when clicked.

#### Scenario: Help button is always visible
- **WHEN** the app renders
- **THEN** the help button is present in the DOM with `aria-label="Keyboard shortcuts"`

#### Scenario: Help button opens the dialog
- **WHEN** the help dialog is closed
- **WHEN** the help button is clicked
- **THEN** the help dialog becomes visible

#### Scenario: Help button closes the dialog
- **WHEN** the help dialog is open
- **WHEN** the help button is clicked
- **THEN** the help dialog closes

---

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
