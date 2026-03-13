## 1. Vite + React 19 + TypeScript Bootstrap

- [x] 1.1 Run `npm create vite@latest . -- --template react-ts` to scaffold the project
- [x] 1.2 Install dependencies with `npm install`
- [x] 1.3 Verify `npm run dev` starts the dev server without errors
- [x] 1.4 Verify `npm run build` produces a `dist/` folder without errors

## 2. Tailwind CSS Setup

- [x] 2.1 Install Tailwind CSS v4 and required plugins (`@tailwindcss/vite`)
- [x] 2.2 Add the Tailwind Vite plugin to `vite.config.ts`
- [x] 2.3 Add `@import "tailwindcss"` to `src/index.css`
- [x] 2.4 Confirm a Tailwind utility class renders correctly in the browser

## 3. shadcn/ui Initialisation

- [x] 3.1 Run `npx shadcn@latest init` and complete the setup prompts
- [x] 3.2 Verify `components.json` is created at the project root
- [x] 3.3 Add the `Button` component via `npx shadcn@latest add button`
- [x] 3.4 Render `<Button>` in `App.tsx` and confirm it displays with correct styles

## 4. React Router v7

- [x] 4.1 Install `react-router`
- [x] 4.2 Wrap the app in `<BrowserRouter>` (or `createBrowserRouter`) in `src/main.tsx`
- [x] 4.3 Create a `src/layouts/RootLayout.tsx` root layout component with an `<Outlet />`
- [x] 4.4 Define a root route using the layout and verify the app renders at `/`
- [x] 4.5 Create a `src/pages/ConfigPage.tsx` placeholder component and register it at the `/config` route
- [x] 4.6 Verify navigating to `/config` renders the placeholder within the root layout without errors

## 5. Zustand with Persist Middleware

- [x] 5.1 Install `zustand`
- [x] 5.2 Create `src/store/index.ts` with a minimal Zustand store
- [x] 5.3 Configure the `persist` middleware targeting `localStorage` with a storage key
- [x] 5.4 Verify state survives a page reload by checking `localStorage` in DevTools

## 6. React Hook Form + Zod

- [x] 6.1 Install `react-hook-form`, `zod`, and `@hookform/resolvers`
- [x] 6.2 Create a minimal example form using `useForm` + `zodResolver` to verify the integration compiles and runs

## 7. ESLint + Prettier

- [x] 7.1 Install ESLint v9, `@eslint/js`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `typescript-eslint`
- [x] 7.2 Create `eslint.config.js` with flat config enabling recommended + React + TypeScript rules
- [x] 7.3 Install Prettier, `eslint-config-prettier`, and `eslint-plugin-prettier`
- [x] 7.4 Create `.prettierrc` with project formatting defaults
- [x] 7.5 Add `"lint": "eslint . --ext ts,tsx"` script to `package.json`
- [x] 7.6 Run `npm run lint` on the initial codebase and resolve any reported errors

## 8. Vitest + React Testing Library

- [x] 8.1 Install `vitest`, `@vitest/ui`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`
- [x] 8.2 Configure `vitest` in `vite.config.ts` (or `vitest.config.ts`) with `environment: 'jsdom'` and `setupFiles`
- [x] 8.3 Create `src/test/setup.ts` that imports `@testing-library/jest-dom`
- [x] 8.4 Write a smoke test (`App.test.tsx`) that renders `<App />` without crashing
- [x] 8.5 Add `"test": "vitest"` script and verify `npm run test` passes

## 9. Playwright

- [x] 9.1 Install Playwright and browsers with `npm init playwright@latest`
- [x] 9.2 Configure `playwright.config.ts` to target the Vite dev server URL (`http://localhost:5173`)
- [x] 9.3 Write a smoke E2E test that navigates to `/` and asserts the page title
- [x] 9.4 Add `"test:e2e": "playwright test"` script and verify `npm run test:e2e` passes

## 10. Package.json Scripts Audit

- [x] 10.1 Confirm all five required scripts are present: `dev`, `build`, `test`, `test:e2e`, `lint`
- [x] 10.2 Run each script in sequence and verify all exit with code 0 on the clean scaffold
