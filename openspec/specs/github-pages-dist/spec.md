# GitHub Pages Distribution

## Purpose

Defines the requirements for building and deploying GlowFrame to GitHub Pages via a committed `docs/` output directory and correct Vite base-path configuration.

## Requirements

### Requirement: docs/ is tracked in version control
The repository SHALL track the `docs/` directory in git. The `.gitignore` file MUST NOT contain an entry that excludes `docs/` or its contents. Vite's `build.outDir` SHALL be set to `docs`.

#### Scenario: docs/ is committed to main branch
- **WHEN** a developer runs `git status` after `npm run build`
- **THEN** the `docs/` directory and its contents appear as tracked files (not ignored)

---

### Requirement: Vite base path matches GitHub Pages sub-path
The Vite configuration SHALL set `base` to `/glowframe/` so that all generated asset URLs are prefixed with the repository sub-path.

#### Scenario: Built assets reference the correct sub-path
- **WHEN** `npm run build` completes
- **THEN** all `<script src="...">` and `<link href="...">` entries in `dist/index.html` begin with `/glowframe/`

#### Scenario: App loads correctly at the Pages URL
- **WHEN** a browser navigates to `https://<user>.github.io/glowframe/`
- **THEN** the application loads without 404 errors for any asset

---

### Requirement: .nojekyll file present in docs/
The `docs/` directory SHALL contain a `.nojekyll` file so GitHub Pages does not apply Jekyll processing to the build output.

#### Scenario: .nojekyll exists after build
- **WHEN** `npm run build` completes
- **THEN** `docs/.nojekyll` exists as a zero-byte or empty file

---

### Requirement: Build-and-commit workflow documented in README
The `README.md` SHALL contain a section explaining the release workflow: run `npm run build`, commit the updated `docs/`, and push to `main`.

#### Scenario: README contains release instructions
- **WHEN** a contributor reads `README.md`
- **THEN** they can find a section that describes how to build and commit `docs/` to publish a new release

---

### Requirement: Future base path change requires only a single config edit
The implementation SHALL be structured so that changing the deployment sub-path (or moving to a root-level custom domain) requires only editing `base` in `vite.config.ts` and rebuilding — no other source file changes.

#### Scenario: Changing base path to root
- **WHEN** a developer changes `base` from `/glowframe/` to `/` in `vite.config.ts` and runs `npm run build`
- **THEN** all asset URLs in `dist/index.html` are prefixed with `/` and no other source files require modification
