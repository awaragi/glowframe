## 1. Install dependency

- [x] 1.1 Run `npm install -D vite-plugin-pwa` to add the plugin

## 2. Add icons

- [x] 2.1 Create a 192 × 192 white PNG placeholder icon at `public/icon-192.png`
- [x] 2.2 Create a 512 × 512 white PNG placeholder icon at `public/icon-512.png`

## 3. Configure vite-plugin-pwa

- [x] 3.1 Import `VitePWA` from `vite-plugin-pwa` in `vite.config.ts`
- [x] 3.2 Add `VitePWA` to the `plugins` array with `registerType: 'autoUpdate'`, `strategies: 'generateSW'`, manifest fields (`name: "GlowFrame"`, `short_name: "GlowFrame"`, `description`, `theme_color: "#ffffff"`, `background_color: "#ffffff"`, `display: "standalone"`, `start_url: "."`, icons array referencing the two PNG files), and `workbox: { globPatterns: ['**/*.{js,css,html,png,svg,ico}'] }`
- [x] 3.3 Ensure `includeAssets` references the icon files so they are included in the precache manifest

## 4. Verify build output

- [x] 4.1 Run `npm run build` and confirm `docs/manifest.webmanifest` is generated
- [x] 4.2 Confirm `docs/sw.js` (or equivalent Workbox output) is present in the build output
- [x] 4.3 Confirm both icon PNG files appear in `docs/`

## 5. Verify tests

- [x] 5.1 Run `npm run test` and confirm all unit tests still pass (plugin should not affect unit tests)
- [x] 5.2 Run `npm run test:e2e` and confirm all E2E tests still pass
