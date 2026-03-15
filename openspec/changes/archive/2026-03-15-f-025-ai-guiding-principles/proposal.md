## Why

Without explicit AI coding guidelines, GitHub Copilot makes inconsistent decisions about state management, styling, testing, and security — producing code that conflicts with established project conventions and requires manual correction on every suggestion. Establishing these guardrails now, before feature development begins, ensures every AI-assisted contribution is correct by default.

## What Changes

- Add `.github/copilot-instructions.md` — a persisted, auto-loaded instruction file that sets language, framework, state, testing, import, security, accessibility, and scope conventions for Copilot in VS Code.
- Define OpenSpec change naming convention (`f-<number>-<slug>`) and feature-backlog discipline so AI-generated suggestions stay aligned with the project's structured workflow.

## Capabilities

### New Capabilities

- `ai-guiding-principles`: Defines and documents the standing rules that govern all AI-assisted code generation in this project, captured in `.github/copilot-instructions.md`.

### Modified Capabilities

<!-- None — no existing spec-level behavior is changing. -->

## Impact

- Adds `.github/copilot-instructions.md` to the repository (tracked in version control).
- No runtime code changes; no dependency changes.
- All future AI-assisted contributions are subject to the rules defined in this file.
