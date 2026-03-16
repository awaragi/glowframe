# AI Guiding Principles

## Purpose

Defines the Copilot/AI assistant instructions for the GlowFrame project — the coding conventions, architectural patterns, and behavioural guardrails that every AI interaction must follow.

## Requirements

### Requirement: Copilot instruction file exists
The project SHALL contain a `.github/copilot-instructions.md` file committed to the repository root so that VS Code automatically loads it for every GitHub Copilot interaction.

#### Scenario: File is present and tracked
- **WHEN** a developer clones the repository
- **THEN** `.github/copilot-instructions.md` exists and is version-controlled (not in `.gitignore`)

---

### Requirement: Language and framework conventions declared
The instruction file SHALL declare that all code must use TypeScript strict mode, React 19 functional components (no class components), Tailwind CSS for all styling (no inline `style` props except for dynamic computed values), and shadcn/ui + Radix UI for all interactive primitives.

#### Scenario: Inline style prohibition stated
- **WHEN** the instructions file is read
- **THEN** it explicitly prohibits inline `style` props except for dynamic computed values

#### Scenario: Component paradigm stated
- **WHEN** the instructions file is read
- **THEN** it explicitly requires React 19 functional components only

---

### Requirement: State management rules declared
The instruction file SHALL require that cross-component state is managed exclusively through Zustand stores, and that `useState` is acceptable only for purely local UI state (e.g., modal open flag).

#### Scenario: Zustand-only rule stated
- **WHEN** the instructions file is read
- **THEN** it explicitly prohibits `useState` for cross-component state and mandates Zustand

---

### Requirement: Form handling rules declared
The instruction file SHALL require React Hook Form + Zod exclusively for all form handling, and prohibit uncontrolled forms and manual `onChange` chains.

#### Scenario: Form library mandate stated
- **WHEN** the instructions file is read
- **THEN** it specifies React Hook Form + Zod as the only permitted form approach

---

### Requirement: Testing expectations declared
The instruction file SHALL state that every new utility or hook requires a Vitest unit test, and every new user-facing interaction requires a Playwright scenario.

#### Scenario: Unit test requirement stated
- **WHEN** the instructions file is read
- **THEN** it specifies Vitest unit tests are required for every new utility or hook

#### Scenario: E2E test requirement stated
- **WHEN** the instructions file is read
- **THEN** it specifies Playwright scenarios are required for every new user-facing interaction

---

### Requirement: Import style declared
The instruction file SHALL require absolute imports using the `@/` alias (e.g., `@/components/…`) and prohibit relative `../../` paths beyond one level.

#### Scenario: Alias import rule stated
- **WHEN** the instructions file is read
- **THEN** it explicitly requires `@/` alias imports and prohibits deep relative paths

---

### Requirement: Security guardrails declared
The instruction file SHALL prohibit `dangerouslySetInnerHTML`, require Zod validation for all URL/query-parameter inputs before use, and prohibit committing secrets or API keys.

#### Scenario: dangerouslySetInnerHTML prohibition stated
- **WHEN** the instructions file is read
- **THEN** it explicitly prohibits use of `dangerouslySetInnerHTML`

#### Scenario: Input validation rule stated
- **WHEN** the instructions file is read
- **THEN** it requires Zod validation for URL/query-parameter inputs

---

### Requirement: Accessibility rules declared
The instruction file SHALL require accessible labels or `aria-*` attributes on all interactive elements, and prohibit click handlers on non-interactive HTML elements.

#### Scenario: Accessible label rule stated
- **WHEN** the instructions file is read
- **THEN** it requires all interactive elements to have accessible labels or `aria-*` attributes

---

### Requirement: Scope discipline declared
The instruction file SHALL prohibit AI from adding unrequested features, refactoring surrounding code, or creating extra files beyond what is explicitly needed for the task at hand.

#### Scenario: Scope restriction stated
- **WHEN** the instructions file is read
- **THEN** it explicitly prohibits adding unrequested features or extra files

---

### Requirement: Feature backlog discipline declared
The instruction file SHALL state that when in-progress work surfaces a new out-of-scope idea, the AI must add it as a new numbered entry in `REQUIREMENTS.md` (status `Not started`) rather than implementing it immediately.

#### Scenario: Backlog entry rule stated
- **WHEN** the instructions file is read
- **THEN** it specifies that out-of-scope ideas are recorded in REQUIREMENTS.md, not implemented inline

---

### Requirement: Build verification mandated
The instruction file SHALL mandate that after every code generation or modification, the AI must run `npm run build` to catch TypeScript and Vite compilation errors before considering a task complete.

#### Scenario: Build check rule stated
- **WHEN** the instructions file is read
- **THEN** it explicitly requires running `npm run build` after every code generation or modification

---

### Requirement: Unit test verification mandated
The instruction file SHALL mandate that after every code change, the AI must run `npm run test` (Vitest) to verify no existing unit tests are broken.

#### Scenario: Unit test run rule stated
- **WHEN** the instructions file is read
- **THEN** it explicitly requires running `npm run test` after every code change

---

### Requirement: OpenSpec change naming convention declared
The instruction file SHALL state that all OpenSpec changes must follow the naming convention `f-<number>-<short-description-slug>` (e.g., `f-025-ai-guiding-principles`).

#### Scenario: Change naming convention stated
- **WHEN** the instructions file is read
- **THEN** it defines the `f-<number>-<slug>` naming pattern for OpenSpec changes

---

### Requirement: Instruction file is reviewed on major dependency adoption
The instruction file SHALL include a note that it must be reviewed and updated whenever a new major dependency or architectural pattern is adopted.

#### Scenario: Maintenance note present
- **WHEN** the instructions file is read
- **THEN** it contains guidance to review and update it when new major dependencies are added
