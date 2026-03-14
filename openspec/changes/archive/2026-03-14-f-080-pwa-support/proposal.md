## Why

GlowFrame should be installable as a standalone app on phones and desktops so users can launch it directly from the home screen or taskbar without browser chrome. PWA support also enables full offline capability — once installed the light surface works without a network connection.

## What Changes

- Add `vite-plugin-pwa` to generate a service worker and `manifest.webmanifest` automatically at build time.
- Provide app icons (192 × 192 and 512 × 512 PNG) in `public/`.
- Configure the manifest with `display: standalone`, white background/theme, and correct `start_url` matching the Vite `base`.
- Register the service worker for offline caching of all built assets.

## Capabilities

### New Capabilities

- `pwa-installability`: The app provides a valid web app manifest and registered service worker so it meets browser installability criteria and passes a Lighthouse PWA audit.

### Modified Capabilities

<!-- none -->

## Impact

- `package.json` — add `vite-plugin-pwa` dev dependency.
- `vite.config.ts` — add `VitePWA` plugin with manifest and workbox config.
- `public/` — add `icon-192.png` and `icon-512.png` (placeholder/generated icons).
- `docs/` (build output) — will include generated `manifest.webmanifest`, `sw.js`, and icon assets.
- No changes to `src/` application code required.
