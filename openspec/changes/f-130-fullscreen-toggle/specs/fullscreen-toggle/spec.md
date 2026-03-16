## ADDED Requirements

### Requirement: Fullscreen toggle hook
The system SHALL provide a `useFullscreen` hook that returns `{ isFullscreen: boolean, isAvailable: boolean, toggle: () => void }`. When `document.fullscreenEnabled` is `false` or absent, `isAvailable` SHALL be `false` and `toggle` SHALL be a no-op. The hook SHALL listen to the `fullscreenchange` event on `document` to keep `isFullscreen` in sync with the actual browser fullscreen state.

#### Scenario: isAvailable is false when API unsupported
- **WHEN** `document.fullscreenEnabled` is `false` or the property does not exist
- **THEN** `isAvailable` is `false` and calling `toggle` performs no action and throws no error

#### Scenario: toggle enters fullscreen
- **WHEN** `isAvailable` is `true` and `isFullscreen` is `false`
- **WHEN** `toggle` is called
- **THEN** `document.documentElement.requestFullscreen()` is invoked

#### Scenario: toggle exits fullscreen
- **WHEN** `isAvailable` is `true` and `isFullscreen` is `true`
- **WHEN** `toggle` is called
- **THEN** `document.exitFullscreen()` is invoked

#### Scenario: isFullscreen updates on fullscreenchange event
- **WHEN** the browser fires a `fullscreenchange` event on `document`
- **THEN** `isFullscreen` reflects whether `document.fullscreenElement` is non-null

#### Scenario: toggle swallows errors silently
- **WHEN** `requestFullscreen` or `exitFullscreen` rejects (e.g., called outside a user gesture)
- **THEN** no unhandled promise rejection is thrown and no error is displayed to the user

### Requirement: Fullscreen toggle button
The system SHALL render a `FullscreenButton` component only when `isAvailable` is `true`. When rendered, it SHALL be a `<button>` element fixed at `top-4 right-16 z-50` with an `aria-label` that reflects the current state. The button SHALL display a `Maximize2` icon when not in fullscreen and a `Minimize2` icon when in fullscreen.

#### Scenario: Button hidden when Fullscreen API unavailable
- **WHEN** `isAvailable` is `false`
- **THEN** no fullscreen button element is present in the DOM

#### Scenario: Button shows expand icon when not in fullscreen
- **WHEN** `isAvailable` is `true` and `isFullscreen` is `false`
- **THEN** the button renders with `aria-label="Enter fullscreen"` and the `Maximize2` icon

#### Scenario: Button shows compress icon when in fullscreen
- **WHEN** `isAvailable` is `true` and `isFullscreen` is `true`
- **THEN** the button renders with `aria-label="Exit fullscreen"` and the `Minimize2` icon

#### Scenario: Button click toggles fullscreen
- **WHEN** the fullscreen button is clicked
- **THEN** `toggle` is called

### Requirement: Fullscreen keyboard shortcut
The system SHALL toggle fullscreen when the user presses `F` (case-insensitive) and the focused element is not an `<input>`, `<textarea>`, or element with `contenteditable`. The shortcut SHALL be a no-op when `isAvailable` is `false`.

#### Scenario: F key toggles fullscreen from light surface
- **WHEN** no text input has focus and the user presses the `F` key
- **THEN** `toggle` is called

#### Scenario: F key does not toggle fullscreen from text input
- **WHEN** an `<input>` or `<textarea>` has focus and the user presses the `F` key
- **THEN** `toggle` is NOT called

#### Scenario: F key is a no-op when API unavailable
- **WHEN** `isAvailable` is `false` and the user presses the `F` key
- **THEN** no action is taken and no error is thrown
