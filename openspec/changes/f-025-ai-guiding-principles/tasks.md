## 1. Create the instruction file

- [x] 1.1 Create `.github/copilot-instructions.md` with language and framework conventions (TypeScript strict, React 19 functional components, Tailwind CSS only, shadcn/ui + Radix UI primitives)
- [x] 1.2 Add state management rules to the instruction file (Zustand for cross-component state; `useState` for local UI state only)
- [x] 1.3 Add form handling rules to the instruction file (React Hook Form + Zod exclusively; no uncontrolled forms or manual `onChange` chains)
- [x] 1.4 Add testing expectations to the instruction file (Vitest unit test per utility/hook; Playwright scenario per user-facing interaction)
- [x] 1.5 Add import style rules to the instruction file (`@/` alias imports; no deep relative paths beyond one level)
- [x] 1.6 Add security guardrails to the instruction file (no `dangerouslySetInnerHTML`; Zod validation for URL/query params; no committed secrets)
- [x] 1.7 Add accessibility rules to the instruction file (accessible labels or `aria-*` on all interactive elements; no click handlers on non-interactive elements)
- [x] 1.8 Add scope discipline to the instruction file (no unrequested features, no extra files, no surrounding-code refactors)
- [x] 1.9 Add feature backlog discipline to the instruction file (out-of-scope ideas go into REQUIREMENTS.md as `Not started` entries)
- [x] 1.10 Add OpenSpec change naming convention to the instruction file (`f-<number>-<slug>`)
- [x] 1.11 Add a maintenance note stating the file must be reviewed when a new major dependency or architectural pattern is adopted

## 2. Verify and commit

- [x] 2.1 Confirm `.github/copilot-instructions.md` is tracked by Git (not listed in `.gitignore`)
- [ ] 2.2 Open a Copilot chat in VS Code and verify the instruction file is being picked up (Copilot references project conventions)
