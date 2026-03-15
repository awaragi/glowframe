## Context

GlowFrame is a TypeScript + React 19 + Tailwind + Zustand project targeting GitHub Pages. Development is AI-assisted (GitHub Copilot in VS Code). Without a standing instruction file, Copilot has no project-specific context and will make decisions that conflict with established conventions — incorrect styling approaches, ad-hoc state, manual form wiring, etc. VS Code automatically loads `.github/copilot-instructions.md` for every Copilot interaction, making it the right mechanism to inject these rules globally and persistently.

## Goals / Non-Goals

**Goals:**
- Establish a single, version-controlled instruction file that VS Code Copilot picks up automatically.
- Cover all critical convention domains: language, styling, state, forms, testing, imports, security, accessibility, scope discipline, and backlog hygiene.
- Make the file easy to maintain: one section per concern, prose style, no proprietary tooling.

**Non-Goals:**
- CI enforcement of Copilot suggestions (not possible at the tool level).
- ESLint/Prettier rules — those are a separate feature (F-020).
- IDE settings or extension configuration beyond the instruction file itself.

## Decisions

**Use `.github/copilot-instructions.md`**  
VS Code Copilot auto-loads this path without any configuration. The alternative — per-prompt context injection — would require manual effort on every session and provides no persistence or shareability. The `.github/` directory is already tracked and serves as the canonical home for project-level tooling metadata.

**Prose + bullet hybrid format**  
Pure prose is easier to write and maintain; bullets make individual rules scannable during a Copilot session. The file uses a short prose sentence per section followed by bulleted rules so the structure is immediately graspable.

**Cover conventions before first feature PR**  
Instructions established after code exists tend to be ignored or contradicted by accumulated patterns. Committing this file as F-025 (before F-030 onward) ensures every subsequent feature starts with the guardrails already active.

## Risks / Trade-offs

- **Copilot may not follow all rules at all times** → Mitigation: Rules are explicit and negatively phrased ("never…", "no…") where needed; code review remains the final gate.
- **File becomes stale as dependencies evolve** → Mitigation: The requirements specify the file must be reviewed and updated whenever a new major dependency or architectural pattern is adopted; this is noted in the file itself.
- **Rule conflicts with a future library** → Mitigation: Specific library exceptions can be called out inline; the file is plain Markdown and easy to amend.
