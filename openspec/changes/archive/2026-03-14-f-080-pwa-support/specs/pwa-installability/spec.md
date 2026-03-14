## ADDED Requirements

### Requirement: Valid web app manifest
The app SHALL provide a `manifest.webmanifest` with `name`, `short_name`, `display: "standalone"`, `background_color: "#ffffff"`, `theme_color: "#ffffff"`, `start_url`, and icons of at least 192 × 192 and 512 × 512.

#### Scenario: Manifest is present in build output
- **WHEN** `npm run build` completes
- **THEN** a `manifest.webmanifest` file exists in the `docs/` output directory containing all required fields

### Requirement: Registered service worker for offline capability
The app SHALL register a service worker that precaches all built assets, enabling full offline use after first load.

#### Scenario: App loads offline after first visit
- **WHEN** the user has visited the app at least once and is subsequently offline
- **THEN** the app loads successfully from the service worker cache with no network errors

### Requirement: Standalone display mode
The installed app SHALL open without browser navigation chrome (address bar, tab bar) when launched from the home screen or taskbar.

#### Scenario: Installed app opens as standalone
- **WHEN** the app is installed and launched from the home screen
- **THEN** it opens in standalone mode with no browser chrome visible

### Requirement: Installability criteria met
The app SHALL pass all Lighthouse PWA installability checks (valid manifest, registered service worker, HTTPS or localhost).

#### Scenario: Lighthouse PWA audit passes
- **WHEN** a Lighthouse audit is run against the deployed app
- **THEN** all PWA installability criteria pass with no critical failures
