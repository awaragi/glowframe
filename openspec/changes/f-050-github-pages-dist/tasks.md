## 1. Repository Configuration

- [ ] 1.1 Remove `dist/` (and any `dist/**` variants) from `.gitignore` so the build output is tracked by git
- [ ] 1.2 Verify `.gitignore` still excludes `node_modules/`, `coverage/`, and other non-committed artefacts

## 2. Vite Base Path

- [ ] 2.1 Set `base: '/glowframe/'` in `vite.config.ts`
- [ ] 2.2 Run `npm run build` and confirm all asset `src`/`href` values in `dist/index.html` begin with `/glowframe/`

## 3. .nojekyll File

- [ ] 3.1 Add a `postbuild` npm script in `package.json` that creates `dist/.nojekyll` (e.g., `"postbuild": "touch dist/.nojekyll"`)
- [ ] 3.2 Run `npm run build` and verify `dist/.nojekyll` exists

## 4. Initial dist/ Commit

- [ ] 4.1 Run `npm run build` to generate a fresh `dist/` with the correct base path and `.nojekyll`
- [ ] 4.2 Stage and commit `dist/` to the repository

## 5. README Documentation

- [ ] 5.1 Add a "Deployment / Release" section to `README.md` explaining the build-and-commit workflow
- [ ] 5.2 Document the optional `CNAME` file placement in `dist/` for custom domain support
- [ ] 5.3 Note that changing the base path requires only editing `base` in `vite.config.ts` and rebuilding
