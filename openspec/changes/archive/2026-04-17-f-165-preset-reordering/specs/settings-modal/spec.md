## ADDED Requirements

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
