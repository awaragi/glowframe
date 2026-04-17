## ADDED Requirements

### Requirement: Reorder profiles action
The Zustand store SHALL provide a `reorderProfiles(fromIndex: number, toIndex: number)` action that moves the profile at `fromIndex` to `toIndex`, shifting other profiles accordingly, and replaces the `profiles` array with the new order.

#### Scenario: reorderProfiles moves profile to new position
- **WHEN** `reorderProfiles(2, 0)` is called on a store with profiles `[A, B, C]`
- **THEN** `profiles` becomes `[C, A, B]`

#### Scenario: reorderProfiles is a no-op for same index
- **WHEN** `reorderProfiles(1, 1)` is called
- **THEN** the `profiles` array order is unchanged

#### Scenario: reorderProfiles does not change profile data
- **WHEN** `reorderProfiles(0, 1)` is called
- **THEN** all profile fields (id, name, mode, parameters) are identical before and after the call; only positions differ
