## Why

GlowFrame needs to be publicly accessible via GitHub Pages without requiring a CI/CD pipeline. Committing the compiled `dist/` output directly to the repository allows GitHub Pages to serve the app immediately from the `main` branch, keeping the release process simple and within the developer's control.

## What Changes

- Remove `dist/` from `.gitignore` so the production build is tracked by git.
- Add a `.nojekyll` file inside `dist/` to prevent GitHub Pages from applying Jekyll processing.
- Configure Vite's `base` option to match the GitHub Pages sub-path (`/glowframe/`) so all asset URLs resolve correctly.
- Document the build-and-commit release workflow in `README.md`.
- Provide guidance for optional `CNAME` placement in `dist/` for custom domain support.

## Capabilities

### New Capabilities
- `github-pages-dist`: Configuration and workflow for serving the committed `docs/` build via GitHub Pages, including Vite `outDir`/base-path setup, `.nojekyll` file, and developer release documentation.

### Modified Capabilities
<!-- No existing spec-level requirements are changing. -->

## Impact

- **`vite.config.ts`**: `base` option set to `/glowframe/`; `build.outDir` set to `docs`.
- **`.gitignore`**: `dist/` entry restored (ignored); `docs/` entry removed so the build output is tracked.
- **`docs/.nojekyll`**: Added as a committed file (generated via `npm run build` postbuild script).
- **`README.md`**: New section describing the build-and-commit release workflow.
- No runtime code changes; no new dependencies.
