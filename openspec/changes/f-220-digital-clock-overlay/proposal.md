## Why

GlowFrame is used during video calls and recordings where time awareness matters — users currently have no way to see the time without breaking their setup to check a phone or another screen. Adding a corner-pinned digital clock overlay gives users a glanceable time reference without leaving the app, completing the "studio-ready display" experience. This is a low-complexity, high-utility addition that builds naturally on the existing per-profile settings architecture.

## What Changes

- A new `ClockOverlay` component renders a live digital clock as a fixed overlay on the light surface.
- The clock position, size, format, and visibility are all per-profile settings, persisted in `localStorage` via Zustand.
- The settings modal gains a two-tab layout: **Tab 1 — Light** (existing controls, unchanged) and **Tab 2 — Clock** (new clock controls).
- The profile settings schema is extended with four new clock fields: `clockEnabled`, `clockPosition`, `clockSize`, `clockFormat`.
- The profile schema is extended with four new clock fields; defaults are applied to new profiles only (no migration of existing data).
- Top-right corner is excluded from available clock positions to avoid conflict with the application button cluster (gear, fullscreen, share, help).

## Capabilities

### New Capabilities

- `clock-overlay`: Live digital clock component rendered as a fixed overlay on the light surface, with configurable position, size, format, and show/hide toggle. Includes a `useClockTime` hook that ticks every second and returns a formatted time string.

### Modified Capabilities

- `profile-settings`: Profile type gains four new fields — `clockEnabled: boolean`, `clockPosition: 'top-left' | 'bottom-left' | 'bottom-right'`, `clockSize: 'small' | 'medium' | 'large'`, `clockFormat: 'HH:mm' | 'HH:mm:ss' | 'hh:mm a' | 'hh:mm:ss a'`. Defaults are applied to new profiles only; no store schema version bump or migration.
- `settings-modal`: The modal content area gains a Radix UI `Tabs` structure. Existing light controls move verbatim into Tab 1 (Light). Tab 2 (Clock) hosts the new clock controls. Profile management panel remains above the tab bar, always visible.

## Impact

- **New files**: `src/components/ClockOverlay.tsx`, `src/components/ClockOverlay.test.tsx`, `src/hooks/useClockTime.ts`, `src/hooks/useClockTime.test.ts`, `e2e/clock-overlay.spec.ts`
- **Modified files**: `src/store/` (profile type, `_defaultProfile`), `src/components/SettingsModal.tsx` (tab layout), `src/components/SettingsModal.test.tsx`
- **Dependencies**: `@base-ui/react/tabs` (already installed); no new packages required
- **No migration**: Clock fields are additive and default to off; existing stored data is not upgraded
