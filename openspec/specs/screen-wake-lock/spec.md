## Purpose

Defines the screen wake lock behaviour — keeping the device display on while GlowFrame is the active tab, and releasing the lock gracefully when the page is hidden or the app unmounts.

## Requirements

### Requirement: Acquire screen wake lock on mount
The system SHALL request a `screen` wake lock via `navigator.wakeLock.request('screen')` when the `useWakeLock` hook mounts, preventing the display from dimming while GlowFrame is active.

#### Scenario: Wake lock acquired on app load
- **WHEN** the app mounts and the Wake Lock API is available
- **THEN** `navigator.wakeLock.request('screen')` is called and a wake lock sentinel is held

### Requirement: Release wake lock on visibility lost
The system SHALL release the wake lock sentinel when the page becomes hidden (e.g., tab switch, window minimise).

#### Scenario: Wake lock released on tab hide
- **WHEN** `document.visibilityState` changes to `"hidden"`
- **THEN** the current wake lock sentinel's `release()` method is called

### Requirement: Re-acquire wake lock on visibility regained
The system SHALL re-request the wake lock when the page becomes visible again after a previous release.

#### Scenario: Wake lock re-acquired on tab focus
- **WHEN** `document.visibilityState` changes to `"visible"` after having been `"hidden"`
- **THEN** `navigator.wakeLock.request('screen')` is called again

### Requirement: Graceful degradation when API unavailable
The system SHALL NOT crash and SHALL NOT display a user-facing error when the Wake Lock API (`navigator.wakeLock`) is unavailable in the current browser.

#### Scenario: No crash on unsupported browser
- **WHEN** `'wakeLock' in navigator` is `false`
- **THEN** the app continues to function normally with no error thrown and no error UI shown

#### Scenario: No crash on permission error
- **WHEN** `navigator.wakeLock.request()` throws an error
- **THEN** the error is caught silently and the app continues to function normally

### Requirement: Wake lock released on unmount
The system SHALL release the wake lock sentinel when the hook's component unmounts.

#### Scenario: Wake lock released on component unmount
- **WHEN** the component using `useWakeLock` is unmounted
- **THEN** the held sentinel is released
