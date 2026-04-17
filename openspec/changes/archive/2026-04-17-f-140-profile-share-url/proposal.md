## Why

GlowFrame profiles are currently device-local with no way to share a configuration with another person. A user who sets up a perfect ring light for a video call has no way to hand that config to a colleague — they must recreate it manually. URL-based sharing is a zero-friction, zero-install solution that works in any context (message, email, QR code).

## What Changes

- Add a **"Copy share link"** button at the bottom of the settings modal that serialises the active profile into a `?profile=` URL query parameter and copies it to the clipboard.
- On app load, if a `?profile=` parameter is present: decode, validate, and show a confirmation dialog offering to import it as a new named profile.
- On successful import, clean the URL parameter via `history.replaceState` and show a success toast.
- On failed validation, show an error toast and leave the URL unchanged so the user can inspect it.
- Invalid or tampered parameters never crash the app.

## Capabilities

### New Capabilities
- `profile-share`: Encode/decode a profile to/from a URL query parameter (`?profile=`), validate with Zod, and offer the user a confirmation dialog to import it as a new named preset. Includes share button in settings modal, import dialog on load, URL auto-clean on success, and toast feedback.

### Modified Capabilities
<!-- No existing spec-level requirements are changing -->

## Impact

- **`src/lib/profileShare.ts`** — new encode/decode utility + Zod schema for all 6 profile modes
- **`src/components/SettingsModal.tsx`** — new "Copy share link" button in sheet footer
- **`src/components/ImportProfileDialog.tsx`** — new confirmation dialog shown on load
- **`src/pages/LightPage.tsx`** — wires URL param detection and dialog state
- **`src/store/index.ts`** — uses existing `createProfile` action; no changes needed
- No new dependencies required (`encodeURIComponent`/`decodeURIComponent` are native)
