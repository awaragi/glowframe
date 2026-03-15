## Why

The current build pipeline writes output directly to `docs/`, conflating local dev/test builds with the production deployment folder. This makes it easy to accidentally commit a dev build (e.g., a wrong `base` path or unoptimised output) as a release. Separating the two stages aligns with standard Vite conventions and gives developers a safe local build target (`dist/`) that never touches the committed deployment artifact.

## What Changes

- `npm run build` outputs to `dist/` (unchanged from standard Vite defaults, used for local testing and CI validation).
- `npm run build:prod` is a new script that copies `dist/` to `docs/` recursively and is intended for production releases.
- A `prebuild:prod` hook in `package.json` automatically runs `npm run build` before the copy step.
- `vite.config.ts` `build.outDir` changes from `"docs"` to `"dist"`.
- `README.md` release instructions update to reference `npm run build:prod`.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `github-pages-dist`: Build workflow splits into two stages — `dist/` for local builds and `docs/` for production deployment. `npm run build` no longer writes to `docs/`; `npm run build:prod` (with pre-hook) does.

## Impact

- `vite.config.ts`: `build.outDir` `"docs"` → `"dist"`.
- `package.json`: add `prebuild:prod` and `build:prod` scripts.
- `README.md`: update release workflow section.
- `.gitignore`: `dist/` should remain ignored; `docs/` remains tracked.
