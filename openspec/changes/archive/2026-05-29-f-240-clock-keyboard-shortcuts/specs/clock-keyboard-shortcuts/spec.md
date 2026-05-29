## ADDED Requirements

### Requirement: ClockShortcuts component
The system SHALL provide a `ClockShortcuts` headless React component (renders `null`) that registers the following bindings via `useKeyboardShortcuts`:

| Key | Action |
|---|---|
| `t` (case-insensitive) | Advance clock through a four-state cycle: off → on+`top-left` → on+`bottom-left` → on+`bottom-right` → off |
| `Shift+T` | Cycle `clock.size` through `'small'` → `'medium'` → `'large'` → `'small'` |

`ClockShortcuts` SHALL be mounted once in `LightPage` alongside `GlobalShortcuts` and `ActiveModeShortcuts`.

The `T` key state machine is determined by the current `clock.enabled` and `clock.position` values:

| Current state | Next state |
|---|---|
| `enabled: false` (any position) | `enabled: true, position: 'top-left'` |
| `enabled: true, position: 'top-left'` | `enabled: true, position: 'bottom-left'` |
| `enabled: true, position: 'bottom-left'` | `enabled: true, position: 'bottom-right'` |
| `enabled: true, position: 'bottom-right'` | `enabled: false` |

#### Scenario: T key turns clock on at top-left when off
- **WHEN** no form control has focus
- **WHEN** the active profile has `clock.enabled: false`
- **WHEN** the user presses `T` or `t`
- **THEN** the active profile's `clock.enabled` becomes `true` and `clock.position` becomes `'top-left'`

#### Scenario: T key advances position from top-left to bottom-left
- **WHEN** no form control has focus
- **WHEN** the active profile has `clock.enabled: true` and `clock.position: 'top-left'`
- **WHEN** the user presses `T` or `t`
- **THEN** the active profile's `clock.position` becomes `'bottom-left'` and `clock.enabled` remains `true`

#### Scenario: T key advances position from bottom-left to bottom-right
- **WHEN** no form control has focus
- **WHEN** the active profile has `clock.enabled: true` and `clock.position: 'bottom-left'`
- **WHEN** the user presses `T` or `t`
- **THEN** the active profile's `clock.position` becomes `'bottom-right'` and `clock.enabled` remains `true`

#### Scenario: T key turns clock off from bottom-right
- **WHEN** no form control has focus
- **WHEN** the active profile has `clock.enabled: true` and `clock.position: 'bottom-right'`
- **WHEN** the user presses `T` or `t`
- **THEN** the active profile's `clock.enabled` becomes `false`

#### Scenario: Shift+T cycles size from small to medium
- **WHEN** no form control has focus
- **WHEN** the active profile has `clock.size: 'small'`
- **WHEN** the user presses `Shift+T`
- **THEN** the active profile's `clock.size` becomes `'medium'`

#### Scenario: Shift+T cycles size from medium to large
- **WHEN** no form control has focus
- **WHEN** the active profile has `clock.size: 'medium'`
- **WHEN** the user presses `Shift+T`
- **THEN** the active profile's `clock.size` becomes `'large'`

#### Scenario: Shift+T cycles size from large back to small
- **WHEN** no form control has focus
- **WHEN** the active profile has `clock.size: 'large'`
- **WHEN** the user presses `Shift+T`
- **THEN** the active profile's `clock.size` becomes `'small'`

#### Scenario: Shift+T cycles size regardless of clock enabled state
- **WHEN** no form control has focus
- **WHEN** the active profile has `clock.enabled: false`
- **WHEN** the user presses `Shift+T`
- **THEN** the active profile's `clock.size` is cycled to the next value

#### Scenario: T key is suppressed when a form control has focus
- **WHEN** an `HTMLInputElement` has focus
- **WHEN** the user presses `T`
- **THEN** `clock.enabled` and `clock.position` do not change
