## Why

With F-100 and F-110 providing the full profile data model, users need a way to actually interact with their profiles and settings. Currently there is no UI to adjust any parameters — everything is hardcoded defaults. F-120 delivers the primary user-facing control surface: an always-accessible settings modal that lets users tune every light parameter in real time.

## What Changes

- A gear icon button is added, fixed to the top-right corner of the screen, visible at all times.
- Clicking the gear opens a shadcn/ui `Sheet` (slide-in panel) or `Dialog`.
- The modal contains the full settings UI:
  - Profile selector with create, rename, delete, and switch actions.
  - `lightColor` colour picker input.
  - `colorTemperature` slider (1000–10000 K).
  - `brightness` slider (0–100%).
  - `ringFormat` segmented control / select.
  - `innerRadius` and `outerRadius` sliders (conditionally visible for `"circle"` and `"border"` formats).
- All controls are wired to Zustand via `updateProfile` (and profile management actions); changes apply immediately with no save action.
- React Hook Form + Zod validates inputs; form values stay in sync with Zustand.
- The modal is closeable via ×, Escape, or outside click.

## Capabilities

### New Capabilities
- `settings-modal`: The gear icon trigger, modal container, and all controls that expose profile and light settings to the user.

### Modified Capabilities

## Impact

- `src/pages/LightPage.tsx` — mounts the GearButton and SettingsModal alongside `LightSurface`.
- New components: `src/components/SettingsModal.tsx` (modal shell + all form controls), `src/components/GearButton.tsx` (trigger button).
- `src/components/SettingsModal.test.tsx` — RTL unit tests for form controls, conditional radius sliders, profile operations.
- `e2e/` — Playwright scenario covering open/close, brightness change, profile create.
- No new runtime dependencies (shadcn/ui Sheet + Slider + Select are already in the component library).
