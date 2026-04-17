## Why

The ring and border light modes require two radius values (`innerRadius` and `outerRadius`) to define their geometry, but currently the app allows `innerRadius >= outerRadius`, which produces invisible or inverted light shapes without any warning. This cross-validation is missing at both the schema and UI levels, meaning broken settings can silently persist to `localStorage`.

## What Changes

- Add a Zod `.refine()` rule to the profile settings schema that rejects configurations where `innerRadius >= outerRadius` when `ringFormat` is `"circle"` or `"border"`.
- Update the settings modal to display a clear inline validation error adjacent to the radius sliders when the constraint is violated.
- Prevent React Hook Form from persisting invalid radius combinations to Zustand; the last valid store state is retained until the user resolves the conflict.
- Add unit tests covering valid pairs, boundary violations (equal values), and the Zod refinement error message.
- Add an E2E scenario verifying the error appears and settings are not corrupted when equal radii are set.

## Capabilities

### New Capabilities

- `ring-radius-validation`: Cross-validation constraint enforcing `innerRadius < outerRadius` for ring/border modes — covers Zod schema refinement, React Hook Form validation gating, and inline UI error display.

### Modified Capabilities

- `profile-settings`: The profile settings schema gains a cross-object `.refine()` rule; the `innerRadius` and `outerRadius` fields are now subject to a conditional relationship constraint when `ringFormat` is `"circle"` or `"border"`.
- `settings-modal`: The radius sliders section gains an inline error message slot that surfaces the cross-validation failure and prevents the invalid pair from being written to the store.

## Impact

- `src/store/` — profile Zod schema updated with `.refine()` rule.
- `src/components/mode-settings/` — radius slider UI updated to show validation error.
- `src/components/SettingsModal.tsx` — form submission gated by cross-validation result.
- No new dependencies required.
- No breaking changes to the stored data format; existing profiles remain valid (any stored pair where `innerRadius < outerRadius` is already correct).
