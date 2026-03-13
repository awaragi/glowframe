## Why

GlowFrame has no codebase yet. Before any feature can be built, the full development environment must be established — build tooling, UI framework, state management, testing infrastructure, and code quality tools — so that all subsequent features (F-020 through F-150) have a stable, consistent foundation to build on.

## What Changes

- Bootstrap a new Vite project with React 19 and TypeScript templates
- Configure Tailwind CSS with the shadcn/ui preset
- Install and configure shadcn/ui and Radix UI primitives
- Set up React Router v7 with a root layout route
- Configure Zustand with the `persist` middleware targeting `localStorage`
- Install React Hook Form and Zod for form validation
- Add ESLint (recommended + React + TypeScript rules) and Prettier for code quality
- Add Vitest and React Testing Library for unit tests
- Add Playwright for end-to-end tests
- Expose `npm run dev`, `npm run build`, `npm run test`, `npm run test:e2e`, and `npm run lint` scripts

## Capabilities

### New Capabilities

- `project-scaffold`: Full project setup — Vite + React 19 + TypeScript build pipeline, Tailwind CSS, shadcn/ui, Radix UI, React Router v7, Zustand with localStorage persistence, React Hook Form + Zod, ESLint, Prettier, Vitest + React Testing Library, and Playwright — with all required npm scripts.

### Modified Capabilities

<!-- None — this is a greenfield project with no existing capabilities. -->

## Impact

- Creates the entire repository structure from scratch (`src/`, `public/`, config files)
- Establishes `package.json` with all runtime and dev dependencies
- Sets up `vite.config.ts`, `tailwind.config.ts`, `tsconfig.json`, `eslint.config.js`, `prettier.config.js`, `vitest.config.ts`, and `playwright.config.ts`
- No existing code is affected; all other features (F-020+) depend on this being complete first
