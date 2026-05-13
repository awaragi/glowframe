## ADDED Requirements

### Requirement: Clock time formatting utility
The system SHALL provide a pure `formatTime(date: Date, format: ClockFormat): string` function that converts a `Date` object to a display string according to the given format token. The supported format tokens are `'HH:mm'`, `'HH:mm:ss'`, `'hh:mm a'`, and `'hh:mm:ss a'`. `HH` is zero-padded 24-hour hours; `hh` is zero-padded 12-hour hours; `mm` is zero-padded minutes; `ss` is zero-padded seconds; `a` is `'AM'` or `'PM'`.

#### Scenario: HH:mm format for midnight
- **WHEN** `formatTime(new Date('2026-01-01T00:05:09'), 'HH:mm')` is called
- **THEN** the result is `'00:05'`

#### Scenario: HH:mm:ss format
- **WHEN** `formatTime(new Date('2026-01-01T14:07:03'), 'HH:mm:ss')` is called
- **THEN** the result is `'14:07:03'`

#### Scenario: hh:mm a format for AM
- **WHEN** `formatTime(new Date('2026-01-01T09:05:00'), 'hh:mm a')` is called
- **THEN** the result is `'09:05 AM'`

#### Scenario: hh:mm:ss a format for PM
- **WHEN** `formatTime(new Date('2026-01-01T13:07:03'), 'hh:mm:ss a')` is called
- **THEN** the result is `'01:07:03 PM'`

### Requirement: useClockTime hook
The system SHALL provide a `useClockTime(format: ClockFormat): string` hook that returns the current local time formatted with `formatTime`. The hook SHALL update the returned string every second using a `setInterval` and SHALL clear the interval on unmount.

#### Scenario: Hook returns a formatted time string
- **WHEN** `useClockTime('HH:mm')` is rendered in a component at 14:30
- **THEN** the component displays `'14:30'`

#### Scenario: Interval is cleared on unmount
- **WHEN** the component using `useClockTime` is unmounted
- **THEN** no further state updates occur after unmount (no leaked intervals)

### Requirement: ClockOverlay component renders when enabled
The system SHALL render a `ClockOverlay` component as a fixed-position element on the light surface when the active profile's `clockEnabled` is `true`. When `clockEnabled` is `false`, the component SHALL render nothing.

#### Scenario: Clock is visible when enabled
- **WHEN** the active profile has `clockEnabled: true`
- **THEN** an element with `aria-label="Digital clock"` is present in the DOM

#### Scenario: Clock is absent when disabled
- **WHEN** the active profile has `clockEnabled: false`
- **THEN** no element with `aria-label="Digital clock"` is present in the DOM

### Requirement: ClockOverlay position
The `ClockOverlay` SHALL be pinned to the corner specified by the active profile's `clockPosition` value. The top-right corner is NOT a valid position. The mapping is:

| `clockPosition` | Tailwind classes applied |
|---|---|
| `'top-left'` | `top-4 left-4` |
| `'bottom-left'` | `bottom-4 left-4` |
| `'bottom-right'` | `bottom-4 right-4` |

#### Scenario: Top-left position
- **WHEN** the active profile has `clockPosition: 'top-left'`
- **THEN** the clock element has Tailwind classes `top-4` and `left-4`

#### Scenario: Bottom-left position
- **WHEN** the active profile has `clockPosition: 'bottom-left'`
- **THEN** the clock element has Tailwind classes `bottom-4` and `left-4`

#### Scenario: Bottom-right position
- **WHEN** the active profile has `clockPosition: 'bottom-right'`
- **THEN** the clock element has Tailwind classes `bottom-4` and `right-4`

### Requirement: ClockOverlay size
The `ClockOverlay` text size SHALL reflect the active profile's `clockSize` value. The mapping is:

| `clockSize` | Tailwind text class |
|---|---|
| `'small'` | `text-2xl` |
| `'medium'` | `text-4xl` |
| `'large'` | `text-6xl` |

#### Scenario: Small size
- **WHEN** the active profile has `clockSize: 'small'`
- **THEN** the clock element has Tailwind class `text-2xl`

#### Scenario: Medium size
- **WHEN** the active profile has `clockSize: 'medium'`
- **THEN** the clock element has Tailwind class `text-4xl`

#### Scenario: Large size
- **WHEN** the active profile has `clockSize: 'large'`
- **THEN** the clock element has Tailwind class `text-6xl`

### Requirement: ClockOverlay legibility backdrop
The `ClockOverlay` SHALL render the time text inside a container with a semi-transparent dark backdrop (e.g., `bg-black/40 backdrop-blur-sm rounded-lg px-3 py-1`) so the digits remain legible against any light surface colour or brightness level.

#### Scenario: Backdrop is present on the clock element
- **WHEN** the clock is rendered with `clockEnabled: true`
- **THEN** the clock's container element has a background opacity class (e.g., `bg-black/40`)

### Requirement: ClockOverlay accessibility
The `ClockOverlay` root element SHALL have `aria-label="Digital clock"` and `aria-live="off"` to prevent screen readers from announcing each second update.

#### Scenario: Accessibility attributes are present
- **WHEN** the clock is rendered with `clockEnabled: true`
- **THEN** the element has `aria-label="Digital clock"` and `aria-live="off"`

### Requirement: ClockOverlay does not obscure application buttons
The `ClockOverlay` SHALL always be rendered as a fixed overlay with a `z-index` below the application button cluster (gear, fullscreen, share, help) so it never covers interactive controls.

#### Scenario: Clock z-index is lower than button cluster
- **WHEN** the clock and application buttons are both rendered
- **THEN** the application buttons remain interactive and visually above the clock
