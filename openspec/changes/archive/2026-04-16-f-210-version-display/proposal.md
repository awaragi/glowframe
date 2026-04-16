## Why

Users and support staff have no way to verify which build of GlowFrame is running without opening browser developer tools. Surfacing the version in the help dialog footer gives an immediate, low-friction answer that is always one keypress (`?`) away.

## What Changes

- Add a Vite `define` constant (`import.meta.env.VITE_APP_VERSION`) that injects the `package.json` version at build time.
- Render a `v<semver>` version string in the `HelpDialog` footer with de-emphasised styling (muted colour, small type).
- Add a unit test verifying the version string renders correctly when `import.meta.env.VITE_APP_VERSION` is mocked.

## Capabilities

### New Capabilities

- `version-display`: Displays the build-time app version in the HelpDialog footer as `v<semver>`, sourced exclusively from the Vite define constant.

### Modified Capabilities

- `keyboard-shortcuts`: The `HelpDialog` component gains a footer element showing the version string; no requirement-level behaviour change to shortcuts themselves, but the dialog's rendered content expands.

## Impact

- `vite.config.ts` — add `define` entry for `import.meta.env.VITE_APP_VERSION`.
- `src/components/HelpDialog.tsx` — add version footer.
- `src/components/HelpDialog.test.tsx` — add unit test for version rendering.
- `tsconfig.app.json` / `src/vite-env.d.ts` — may need a type declaration for the new env variable.
- No API, routing, or state management changes required.
