## Context

GlowFrame is a TypeScript + React 19 + Tailwind + Vite project. Development is AI-assisted via GitHub Copilot in VS Code, guided by `.github/copilot-instructions.md`. Currently that file mandates writing tests but says nothing about running the build or the test suite after generating code — meaning Copilot can produce a broken artifact and consider the task done. Adding a verification step to the instruction file makes the AI feedback loop self-closing, so compilation errors and broken tests surface immediately within the Copilot workflow.

## Goals / Non-Goals

**Goals:**
- Add a `Build & Test Verification` section to `.github/copilot-instructions.md` that instructs Copilot to run `npm run build` after every code change to catch TypeScript and Vite compilation errors.
- Add an instruction to run `npm run test` (Vitest) after every code change to confirm no existing unit tests are broken.
- Add corresponding requirements and BDD scenarios to `openspec/specs/ai-guiding-principles/spec.md` so the spec stays in sync with the instruction file.

**Non-Goals:**
- Running Playwright e2e tests automatically (too slow for every change; e2e tests remain a manual step).
- Adding a pre-commit hook or CI check (separate concern; not in scope for F-125).
- Modifying `package.json` scripts or build tooling.

## Decisions

**Instruction file is the right place**  
The natural enforcement point for AI behaviour in this project is `.github/copilot-instructions.md`. It is already the authoritative source for all Copilot rules. Adding build/test verification here ensures Copilot sees it on every interaction without any additional tooling.

**`npm run build` for compilation check, `npm run test` for unit tests**  
These are the two scripts already defined in `package.json` and referenced elsewhere in the instruction file. Reusing them keeps the instructions consistent and requires no new commands.

**Separate section, not an extension of Testing**  
The existing `Testing` section covers what tests to *write*. The new `Build & Test Verification` section covers what to *run* — a distinct concern (verification vs. authoring). Keeping them separate improves scannability.

**Exclude e2e from the mandatory run**  
Playwright tests can take minutes. Mandating them after every code change would break flow without meaningful benefit — compilation errors and unit test regressions are far more common and are caught by `npm run build` + `npm run test`. E2e tests are left as a pre-PR or manual step.

## Risks / Trade-offs

- **Copilot may silently skip the verification steps** → Mitigation: The instruction is phrased imperatively ("After every code change, run…"). Code review remains the final gate.
- **Build failures due to environment issues rather than code errors** → Mitigation: Out of scope; these are operational concerns not addressable via instruction file.
