## Why

GlowFrame's core purpose is to fill a screen with a customizable light surface. Without this feature the app is an empty shell — implementing the full-viewport fill light is the first step toward a usable product.

## What Changes

- Add a full-viewport light display surface that fills 100 vw × 100 vh with no scrollbars or visible chrome.
- Introduce a Zustand store that holds the active profile's `lightColor` and `brightness` settings.
- Derive and apply a CSS background color from `lightColor` and `brightness` in real time.
- Route the root path (`/`) to the new light display page.
- Remove or replace the existing placeholder `ConfigPage` / `App` content.

## Capabilities

### New Capabilities

- `core-light-display`: Full-viewport light surface component whose background color is derived from `lightColor` and `brightness`, re-renders immediately on any settings change, and leaves no visible scrollbars or UI chrome.

### Modified Capabilities

<!-- none — no existing spec requirements are changing -->

## Impact

- `src/App.tsx` — replaced with the light display route.
- `src/pages/` — new `LightPage` component added; `ConfigPage` removed or repurposed.
- `src/store/index.ts` — extended with `lightColor` and `brightness` state and updater actions.
- `src/components/` — new `LightSurface` component added.
- Tailwind config — no changes required; utility classes sufficient.
- No new runtime dependencies.
