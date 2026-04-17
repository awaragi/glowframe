# Ring Radius Validation

## Purpose

Defines the cross-field validation rules for `innerRadius` and `outerRadius` in ring-mode settings forms, and the gating behaviour that prevents invalid radius pairs from being persisted to the Zustand store.

## Requirements

### Requirement: Cross-field radius validation rule
The Zod schema in each ring-mode settings form (RingModeSettings and RingColorModeSettings) SHALL include a `.superRefine()` rule that issues a validation error when `innerRadius >= outerRadius`. The error path SHALL be `["innerRadius"]` and the message SHALL be `"Inner radius must be less than outer radius."`.

#### Scenario: Valid radius pair passes validation
- **WHEN** `innerRadius` is `20` and `outerRadius` is `80`
- **THEN** the Zod schema validates successfully with no errors

#### Scenario: Equal radii fail validation
- **WHEN** `innerRadius` is `50` and `outerRadius` is `50`
- **THEN** the Zod schema returns a validation error with message `"Inner radius must be less than outer radius."`

#### Scenario: Inner radius greater than outer radius fails validation
- **WHEN** `innerRadius` is `70` and `outerRadius` is `30`
- **THEN** the Zod schema returns a validation error with message `"Inner radius must be less than outer radius."`

### Requirement: Store update gated on form validity
The ring-mode settings form SHALL call `updateProfile` ONLY when the full form is valid after a slider change. When the form is invalid due to the radius cross-validation rule, `updateProfile` MUST NOT be called and the Zustand store SHALL retain its previously persisted values.

#### Scenario: Valid slider change persists to store
- **WHEN** the user adjusts `outerRadius` to `80` while `innerRadius` is `20`
- **THEN** `updateProfile` is called with the new `outerRadius` value and the store reflects `outerRadius: 80`

#### Scenario: Invalid slider change does not persist to store
- **WHEN** the user drags `innerRadius` to `80` while `outerRadius` is `60`
- **THEN** `updateProfile` is NOT called and the store retains the previous `innerRadius` value
