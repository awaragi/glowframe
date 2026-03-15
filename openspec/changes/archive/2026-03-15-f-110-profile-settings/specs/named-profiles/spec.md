## MODIFIED Requirements

### Requirement: Profile data type
The system SHALL define a `Profile` type with fields: `id` (UUID string), `name` (string, max 64 characters), `lightColor` (hex string), `brightness` (integer 0–100), `colorTemperature` (integer 1000–10000), `ringFormat` (`"full" | "circle" | "border"`), `innerRadius` (integer 0–100), and `outerRadius` (integer 0–100).

#### Scenario: Profile has all required fields
- **WHEN** a profile object is created
- **THEN** it contains `id`, `name`, `lightColor`, `brightness`, `colorTemperature`, `ringFormat`, `innerRadius`, and `outerRadius` with the correct types

### Requirement: Default profile on first launch
The system SHALL seed a single profile named "Default" with `lightColor: "#ffffff"`, `brightness: 100`, `colorTemperature: 6500`, `ringFormat: "full"`, `innerRadius: 0`, and `outerRadius: 100` when no prior localStorage state exists.

#### Scenario: First launch seeds default profile with all fields
- **WHEN** the app loads with no prior localStorage state
- **THEN** `profiles` contains exactly one entry named "Default" and all extended fields are initialised to their defaults
