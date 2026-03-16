## Why

When Copilot generates or modifies code, compilation errors and broken tests can go undetected until the developer manually runs the build or test suite. There is no feedback loop within the AI workflow itself to catch these regressions immediately. Adding an explicit instruction to build and run unit tests after every code change closes this gap — ensuring AI-assisted contributions are verified before they are treated as complete.

## What Changes

- Update `.github/copilot-instructions.md` to add a **Build & Test Verification** section that instructs Copilot to run `npm run build` after generating or modifying code to confirm there are no TypeScript or Vite compilation errors.
- Extend the same section to instruct Copilot to run `npm run test` (Vitest) after any code change to verify no existing unit tests are broken.
- Update `openspec/specs/ai-guiding-principles/spec.md` to add requirements and scenarios covering both the build-check and unit-test-check expectations.

## Capabilities

### Modified Capabilities

- `ai-guiding-principles`: Extends the standing AI instruction file with two new mandated verification steps — TypeScript/Vite build check and Vitest unit test run — that must be executed after every code generation or modification step.

### New Capabilities

<!-- None -->

## Impact

- Modifies `.github/copilot-instructions.md` only; no runtime code, no dependencies.
- Adds two new requirements to `openspec/specs/ai-guiding-principles/spec.md`.
- Makes AI-assisted development loops self-verifying by default.
