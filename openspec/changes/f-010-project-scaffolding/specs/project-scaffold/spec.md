## ADDED Requirements

### Requirement: Vite project initialised with React 19 and TypeScript
The project SHALL be initialised using Vite with the React + TypeScript template, targeting React 19 as the UI framework.

#### Scenario: Development server starts
- **WHEN** a developer runs `npm run dev`
- **THEN** the Vite development server starts without errors and serves the app at a local port

#### Scenario: Production build succeeds
- **WHEN** a developer runs `npm run build`
- **THEN** Vite compiles a production bundle into the `dist/` directory without errors

---

### Requirement: Tailwind CSS configured with shadcn/ui preset
The project SHALL have Tailwind CSS installed and configured following the shadcn/ui v4 setup guide, including the required CSS variables and base styles.

#### Scenario: Tailwind classes applied at runtime
- **WHEN** a Tailwind utility class (e.g., `bg-white`) is applied to an element
- **THEN** the corresponding styles are present in the compiled CSS output

---

### Requirement: shadcn/ui and Radix UI primitives available
The project SHALL have shadcn/ui initialised (`npx shadcn init`) with at least one component copied into `src/components/ui/`, and Radix UI peer dependencies installed.

#### Scenario: shadcn/ui component renders
- **WHEN** a shadcn/ui component (e.g., `Button`) is imported and rendered
- **THEN** it renders correctly with the expected Tailwind-based styles applied

---

### Requirement: React Router v7 configured with a root layout
The project SHALL have React Router v7 installed and configured in client-side SPA mode, with a root layout route wrapping the application.

#### Scenario: Root route renders
- **WHEN** the app loads at the root path `/`
- **THEN** the root layout component renders without errors

#### Scenario: Config route is registered
- **WHEN** the user navigates to `/config`
- **THEN** the route resolves within the root layout and renders a settings modal placeholder (the full modal UI is implemented in a later feature)

---

### Requirement: Zustand store with localStorage persistence
The project SHALL have Zustand installed with the `persist` middleware configured to serialise the application store to `localStorage`.

#### Scenario: Store state persists across page reloads
- **WHEN** a value is written to the Zustand store and the page is reloaded
- **THEN** the persisted value is rehydrated from `localStorage` on next load

---

### Requirement: React Hook Form and Zod installed
The project SHALL have React Hook Form and Zod installed as runtime dependencies, available for use in form components.

#### Scenario: Form validates with Zod schema
- **WHEN** a form is submitted with invalid data against a Zod schema resolver
- **THEN** React Hook Form surfaces the Zod validation errors to the UI

---

### Requirement: ESLint and Prettier configured
The project SHALL have ESLint v9 (flat config) with recommended, React, and TypeScript rules configured, and Prettier with `eslint-config-prettier` to prevent rule conflicts.

#### Scenario: Lint passes on clean code
- **WHEN** a developer runs `npm run lint` on a project with no violations
- **THEN** ESLint exits with code 0 and reports no errors or warnings

#### Scenario: Lint fails on violation
- **WHEN** a developer runs `npm run lint` on code with a rule violation (e.g., unused variable)
- **THEN** ESLint exits with a non-zero code and reports the violation with file and line

---

### Requirement: Vitest and React Testing Library configured
The project SHALL have Vitest and React Testing Library installed and configured, with a test setup file (`src/test/setup.ts`) that imports `@testing-library/jest-dom` matchers.

#### Scenario: Unit test suite runs
- **WHEN** a developer runs `npm run test`
- **THEN** Vitest discovers and runs all `*.test.tsx` / `*.test.ts` files and reports results

---

### Requirement: Playwright configured for end-to-end tests
The project SHALL have Playwright installed and configured with at least a `playwright.config.ts` targeting the local dev server.

#### Scenario: E2E test suite runs
- **WHEN** a developer runs `npm run test:e2e`
- **THEN** Playwright launches a browser, executes all E2E test files, and reports results

---

### Requirement: All required npm scripts present
The `package.json` SHALL expose the following scripts: `dev`, `build`, `test`, `test:e2e`, and `lint`.

#### Scenario: Each script is runnable
- **WHEN** a developer runs any of `npm run dev`, `npm run build`, `npm run test`, `npm run test:e2e`, `npm run lint`
- **THEN** each script executes its associated tool without "missing script" errors
