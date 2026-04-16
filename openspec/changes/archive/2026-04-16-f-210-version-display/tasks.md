## 1. Build Configuration

- [x] 1.1 Add `define: { 'import.meta.env.VITE_APP_VERSION': JSON.stringify(process.env.npm_package_version ?? 'unknown') }` to `vite.config.ts`
- [x] 1.2 Augment `ImportMetaEnv` in `src/vite-env.d.ts` with `readonly VITE_APP_VERSION: string`

## 2. HelpDialog Version Footer

- [x] 2.1 Add a footer `<p>` element to `src/components/HelpDialog.tsx` that renders `v{import.meta.env.VITE_APP_VERSION}` with Tailwind classes `text-xs text-muted-foreground text-center mt-4`

## 3. Unit Tests

- [x] 3.1 In `src/components/HelpDialog.test.tsx`, add a test that stubs `import.meta.env.VITE_APP_VERSION` to `"1.2.0"` and asserts the text `v1.2.0` is present in the rendered dialog

## 4. Verification

- [x] 4.1 Run `npm run build` and confirm no TypeScript or Vite compilation errors
- [x] 4.2 Run `npm run test` and confirm all unit tests pass including the new version rendering test
