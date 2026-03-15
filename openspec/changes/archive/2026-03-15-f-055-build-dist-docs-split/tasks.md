## 1. Vite Configuration

- [x] 1.1 Change `build.outDir` from `"docs"` to `"dist"` in `vite.config.ts`

## 2. Package Scripts

- [x] 2.1 Remove the `postbuild` hook (`touch docs/.nojekyll`) from `package.json`
- [x] 2.2 Add `prebuild:prod` script: `"npm run build"` in `package.json`
- [x] 2.3 Add `build:prod` script: `"rm -rf docs && cp -r dist/. docs"` in `package.json`
- [x] 2.4 Add `postbuild:prod` script: `"touch docs/.nojekyll"` in `package.json`

## 3. README Update

- [x] 3.1 Update the release workflow section in `README.md` to reference `npm run build:prod` and explain the `dist/` (local) vs `docs/` (production) distinction

## 4. Rebuild docs/

- [x] 4.1 Run `npm run build:prod` to regenerate `docs/` from the updated configuration and verify `docs/` contents are correct
