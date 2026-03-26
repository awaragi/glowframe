## Why

GlowFrame is used as a fill light during video calls and recordings, where native browser chrome distracts from the light output. A fullscreen mode maximises the light surface area and removes all browser UI, making the app more effective in its core use case.

## What Changes

- Add a `useFullscreen` custom hook encapsulating the Fullscreen API (request, exit, state detection, availability guard).
- Add a `FullscreenButton` component fixed in the top-right corner beside the existing gear icon.
- Icon reflects current state: expand icon when not in fullscreen, compress icon when in fullscreen.
- Add a keyboard shortcut (`F`) that toggles fullscreen when focus is not in a text input.
- Gracefully no-op in environments where the Fullscreen API is unavailable (e.g., iOS Safari).

## Capabilities

### New Capabilities
- `fullscreen-toggle`: Fullscreen API hook and toggle button — request/exit fullscreen, reactive state, availability guard, keyboard shortcut.

### Modified Capabilities

_(none — no existing spec-level requirements are changing)_

## Impact

- **New files:** `src/hooks/useFullscreen.ts`, `src/components/FullscreenButton.tsx`, unit tests for both.
- **Modified files:** `src/pages/LightPage.tsx` (or equivalent container) to mount `FullscreenButton` alongside the gear button.
- **E2E tests:** new Playwright scenario covering fullscreen toggle button visibility and keyboard shortcut.
- **Dependencies:** no new npm packages required; uses browser-native Fullscreen API.
