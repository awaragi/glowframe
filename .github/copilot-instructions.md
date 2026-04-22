# GlowFrame — GitHub Copilot Instructions

These instructions apply to every Copilot interaction in this repository. Follow them exactly. When in doubt, do less and ask.

---

## Think Before Coding

Before implementing, surface uncertainty rather than hiding it.

- State your assumptions explicitly. If uncertain, ask.
- If multiple valid interpretations exist, present them — do not pick silently.
- If a simpler approach exists, say so and push back when warranted.
- If something is ambiguous, name what is confusing. Do not guess.

---

## Language & Framework

This project uses **TypeScript strict mode**, **React 19 functional components** (no class components), **Tailwind CSS** for all styling, and **shadcn/ui + Radix UI** for all interactive primitives.

- Use TypeScript strict mode. Do not use `any`; prefer explicit generics or narrow union types.
- Write React 19 functional components only. Never create class components.
- Apply all styling with Tailwind CSS utility classes. Do **not** use inline `style` props except for dynamic computed values (e.g., a CSS custom property derived from a user-chosen colour at runtime).
- Use **shadcn/ui** + **Radix UI** primitives for all interactive elements — buttons, dialogs, dropdowns, tooltips, sliders, etc. Do not build custom interactive components from scratch when a shadcn/ui or Radix UI primitive exists.

---

## State Management

Cross-component state is managed exclusively through **Zustand** stores.

- Never use `useState` for state that is shared across components. Use a Zustand store.
- `useState` is acceptable **only** for purely local UI state (e.g., a modal open/close flag, a hover state) that is not read by any other component.
- Do not introduce Redux, Jotai, Context API, or any other state management library.

---

## Form Handling

All forms use **React Hook Form + Zod** exclusively.

- Never build uncontrolled forms.
- Never wire up manual `onChange` handlers to manage form values.
- Define a Zod schema for every form's data shape. Pass it to React Hook Form via `zodResolver`.
- Use the React Hook Form `register`, `control`, and `handleSubmit` APIs consistently.

---

## Testing

Every new piece of code must be accompanied by tests.

- Every new **utility function or custom hook** must have a corresponding **Vitest** unit test in `src/test/` (or co-located `*.test.ts(x)` file).
- Every new **user-facing interaction** must be covered by a **Playwright** end-to-end scenario in `e2e/`.
- Do not skip tests. If a task does not mention tests, write them anyway.
- Run `npm run test` (Vitest) and `npm run test:e2e` (Playwright) to verify.

---

## Build & Test Verification

After every code generation or modification, verify the change compiles and all unit tests pass.

- Run `npm run build` after every code generation or modification to catch TypeScript and Vite compilation errors before considering a task complete.
- Run `npm run test` (Vitest) after every code change to verify no existing unit tests are broken.
- Playwright e2e tests (`npm run test:e2e`) are **excluded** from mandatory automatic runs — they are a manual / pre-PR step only.

---

## Import Style

Use absolute imports via the `@/` path alias.

- Import from `@/components/…`, `@/lib/…`, `@/store/…`, `@/pages/…`, etc.
- Never use relative `../../` paths that ascend more than one directory level.
- The `@/` alias maps to `src/` (configured in `tsconfig.app.json` and `vite.config.ts`).

---

## Security

- **No `dangerouslySetInnerHTML`** — ever. If HTML rendering is genuinely required, ask first.
- **Validate all external inputs with Zod** before use — URL parameters, query strings, `localStorage` values, API responses.
- **No secrets or API keys** committed to the repository. Use environment variables (`import.meta.env.VITE_*`) and document required variables in `README.md`.

---

## Accessibility

All interactive elements must be accessible.

- Every interactive element (button, link, input, toggle) must have a visible label, an `aria-label`, or an `aria-labelledby` reference.
- Never attach `onClick` (or any pointer/keyboard event) to a non-interactive element (`div`, `span`, `p`, etc.). Use a `<button>` or a Radix UI primitive instead.
- Maintain logical tab order. Do not set `tabIndex` to values greater than 0.

---

## Scope Discipline

Do exactly what is asked. Nothing more.

- Do **not** add unrequested features, refactor surrounding code, rename variables, or reorganise files unless explicitly asked.
- Do **not** create extra files (helpers, utilities, types) beyond what the current task strictly requires.
- Do **not** add comments, JSDoc, or type annotations to code you did not change.
- If you notice a improvement opportunity **outside** the current task, do **not** fix it. Follow the Backlog Discipline rule below instead.

---

## Feature Backlog Discipline

When in-progress work surfaces a new idea, gap, or improvement that is out of scope for the current task:

1. Do **not** implement it immediately.
2. Add it as a new numbered entry in [`REQUIREMENTS.md`](../REQUIREMENTS.md) under the Implementation Checklist with status `Not started`.
3. Continue with the current task.

This ensures every idea is captured and prioritised in a controlled way, rather than silently expanding scope.

---

## OpenSpec Change Naming

All OpenSpec changes must follow this naming convention:

```
f-<number>-<short-description-slug>
```

Examples: `f-025-ai-guiding-principles`, `f-060-core-light-display`.

- The number matches the corresponding feature ID in `REQUIREMENTS.md`.
- The slug is lowercase, hyphen-separated, and concise (3–5 words max).

---

## Maintenance

**This file must be reviewed and updated whenever a new major dependency or architectural pattern is adopted.** If a library is replaced, a new paradigm is introduced, or a convention changes, update the relevant section here before (or as part of) the first PR that introduces the change.
