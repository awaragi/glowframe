# GlowFrame — Business Requirements Document (BRD)

> **Concept:** "Be white, be bright." — Turn any display into a soft, customizable front-facing fill light for video recording, calls, and selfies.

---

## Implementation Checklist

Use this checklist to track overall feature completion status.

- [x] **F-010** Project scaffolding (Vite + React 19 + TypeScript + Tailwind + shadcn/ui)
- [x] **F-020** ESLint + Prettier code quality setup
- [ ] **F-025** Guiding principles for AI (GitHub Copilot)
- [ ] **F-030** Unit tests (Vitest + React Testing Library)
- [ ] **F-040** End-to-end tests (Playwright)
- [ ] **F-050** Committed `dist/` build for GitHub Pages serving
- [ ] **F-060** Core light display — full-screen white/colored fill light
- [ ] **F-070** Screen Wake Lock API integration
- [ ] **F-080** Progressive Web App (PWA) support
- [ ] **F-090** Local storage persistence via Zustand
- [ ] **F-100** Multiple named profiles
- [ ] **F-110** Profile settings — light color, brightness, ring format, radii
- [ ] **F-120** Live settings modal (gear icon, top-right)
- [ ] **F-130** Fullscreen toggle button
- [ ] **F-140** Profile share button (URL parameter, auto-clean)

---

## Technology Stack

| Layer | Technology |
|---|---|
| Build tool | Vite |
| UI framework | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Component library | shadcn/ui + Radix UI |
| Routing | React Router v7 |
| State / persistence | Zustand (localStorage middleware) |
| Forms | React Hook Form + Zod |
| Unit testing | Vitest + React Testing Library |
| E2E testing | Playwright |
| Linting / formatting | ESLint + Prettier |
| Package manager | npm |
| Hosting | GitHub Pages (serving `dist/`) |

---

## Features

---

### F-010 — Project Scaffolding

**Priority:** Critical  
**Status:** Complete

Set up the full development environment with all required tools and libraries in a single runnable project.

**Requirements:**
- Initialise a Vite project with React 19 and TypeScript templates.
- Configure Tailwind CSS with the shadcn/ui preset.
- Install and configure shadcn/ui and Radix UI primitives.
- Set up React Router v7 with a root layout.
- Configure Zustand with the `persist` middleware targeting `localStorage`.
- Install React Hook Form and Zod.
- Add ESLint (recommended + React + TypeScript rules) and Prettier.
- Add Vitest and React Testing Library.
- Add Playwright for E2E tests.
- Provide `npm run dev`, `npm run build`, `npm run test`, `npm run test:e2e`, `npm run lint` scripts.

---

### F-020 — Code Quality (ESLint + Prettier)

**Priority:** Critical  
**Status:** Not started

Establish linting and formatting rules immediately after scaffolding so every subsequent commit is clean from the start.

**Requirements:**
- ESLint configured with `eslint:recommended`, `@typescript-eslint/recommended`, `plugin:react/recommended`, `plugin:react-hooks/recommended`.
- Prettier configured for consistent formatting (single quotes, 2-space indent, trailing commas).
- `npm run lint` runs ESLint across `src/`.
- `npm run format` runs Prettier across `src/`.
- Pre-commit hook (optional but recommended via `lint-staged` + `husky`) to enforce lint and format on staged files.

---

### F-025 — Guiding Principles for AI (GitHub Copilot)

**Priority:** Critical  
**Status:** Not started

Establish explicit conventions and guardrails so that GitHub Copilot (and any other AI-assisted tooling) produces code that is consistent, secure, and aligned with this project's standards from the first prompt onward.

**Requirements:**
- Provide a `.github/copilot-instructions.md` file at the repo root that Copilot automatically picks up in VS Code.
- The instructions file must declare:
  - **Language & framework context:** TypeScript strict mode, React 19 functional components only, Tailwind CSS for all styling (no inline `style` props except for dynamic computed values), shadcn/ui + Radix UI for all interactive primitives.
  - **State management:** Zustand store only — no `useState` for cross-component state; `useState` is acceptable only for purely local UI state (e.g., modal open flag).
  - **Form handling:** React Hook Form + Zod exclusively; never build uncontrolled forms or manual `onChange` chains.
  - **Testing expectations:** every new utility or hook must have a corresponding Vitest unit test; every new user-facing interaction must be covered by a Playwright scenario.
  - **Import style:** use absolute imports from `src/` aliases (e.g., `@/components/…`) — never relative `../../` paths beyond one level.
  - **Security guardrails:** no `dangerouslySetInnerHTML`; all URL/query-parameter inputs must be validated with Zod before use; no secrets or API keys are ever committed.
  - **Accessibility:** all interactive elements must have accessible labels or `aria-*` attributes; no click handlers on non-interactive HTML elements.
  - **Scope discipline:** AI must not add unrequested features, refactor surrounding code, or create extra files beyond what is explicitly needed for the task at hand.
  - **Feature backlog:** if work in progress surfaces a new feature idea, gap, or improvement that is out of scope for the current task, AI must add it as a new numbered entry in the `REQUIREMENTS.md` Implementation Checklist (status `Not started`) rather than implementing it immediately, so it can be prioritised and implemented in a controlled way.
  - **OpenSpec change naming:** all OpenSpec changes must follow the naming convention `f-<number>-<short-description-slug>` (e.g., `f-010-project-scaffolding`, `f-025-ai-guiding-principles`), where the number matches the corresponding feature ID and the slug is lowercase, hyphen-separated, and concise.
