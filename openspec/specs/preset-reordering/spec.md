# Preset Reordering

## Purpose

Defines the preset reordering feature — allowing users to drag and drop profiles in the settings modal to change their display order, with the new order persisted to the store and localStorage.

## Requirements

### Requirement: Sequence number badge on each preset
The system SHALL display a numeric sequence badge to the left of the preset name for every profile in the settings modal profile list. The badge value SHALL equal the profile's 1-based position in the `profiles` array.

#### Scenario: Badge shows position in list
- **WHEN** the settings modal is open and there are three profiles
- **THEN** each profile row shows a badge with values `1`, `2`, and `3` respectively, left-to-right / top-to-bottom in display order

#### Scenario: Badge updates after reorder
- **WHEN** the user drags the third profile to the first position
- **THEN** that profile's badge changes from `3` to `1` and the previous first profile's badge becomes `2`

### Requirement: Drag-and-drop reordering via handle
The system SHALL render a drag handle icon on the left side of each profile row in the settings modal. Activating the handle and dragging SHALL reorder the profiles in the list. The keyboard-accessible drag (arrow keys while handle is focused) SHALL also work.

#### Scenario: Drag handle is present on every profile row
- **WHEN** the settings modal is open
- **THEN** every profile row contains a drag handle icon with `aria-label="Drag to reorder"`

#### Scenario: Pointer drag reorders profiles
- **WHEN** the user drags the handle of the second profile above the first profile
- **THEN** the second profile appears first in the list and has sequence number `1`

#### Scenario: Keyboard drag reorders profiles
- **WHEN** the user focuses a drag handle and uses the keyboard to move the item up
- **THEN** the profile moves up one position in the list and sequence numbers update accordingly

### Requirement: Reorder persisted to store
The system SHALL persist the new profile order to the Zustand store (and therefore `localStorage`) immediately when a drag-and-drop operation completes.

#### Scenario: Order survives reload
- **WHEN** the user reorders profiles and reloads the page
- **THEN** the profiles appear in the reordered sequence

### Requirement: Reorder does not mutate profile data
Reordering SHALL only change a profile's position in the `profiles` array. All other profile fields (id, name, mode, parameters) SHALL remain unchanged.

#### Scenario: Profile data intact after reorder
- **WHEN** a profile is moved to a different position
- **THEN** its `id`, `name`, and all mode-specific fields are identical to their pre-reorder values
