## 1. Update copilot-instructions.md

- [x] 1.1 Add a new `## Build & Test Verification` section to `.github/copilot-instructions.md` with an instruction to run `npm run build` after every code generation or modification to catch TypeScript and Vite compilation errors
- [x] 1.2 Add an instruction in the same section to run `npm run test` (Vitest) after every code change to verify no existing unit tests are broken
- [x] 1.3 Add a note that Playwright e2e tests (`npm run test:e2e`) are excluded from mandatory automatic runs and remain a manual / pre-PR step

## 2. Update the ai-guiding-principles spec

- [x] 2.1 Add a requirement to `openspec/specs/ai-guiding-principles/spec.md` stating the instruction file SHALL mandate running `npm run build` after every code change, with a scenario confirming the rule is stated
- [x] 2.2 Add a requirement to `openspec/specs/ai-guiding-principles/spec.md` stating the instruction file SHALL mandate running `npm run test` after every code change, with a scenario confirming the rule is stated
