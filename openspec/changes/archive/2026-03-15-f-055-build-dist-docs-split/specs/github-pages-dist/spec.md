## MODIFIED Requirements

### Requirement: docs/ is tracked in version control
The repository SHALL track the `docs/` directory in git. The `.gitignore` file MUST NOT contain an entry that excludes `docs/` or its contents. Vite's `build.outDir` SHALL be set to `dist` (the Vite default). The `docs/` directory SHALL only be updated by running `npm run build:prod`.

#### Scenario: docs/ is committed to main branch
- **WHEN** a developer runs `git status` after `npm run build:prod`
- **THEN** the `docs/` directory and its contents appear as tracked files (not ignored)

#### Scenario: npm run build does not modify docs/
- **WHEN** a developer runs `npm run build` (without `:prod`)
- **THEN** the `dist/` directory is updated and `docs/` is NOT modified

---

### Requirement: .nojekyll file present in docs/
The `docs/` directory SHALL contain a `.nojekyll` file so GitHub Pages does not apply Jekyll processing to the build output. The file SHALL be created by the `postbuild:prod` lifecycle hook, not by `postbuild`.

#### Scenario: .nojekyll exists after build:prod
- **WHEN** `npm run build:prod` completes
- **THEN** `docs/.nojekyll` exists as a zero-byte or empty file

---

### Requirement: Build-and-commit workflow documented in README
The `README.md` SHALL contain a section explaining the two-stage release workflow: run `npm run build:prod` (which automatically runs `npm run build` first via `prebuild:prod`), commit the updated `docs/`, and push to `main`. The section SHALL clearly distinguish between `npm run build` (local/dev output to `dist/`) and `npm run build:prod` (production promotion to `docs/`).

#### Scenario: README contains updated release instructions
- **WHEN** a contributor reads `README.md`
- **THEN** they can find a section that describes `npm run build:prod` as the release command and `dist/` as the local build target

---

## ADDED Requirements

### Requirement: npm run build:prod promotes dist/ to docs/
A `build:prod` script SHALL exist in `package.json` that copies the contents of `dist/` to `docs/` recursively. A `prebuild:prod` hook SHALL automatically invoke `npm run build` before the copy executes, ensuring `docs/` always reflects a fresh, complete build. The copy operation SHALL first remove `docs/` to avoid accumulating stale assets across builds.

#### Scenario: build:prod runs build automatically
- **WHEN** a developer runs `npm run build:prod`
- **THEN** `npm run build` executes first (via `prebuild:prod`) before any copy takes place

#### Scenario: docs/ matches dist/ after build:prod
- **WHEN** `npm run build:prod` completes
- **THEN** the contents of `docs/` are identical to the contents of `dist/`

#### Scenario: stale assets are removed from docs/
- **WHEN** `npm run build:prod` is run after a previous build that produced different chunk filenames
- **THEN** `docs/` contains only the files from the current `dist/` build (no leftover files from prior builds)