- The instructions file must be reviewed and updated whenever a new major dependency or architectural pattern is adopted.
- The `.github/copilot-instructions.md` file is committed to the repository so the same guidance applies to all contributors using Copilot.

---

### F-030 — Unit & Component Tests

**Priority:** Critical  
**Status:** Not started

Establish the unit testing infrastructure early to enable a TDD workflow from the first feature.

**Requirements:**
- Vitest configured with `jsdom` environment and React Testing Library setup.
- Test coverage targets:
  - Zustand store actions (profile CRUD, settings update).
  - Profile serialisation / deserialisation (share URL encode/decode).
  - Settings modal renders correctly and applies live changes.
  - Wake Lock hook acquires and releases correctly (mock API).
- `npm run test` runs all unit tests.
- `npm run test:coverage` generates a coverage report.

---

### F-040 — End-to-End Tests (Playwright)

**Priority:** High  
**Status:** Not started

Establish the E2E testing infrastructure early to enable an ATDD workflow from the first feature.

**Requirements:**
- Playwright configured for Chromium (minimum); optionally Firefox and WebKit.
- Key scenarios covered:
  - App loads, light surface fills the viewport.
  - Opening the gear modal, changing brightness, confirming live update.
  - Creating a new profile, switching to it.
  - Sharing a profile via URL, reloading with the URL parameter, verifying settings load and parameter is removed.
  - Fullscreen toggle reflects correct state.
- `npm run test:e2e` starts the dev server and runs Playwright tests.

---

### F-050 — Committed `dist/` Build for GitHub Pages

**Priority:** Critical  
**Status:** Not started

The compiled production build lives inside the repository so GitHub Pages can serve it directly from the `dist/` folder without a separate CI deployment pipeline.

**Requirements:**
- `dist/` is **not** listed in `.gitignore`; it is tracked and committed to the repository.
- A `.nojekyll` file is placed inside `dist/` (or at the repo root served by Pages) so GitHub Pages does not process the folder with Jekyll.
- `npm run build` regenerates `dist/` locally; the developer commits the updated `dist/` as part of any release.
- The Vite `base` config matches the GitHub Pages sub-path (e.g., `/glowframe/`) so all asset URLs resolve correctly.
- A `CNAME` file can optionally be placed in `dist/` to support a custom domain without re-running the build.
- GitHub Pages is configured in the repository settings to serve from the `dist/` folder on the `main` branch (or from the root of a `gh-pages` branch that contains the `dist/` contents).
- The `src/` source files, config files, and `node_modules/` remain in `.gitignore` as appropriate; only the compiled output in `dist/` is intentionally committed.
- A brief note in `README.md` explains the build-and-commit workflow so contributors know how to release updates.
- Future migration to a custom domain or sub-path must require only a `base` change in `vite.config.ts`.

---

### F-060 — Core Light Display

**Priority:** Critical  
**Status:** Not started

Render a full-viewport light surface whose color and brightness are driven by the active profile's settings.

**Requirements:**
- The main view must fill 100 vw × 100 vh.
- Background color is derived from the active profile's `lightColor` and `brightness` values.
- No scrollbars, no visible UI chrome while the light is active (except the gear and fullscreen buttons).
- The display must re-render immediately upon any settings change (live preview).

---

### F-070 — Screen Wake Lock API

**Priority:** Critical  
**Status:** Not started

Prevent the device display from going dark during use.

**Requirements:**
- Request a `screen` wake lock when the app mounts or becomes visible.
- Release the wake lock when the page is hidden or unloaded.
- Re-acquire the wake lock automatically if the page regains visibility (e.g., after a tab switch).
- Handle environments where the Wake Lock API is unavailable gracefully (no crash, no user-facing error unless meaningful).

---

### F-080 — Progressive Web App (PWA)

**Priority:** High  
**Status:** Not started

Allow users to install GlowFrame as a standalone app on any device.

**Requirements:**
- Provide a `manifest.webmanifest` with name, short name, icons (at least 192 × 192 and 512 × 512), `display: standalone`, `background_color: #ffffff`, `theme_color: #ffffff`.
- Register a service worker (via `vite-plugin-pwa` or equivalent) for offline capability.
- The installed app must open directly to the light surface without browser chrome.
- Lighthouse PWA audit must pass all installability criteria.

---

### F-090 — Local Storage Persistence

**Priority:** Critical  
**Status:** Not started

All user profiles and settings survive page reloads and browser restarts.

**Requirements:**
- Use Zustand's `persist` middleware with the `localStorage` storage adapter.
- Persisted data includes: list of profiles, active profile ID, and each profile's full settings object.
- Schema changes must be handled with a migration strategy (Zustand `version` + `migrate` option) to avoid stale data crashes.
- No backend or cloud storage is required.

