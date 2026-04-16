## Purpose

TBD

## Requirements

### Requirement: Build-time version constant
The system SHALL inject the application version from `package.json` at build time as the Vite define constant `import.meta.env.VITE_APP_VERSION`, populated via `define: { 'import.meta.env.VITE_APP_VERSION': JSON.stringify(process.env.npm_package_version ?? 'unknown') }` in `vite.config.ts`. The constant SHALL be typed as `readonly VITE_APP_VERSION: string` in `src/vite-env.d.ts` (augmenting `ImportMetaEnv`). The value SHALL never be sourced from a runtime fetch or a committed `.env` file.

#### Scenario: Version constant is available at runtime
- **WHEN** the application is built with `npm run build` or served with `npm run dev`
- **THEN** `import.meta.env.VITE_APP_VERSION` resolves to the semver string from `package.json`

#### Scenario: Fallback when npm lifecycle variable is absent
- **WHEN** `process.env.npm_package_version` is undefined at build time
- **THEN** `import.meta.env.VITE_APP_VERSION` resolves to the string `"unknown"` rather than `undefined`
