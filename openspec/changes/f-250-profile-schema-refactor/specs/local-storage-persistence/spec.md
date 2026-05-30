## MODIFIED Requirements

### Requirement: Schema version tracked in persist options
The `persist` middleware SHALL use `version: 5` as its schema version identifier. No `migrate` function is provided — any persisted state from an earlier version is discarded on load and the store initialises from the default profile.

#### Scenario: Version field present in persisted data
- **WHEN** the store writes to localStorage
- **THEN** the stored object includes a version key equal to `5`

#### Scenario: Old version data triggers clean initialisation
- **WHEN** the store loads with localStorage data whose version is less than `5`
- **THEN** `profiles` contains exactly one entry named `'Default'` (the seeded default), as if no prior state existed
