## Why

GlowFrame is used as a fill light during video calls and recordings. Without a Screen Wake Lock, the device screen will dim and eventually turn off after the idle timeout — defeating the app's core purpose. Implementing the Wake Lock API ensures the display stays on for the duration of use.

## What Changes

- Introduce a `useWakeLock` custom hook that requests, releases, and re-acquires a `screen` wake lock automatically based on document visibility.
- Mount the hook in the app's root so the lock is active whenever GlowFrame is the foreground tab.
- Handle environments where the Wake Lock API is unavailable (e.g., Safari before 16.4, some Android browsers) without crashing or showing user-facing errors.

## Capabilities

### New Capabilities

- `screen-wake-lock`: A custom hook that manages the `navigator.wakeLock` lifecycle — acquire on mount/visibility-gained, release on visibility-lost/unmount, re-acquire on visibility-regained.

### Modified Capabilities

<!-- none -->

## Impact

- `src/hooks/useWakeLock.ts` — new hook (new file/folder).
- `src/App.tsx` — call `useWakeLock()` inside the component so it activates at the root level.
- No new runtime dependencies — uses the native Web API.
- Unit test required: `src/hooks/useWakeLock.test.ts` with mocked `navigator.wakeLock`.
