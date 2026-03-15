## Context

GlowFrame is a Vite + React 19 + TypeScript app hosted on GitHub Pages. The current setup builds to `dist/` but excludes it from version control, preventing GitHub Pages from serving the app directly from the repository without a CI pipeline. This change introduces a zero-CI release workflow: developers run `npm run build` locally and commit the resulting `dist/` folder.

## Goals / Non-Goals

**Goals:**
- Track `docs/` in git so GitHub Pages can serve from `docs/` on the `main` branch (GitHub Pages only supports `/` or `/docs` as publishing folders).
- Configure the Vite `base` option to `/glowframe/` and `build.outDir` to `docs` so the compiled output lands in the correct folder.
- Add `.nojekyll` to `docs/` to disable Jekyll processing.
- Document the build-and-commit workflow in `README.md`.

**Non-Goals:**
- Automated CI/CD deployment (no GitHub Actions workflows introduced).
- Custom domain setup (documented as optional, not implemented).
- Changing the source build toolchain or adding new dependencies.

## Decisions

### Decision: Output to `docs/` and commit to `main` (not a `gh-pages` branch)

**Choice:** Set Vite `build.outDir` to `docs`, remove `docs/` from `.gitignore`, and commit it to `main`.

**Rationale:** GitHub Pages only permits `/` (root) or `/docs` as the publishing folder when deploying from a branch — `/dist` is not a supported option. Using `docs/` is the path of least resistance: zero new tooling, no separate branch, and GitHub Pages serves it directly from `main`.

**Alternative considered:** A `gh-pages` orphan branch with `dist/` — rejected because it requires either `gh-pages` npm tooling or manual branch management, adding complexity without benefit at this project scale.

### Decision: Set `base` to `/glowframe/` in `vite.config.ts`

**Choice:** Hard-code the base path as `/glowframe/` matching the GitHub Pages repository sub-path.

**Rationale:** The repository is named `glowframe`, so GitHub Pages serves it at `https://<user>.github.io/glowframe/`. Vite's `base` option prepends this path to all generated asset URLs.

**Alternative considered:** Using an environment variable for `base` — deferred; one hard-coded path is sufficient now. If the project ever moves to a custom domain at the root, only `base` needs updating to `/`.

### Decision: Place `.nojekyll` inside `docs/` (generated, not manually maintained)

**Choice:** Add a `postbuild` npm script that touches `docs/.nojekyll` after every build.

**Rationale:** Ensures `.nojekyll` is always present after `npm run build`, requiring no manual step. The file is committed as part of `docs/`.

**Alternative considered:** Placing `.nojekyll` at the repo root — works for GitHub Pages, but the root-level file is unrelated to the Vite output and would be confusing in this project's structure.

## Risks / Trade-offs

- **Risk: `docs/` grows over time** → `docs/` is a compiled output and is regenerated entirely on each build; git history will accumulate build diffs. Mitigation: treat releases as intentional commits; squash if history bloat becomes an issue.
- **Risk: Developers forget to rebuild before committing** → Documented in `README.md`; a future CI step could enforce this. No automated guard is added now (out of scope).
- **Risk: Base path mismatch if repository is renamed** → Requires only changing `base` in `vite.config.ts` and rebuilding. Low friction, documented.