---

### F-100 — Multiple Named Profiles

**Priority:** High  
**Status:** Not started

Users can create, rename, duplicate, and delete named light profiles.

**Requirements:**
- At least one default profile exists on first launch (e.g., "Default").
- Each profile has a unique ID (UUID) and a human-readable name (max 64 characters).
- Users can create a new profile (duplicates settings from the currently active profile).
- Users can rename a profile inline within the settings modal.
- Users can delete a profile; if the active profile is deleted, the app switches to another available profile.
- The active profile is visually indicated in the profile selector within the settings modal.
- Profiles are listed and selectable in the settings modal.

---

### F-110 — Profile Settings

**Priority:** Critical  
**Status:** Not started

Each profile stores a complete set of light appearance parameters.

**Requirements:**

| Parameter | Type | Description |
|---|---|---|
| `name` | `string` | Human-readable profile name |
| `lightColor` | `string` (hex / hsl) | Base hue of the light (default: `#ffffff`) |
| `brightness` | `number` (0–100) | Brightness percentage |
| `colorTemperature` | `number` (1000–10000 K) | Warm-to-cool white balance slider |
| `ringFormat` | `"full" \| "circle" \| "border"` | Light surface shape |
| `innerRadius` | `number` (0–100 %) | Inner radius (for `"circle"` and `"border"` formats) |
| `outerRadius` | `number` (0–100 %) | Outer radius (for `"circle"` and `"border"` formats) |

- `"full"` fills the entire viewport.
- `"circle"` renders an annulus defined by `innerRadius` and `outerRadius` relative to the viewport's shorter dimension.
- `"border"` renders a rectangular frame band with configurable thickness via `innerRadius` / `outerRadius`.
- All parameter changes apply **live** (no save/apply button).

---

### F-120 — Live Settings Modal (Gear Icon)

**Priority:** Critical  
**Status:** Not started

A compact, always-accessible settings panel lets users adjust all parameters in real time.

**Requirements:**
- A small gear icon button is fixed in the top-right corner of the screen, visible in all states.
- Clicking the gear icon opens a modal (Radix UI `Dialog` or shadcn/ui `Sheet`).
- The modal contains:
  - Profile selector / manager (create, rename, delete, switch).
  - `lightColor` color picker.
  - `colorTemperature` slider (1000 K – 10 000 K).
  - `brightness` slider (0 – 100 %).
  - `ringFormat` segmented control or select.
  - `innerRadius` and `outerRadius` sliders (conditionally shown for `"circle"` and `"border"` formats).
- Every control change updates Zustand state immediately; the light surface re-renders and the new value is persisted in `localStorage` without any explicit save action.
- Controlled with React Hook Form + Zod for validation; form values stay in sync with Zustand state.
- The modal can be closed via the × button, pressing Escape, or clicking outside.

---

### F-130 — Fullscreen Toggle

**Priority:** Medium  
**Status:** Not started

Users can enter and exit native fullscreen mode with a single button press.

**Requirements:**
- A fullscreen toggle button is fixed beside the gear icon in the top-right corner.
- Uses the Fullscreen API (`document.documentElement.requestFullscreen()` / `document.exitFullscreen()`).
- Icon changes to reflect the current state (enter fullscreen / exit fullscreen).
- Handles environments where the Fullscreen API is unavailable without crashing.
- Keyboard shortcut `F` (when focus is not in a text input) also toggles fullscreen.

---

### F-140 — Profile Share via URL

**Priority:** Medium  
**Status:** Not started

Users can share a specific profile configuration via a URL that any recipient can load.

**Requirements:**
- A share button is accessible within the settings modal (or as a dedicated icon in the UI).
- Clicking share serialises the active profile's settings into a URL query parameter (e.g., `?profile=<base64-encoded-JSON>`).
- The URL is copied to the clipboard and/or the browser's native Share API is invoked.
- When the app loads and detects a `profile` query parameter:
  1. Decode and validate the parameter (Zod schema).
  2. Either apply it as a temporary override or offer to load it as a new named profile.
  3. Remove the `?profile=…` parameter from the URL (using `history.replaceState`) so it does not persist across refreshes.
- Invalid or tampered parameters are silently ignored (no crash).

---

## Non-Functional Requirements

| NFR | Description |
|---|---|
| Performance | First Contentful Paint < 1 s on a mid-range mobile device on Wi-Fi. |
| Accessibility | WCAG 2.1 AA for all interactive controls (gear button, modal, sliders). |
| Responsiveness | Fully usable on mobile (portrait & landscape), tablet, and desktop. |
| Browser support | Latest two versions of Chrome, Firefox, Safari, and Edge. |
| Security | No external network requests at runtime. All data stays in `localStorage`. URL parameter input validated with Zod before use. |
| Offline | App is fully functional offline after first load (via PWA service worker). |

---

## Out of Scope (v1)

- User accounts or cloud sync.
- Audio features.
- Video capture / recording.
- Backend API of any kind.
- Analytics or telemetry.
