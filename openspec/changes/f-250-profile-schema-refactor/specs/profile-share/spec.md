## MODIFIED Requirements

### Requirement: Encode active profile to shareable URL
The system SHALL serialize the active profile's settings — `name`, `light` (the full `LightConfig` sub-object), and `clock` (the full `ClockConfig` sub-object) — excluding `id`, into a URL query parameter `?profile=` using `JSON.stringify` + `encodeURIComponent`. The resulting URL SHALL be the current page URL with the parameter appended.

#### Scenario: Share button copies link to clipboard
- **WHEN** the user clicks "Copy share link" in the settings modal footer
- **THEN** the current URL with `?profile=<encoded-settings>` is written to the clipboard

#### Scenario: Share encodes all 6 profile modes correctly
- **WHEN** the active profile is any of the 6 modes (full, full-color, ring, ring-color, spot, spot-color)
- **THEN** the encoded parameter contains `name`, `light` (with `mode` and all mode-specific fields), and `clock`, but no `id` field

### Requirement: Decode and validate incoming profile URL parameter
On app load, the system SHALL detect a `?profile=` query parameter, decode it with `decodeURIComponent` + `JSON.parse`, and validate the result against a Zod schema of shape `{ name, light: <discriminated union by mode>, clock: ClockConfig }`. The `light` field SHALL use a `z.discriminatedUnion('mode', [...])` covering all 6 profile modes. URL parameters encoded in the old flat format (pre-F-250) SHALL fail validation and be treated as malformed input.

#### Scenario: Valid parameter triggers import dialog
- **WHEN** the app loads with a valid `?profile=` URL parameter in the new nested format
- **THEN** an import confirmation dialog is shown before any profile is added to the store

#### Scenario: Invalid parameter shows error toast and leaves URL unchanged
- **WHEN** the app loads with a malformed or tampered `?profile=` URL parameter (including old flat-format parameters)
- **THEN** an error toast is displayed and the URL query parameter is NOT removed

#### Scenario: Missing parameter is a no-op
- **WHEN** the app loads without a `?profile=` URL parameter
- **THEN** no dialog is shown and no toast is displayed
