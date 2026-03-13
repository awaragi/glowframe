## Context

GlowFrame is a greenfield web app — a full-screen fill-light display for video calls and selfies. There is no existing codebase. This design covers the one-time decisions required to stand up the development environment before any feature work begins. All other features (F-020 through F-150) depend on this foundation being in place.

## Goals / Non-Goals

**Goals:**
- Choose and configure the right tools for each layer (build, UI, state, testing)
- Ensure all tooling is compatible with React 19
- Produce a runnable project with `npm run dev` from day one
- Establish a clear, repeatable script surface for CI and contributors

**Non-Goals:**
- Implementing any application feature (light display, profiles, PWA, etc.)
- Configuring CI/CD pipelines (out of scope for F-010)
- Deploying or publishing anything (covered by F-040)

## Decisions

### Vite over Create React App / Next.js
Vite provides near-instant dev-server startup and HMR via native ESM. CRA is deprecated. Next.js adds SSR complexity that GlowFrame doesn't need — it's a pure client-side PWA with no server rendering requirements.

### React 19 (stable)
React 19 is the current stable release and ships first-class support for concurrent features, the new compiler, and improved `use()` hooks. Starting on 19 avoids a future major migration.

### Tailwind CSS v4 + shadcn/ui
Tailwind provides utility-first styling with no runtime overhead. shadcn/ui gives accessible, unstyled Base UI primitives (via the `base-nova` style) with Tailwind-based variants — exactly what a settings modal and toggles need. Alternative (CSS Modules) rejected: more boilerplate, no design-system alignment.

Integration uses `@tailwindcss/postcss` (PostCSS plugin) rather than `@tailwindcss/vite` (Vite plugin). `@tailwindcss/vite@4.x` declares a peer dependency of `vite@^5.2.0 || ^6 || ^7` which conflicts with `vite@8` used by this project. `@tailwindcss/postcss` has no peer dependencies, resolves the conflict, and produces identical output. Vite has built-in PostCSS support so no additional configuration is needed.

### React Router v7 (framework mode — client-only)
React Router v7 is the successor to Remix routing and integrates cleanly with Vite. Used in SPA / client-only mode (no SSR). Provides future-proof nested routing for any multi-view expansion.

### Zustand + `persist` middleware over Redux / Context + localStorage
Zustand is minimal (<1 kB), React-19-compatible, and the `persist` middleware serialises store slices to `localStorage` with zero boilerplate. Redux adds significant ceremony for a single-page app. Context with manual localStorage sync is error-prone.

### React Hook Form + Zod
RHF provides uncontrolled form performance; Zod provides type-safe schema validation. Together they eliminate manual validation logic and integrate cleanly with TypeScript inference.

### Vitest over Jest
Vitest shares the Vite config, requires no Babel transform, and runs tests in the same ESM environment as the app — eliminating the most common Jest + Vite incompatibility issues.

### Playwright for E2E
Playwright supports all major browsers, has a first-class VS Code extension, and generates tests from user interactions. Cypress rejected: heavier install, weaker multi-browser support.

### ESLint flat config + Prettier
ESLint v9 flat config is the current standard. Prettier handles formatting; ESLint rules handle code correctness. `eslint-config-prettier` disables ESLint formatting rules that conflict.

## Risks / Trade-offs

- **React 19 ecosystem lag** → Some third-party libraries may not yet declare React 19 peer dep compatibility. Mitigation: use `--legacy-peer-deps` during initial install if needed; audit each dependency.
- **Tailwind CSS v4 breaking changes** → v4 changes config format significantly. Mitigation: pin to v4 from the start and follow official shadcn/ui v4 setup guide.
- **shadcn/ui is not a published npm package** — components are copied into `src/components/ui/`. Mitigation: this is by design; document clearly in README.
- **Zustand persist serialisation** → Non-serialisable values (functions, class instances) silently drop. Mitigation: keep store state plain-data only; enforce in review.
