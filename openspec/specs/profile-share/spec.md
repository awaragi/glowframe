# Spec: Profile Share URL

## Purpose

Enable users to share a GlowFrame lighting profile via a URL. The active profile's settings are encoded into a `?profile=` query parameter that can be copied to the clipboard and shared. On app load, an incoming `?profile=` parameter triggers a validation and import confirmation flow.

---

## Requirements

### Requirement: Encode active profile to shareable URL
The system SHALL serialize the active profile's settings (excluding `id`) into a URL query parameter `?profile=` using `JSON.stringify` + `encodeURIComponent`. The resulting URL SHALL be the current page URL with the parameter appended.

#### Scenario: Share button copies link to clipboard
- **WHEN** the user clicks "Copy share link" in the settings modal footer
- **THEN** the current URL with `?profile=<encoded-settings>` is written to the clipboard

#### Scenario: Share encodes all 6 profile modes correctly
- **WHEN** the active profile is any of the 6 modes (full, full-color, ring, ring-color, spot, spot-color)
- **THEN** the encoded parameter contains the mode discriminant and all mode-specific fields, but no `id` field

### Requirement: Decode and validate incoming profile URL parameter
On app load, the system SHALL detect a `?profile=` query parameter, decode it with `decodeURIComponent` + `JSON.parse`, and validate the result against a Zod discriminated-union schema covering all 6 profile modes.

#### Scenario: Valid parameter triggers import dialog
- **WHEN** the app loads with a valid `?profile=` URL parameter
- **THEN** an import confirmation dialog is shown before any profile is added to the store

#### Scenario: Invalid parameter shows error toast and leaves URL unchanged
- **WHEN** the app loads with a malformed or tampered `?profile=` URL parameter
- **THEN** an error toast is displayed and the URL query parameter is NOT removed

#### Scenario: Missing parameter is a no-op
- **WHEN** the app loads without a `?profile=` URL parameter
- **THEN** no dialog is shown and no toast is displayed

### Requirement: Import confirmation dialog
The system SHALL present a Radix UI Dialog asking the user to confirm or dismiss the incoming profile import. The dialog SHALL display the incoming profile's name and mode.

#### Scenario: User confirms import
- **WHEN** the user clicks "Import" in the confirmation dialog
- **THEN** the profile is added to the store with a new generated `id`, set as the active profile, the `?profile=` parameter is removed from the URL via `history.replaceState`, and a success toast is shown

#### Scenario: User dismisses import dialog
- **WHEN** the user clicks "Dismiss" (or presses Escape, or clicks outside) in the confirmation dialog
- **THEN** the profile is NOT added to the store, the `?profile=` parameter is removed from the URL via `history.replaceState`, and no toast is shown

### Requirement: URL auto-clean on action
The system SHALL remove the `?profile=` parameter from the URL using `history.replaceState` only after the user takes an explicit action (import or dismiss). On validation failure, the URL SHALL remain unchanged.

#### Scenario: URL is clean after import
- **WHEN** the user confirms the import
- **THEN** the browser address bar no longer shows the `?profile=` parameter

#### Scenario: URL is clean after dismiss
- **WHEN** the user dismisses the import dialog
- **THEN** the browser address bar no longer shows the `?profile=` parameter

#### Scenario: URL remains dirty on invalid param
- **WHEN** the app loads with a `?profile=` parameter that fails Zod validation
- **THEN** the URL parameter is still present in the address bar after the error toast is shown
