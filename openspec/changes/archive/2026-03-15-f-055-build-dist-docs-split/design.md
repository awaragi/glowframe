## Context

GlowFrame's `npm run build` currently writes compiled output directly to `docs/`, which is the directory tracked in git and served by GitHub Pages. This means every local build — including exploratory or CI builds — modifies the production deployment artifact. The change introduces a two-stage build: a standard Vite build to `dist/` and a separate promotion step that copies `dist/` to `docs/`.

**Current scripts:**
```
build       → tsc -b && vite build           (outDir: docs)
postbuild   → touch docs/.nojekyll
```

## Goals / Non-Goals

**Goals:**
- `npm run build` outputs to `dist/` (standard Vite default, safe for local use).
- `npm run build:prod` promotes `dist/` to `docs/` for GitHub Pages release.
- `prebuild:prod` automatically runs `npm run build` before the copy, ensuring `docs/` always reflects a fresh, complete build.
- `.nojekyll` is present in `docs/` after `npm run build:prod`.
- No additional npm dependencies are introduced.

**Non-Goals:**
- Changing the Vite `base` path (`/glowframe/`) — that stays the same.
- Setting up CI/CD automation — this remains a manual commit-and-push workflow.
- Cross-platform shell compatibility beyond macOS/Linux (project is macOS-only per README).

## Decisions

### Decision 1: `prebuild:prod` hook for automatic pre-step

**Choice:** Use npm lifecycle hook `prebuild:prod` to invoke `npm run build` automatically.

**Rationale:** npm runs `pre<script>` hooks before the named script without any extra tooling. This makes `npm run build:prod` self-contained — a developer only needs to remember one command for a release build. It also prevents a stale `dist/` being promoted if the developer forgets to build first.

**Alternatives considered:**
- Single script with `&&` chaining (`"build:prod": "npm run build && ..."`): works but is less idiomatic for npm script composition and duplicates the build invocation string.

### Decision 2: Copy using `rm -rf docs && cp -r dist/. docs`

**Choice:** Shell command `rm -rf docs && cp -r dist/. docs` in the `build:prod` script.

**Rationale:** No additional dependencies; macOS/Linux portable; clean slate prevents stale files accumulating in `docs/` across builds (e.g., old chunk hashes).

**Alternatives considered:**
- `rsync -a --delete dist/ docs/`: more precise but requires `rsync` (not always available in all environments).
- `cpy-cli` / `cpx`: adds a runtime or dev-dependency for a one-line operation.

### Decision 3: Move `.nojekyll` creation to `postbuild:prod`

**Choice:** Remove the existing `postbuild` hook (which created `docs/.nojekyll`) and add a `postbuild:prod` hook: `touch docs/.nojekyll`.

**Rationale:** After the split, `npm run build` outputs to `dist/`, not `docs/`, so a `postbuild` hook writing to `docs/` would be misleading. The `.nojekyll` file belongs in `docs/` and should only be created as part of the production promotion step. A `postbuild:prod` hook fires automatically after `build:prod` completes.

### Decision 4: `vite.config.ts` outDir changes to `"dist"`

**Choice:** Set `build.outDir: "dist"` (the Vite default).

**Rationale:** All tooling (Vite preview, PWA plugin, TypeScript) assumes `dist/` by default. Restoring the default reduces cognitive overhead for contributors unfamiliar with the custom `docs` override.

## Risks / Trade-offs

- **Risk:** Developer runs `npm run build` and expects to see `docs/` updated.  
  **Mitigation:** `README.md` release instructions clearly distinguish the two commands; `npm run build` is for local work, `npm run build:prod` is for release.

- **Risk:** `rm -rf docs` could accidentally delete something if the script is run from the wrong directory.  
  **Mitigation:** npm always runs scripts from the package root; the risk is negligible in normal usage.

- **Risk:** `docs/` may temporarily diverge from `dist/` if a developer commits `docs/` without running `build:prod`.  
  **Mitigation:** The `prebuild:prod` hook enforces a fresh build, and `docs/` contents are reviewed during standard `git diff` before committing.
