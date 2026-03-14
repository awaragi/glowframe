## Context

GlowFrame is a display-lighting utility that users will access directly from their home screen or taskbar. Without PWA support it requires a browser and URL — adding friction. `vite-plugin-pwa` integrates with the existing Vite build pipeline and generates both the service worker and manifest with minimal configuration. The `docs/` output folder is the GitHub Pages build artifact; the PWA assets land there automatically on every `npm run build`.

## Goals / Non-Goals

**Goals:**
- Pass all Lighthouse PWA installability checks.
- Enable offline use after first load.
- Configure `start_url` and `scope` to work correctly under the `/glowframe/` GitHub Pages sub-path.
- Provide square PNG icons at 192 × 192 and 512 × 512.

**Non-Goals:**
- Push notifications or background sync.
- Custom service worker logic beyond asset caching.
- iOS splash screens or proprietary meta tags.

## Decisions

### `vite-plugin-pwa` with `generateSW` strategy

**Decision:** Use `vite-plugin-pwa` with `strategies: 'generateSW'` (the default) and Workbox `precacheAndRoute`.

**Rationale:** The app has no custom service worker logic — only asset caching is needed. `generateSW` handles this with near-zero configuration.

**Alternatives considered:**
- *`injectManifest` strategy* — needed only when custom SW logic is required; over-engineered for this use case.
- *Manual `manifest.webmanifest` + `sw.js`* — more maintenance burden, easy to get wrong.

### `registerType: 'autoUpdate'`

**Decision:** Use `registerType: 'autoUpdate'` so the service worker updates silently in the background.

**Rationale:** GlowFrame has no user data to lose on a silent update. Forcing a user prompt to reload is unnecessary complexity. Silent updates ensure users always get the latest version without action.

### Icon generation via sharp / placeholder PNGs

**Decision:** Place placeholder 192 × 192 and 512 × 512 white PNG icons in `public/`. A follow-up can supply branded icons.

**Rationale:** The spec requires installability, not final branding. Placeholder icons unblock PWA testing immediately; real icons can be added without a new change.

### `start_url` and `scope` relative to `BASE_URL`

**Decision:** Set `start_url: '.'` and `scope: './'` in the manifest so they resolve relative to the GitHub Pages base path.

**Rationale:** Hardcoding `/glowframe/` would break local dev and any future custom domain migration. Relative values work in both contexts.

## Risks / Trade-offs

- [Service worker caches stale assets after failed build] → `autoUpdate` ensures the SW is replaced on next successful build visit.
- [Placeholder icons look unstyled] → Acceptable for v1; tracked for follow-up in REQUIREMENTS.md if needed.

## Open Questions

<!-- none -->
