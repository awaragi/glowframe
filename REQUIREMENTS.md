# GlowFrame — Business Requirements Document (BRD)

> **Concept:** "Be white, be bright." — Turn any display into a soft, customizable front-facing fill light for video recording, calls, and selfies.

---

## Implementation Checklist

Use this checklist to track overall feature completion status.

- [x] **F-010** Project scaffolding (Vite + React 19 + TypeScript + Tailwind + shadcn/ui)
- [x] **F-020** ESLint + Prettier code quality setup
- [x] **F-025** Guiding principles for AI (GitHub Copilot)
- [x] **F-030** Unit tests (Vitest + React Testing Library)
- [x] **F-040** End-to-end tests (Playwright)
- [x] **F-050** Committed `docs/` build for GitHub Pages serving
- [x] **F-055** E2E test targeting — local dev and GitHub Pages modes
- [x] **F-060** Core light display — full-screen white/colored fill light
- [x] **F-070** Screen Wake Lock API integration
- [x] **F-080** Progressive Web App (PWA) support
- [x] **F-090** Local storage persistence via Zustand
- [x] **F-100** Multiple named profiles
- [x] **F-110** Profile settings — light color, brightness, ring format, radii
- [x] **F-120** Live settings modal (gear icon, top-right)
- [x] **F-130** Fullscreen toggle button
- [ ] **F-140** Profile share button (URL parameter, auto-clean)
- [x] **F-150** E2E demo mode (headed, slowed, sequential)
- [ ] **F-160** Ring radius cross-validation (enforce innerRadius < outerRadius)
- [ ] **F-165** Preset reordering with visible sequence numbers
- [x] **F-170** Keyboard shortcuts help dialog (`?` icon, grouped modal)
- [x] **F-175** Keyboard shortcuts for params + number keys to switch presets
- [ ] **F-180** Touch gestures — swipe left/right cycles presets, swipe up/down changes brightness
- [ ] **F-185** Profile bulk import / export — download and restore all presets as a JSON file
- [ ] **F-190** What's New dialog — surface release notes when a new PWA version installs
- [ ] **F-200** PWA update alert — notify the user when a new version is available and prompt reload
- [x] **F-210** App version display in the keyboard shortcuts help dialog footer

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

### F-150 — E2E Demo Mode

**Priority:** Low  
**Status:** Complete

Provide a way to run the Playwright end-to-end suite in a visible, slowed-down mode suitable for live technical demonstrations.

**Requirements:**
- Add an opt-in `E2E_DEMO=true` environment variable that activates demo mode.
- When active, launch the browser in headed (non-headless) mode.
- When active, apply a `slowMo` delay of ~800 ms per action so interactions are clearly visible.
- When active, disable `fullyParallel` so tests run sequentially and are easy to follow.
- Expose a `test:e2e:demo` npm script that sets `E2E_DEMO=true` and runs `playwright test`.
- Existing `test:e2e` and `test:e2e:prod` scripts must remain unaffected and continue to run headlessly at full speed.

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

### F-050 — Committed `docs/` Build for GitHub Pages

**Priority:** Critical  
**Status:** Not started

The compiled production build lives inside the repository so GitHub Pages can serve it directly from the `docs/` folder without a separate CI deployment pipeline.

**Requirements:**
- `docs/` is **not** listed in `.gitignore`; it is tracked and committed to the repository.
- A `.nojekyll` file is placed inside `docs/` so GitHub Pages does not process the folder with Jekyll.
- `npm run build` regenerates `docs/` locally; the developer commits the updated `docs/` as part of any release.
- The Vite `base` config matches the GitHub Pages sub-path (e.g., `/glowframe/`) so all asset URLs resolve correctly.
- A `CNAME` file can optionally be placed in `docs/` to support a custom domain without re-running the build.
- GitHub Pages is configured in the repository settings to serve from the `docs/` folder on the `main` branch.
- The `src/` source files, config files, and `node_modules/` remain in `.gitignore` as appropriate; only the compiled output in `docs/` is intentionally committed.
- A brief note in `README.md` explains the build-and-commit workflow so contributors know how to release updates.
- Future migration to a custom domain or sub-path must require only a `base` change in `vite.config.ts`.

---

### F-055 — E2E Test Targeting (Local Dev and GitHub Pages)

**Priority:** High  
**Status:** Not started

Playwright tests must be runnable against both the local dev server and the deployed GitHub Pages instance so that regressions can be caught before and after release.

**Requirements:**
- Two test modes are supported without modifying test files:
  - **Local mode** (default): targets `http://localhost:5173`, spins up `npm run dev` automatically.
  - **Pages mode**: targets the live GitHub Pages URL (`https://awaragi.github.io/glowframe/`), does **not** start a dev server.
- Mode is selected via an environment variable (e.g., `E2E_TARGET=pages`).
- `npm run test:e2e` runs local mode.
- `npm run test:e2e:pages` runs Pages mode.
- The `baseURL` seen by tests is set automatically by the mode — test code never hardcodes a URL.
- Both modes work with the same test files in `e2e/`.

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
**Status:** Complete

Prevent the device display from going dark during use.

**Requirements:**
- Request a `screen` wake lock when the app mounts or becomes visible.
- Release the wake lock when the page is hidden or unloaded.
- Re-acquire the wake lock automatically if the page regains visibility (e.g., after a tab switch).
- Handle environments where the Wake Lock API is unavailable gracefully (no crash, no user-facing error unless meaningful).

---

### F-080 — Progressive Web App (PWA)

**Priority:** High  
**Status:** Complete

Allow users to install GlowFrame as a standalone app on any device.

**Requirements:**
- Provide a `manifest.webmanifest` with name, short name, icons (at least 192 × 192 and 512 × 512), `display: standalone`, `background_color: #ffffff`, `theme_color: #ffffff`.
- Register a service worker (via `vite-plugin-pwa` or equivalent) for offline capability.
- The installed app must open directly to the light surface without browser chrome.
- Lighthouse PWA audit must pass all installability criteria.

---

### F-090 — Local Storage Persistence

**Priority:** Critical  
**Status:** Complete

All user profiles and settings survive page reloads and browser restarts.

**Requirements:**
- Use Zustand's `persist` middleware with the `localStorage` storage adapter.
- Persisted data includes: list of profiles, active profile ID, and each profile's full settings object.
- Schema changes must be handled with a migration strategy (Zustand `version` + `migrate` option) to avoid stale data crashes.
- No backend or cloud storage is required.

---

### F-100 — Multiple Named Profiles

**Priority:** High  
**Status:** Complete

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
**Status:** Complete

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
**Status:** Complete

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
**Status:** Complete

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

### F-160 — Ring Radius Cross-Validation

**Priority:** Medium  
**Status:** Not started

Prevent invalid ring geometry by ensuring `innerRadius` is always strictly less than `outerRadius` whenever a ring format is active.

**Requirements:**
- The Zod schema for profile settings must include a `.refine()` rule that rejects any configuration where `innerRadius >= outerRadius` when `ringFormat` is `"circle"` or `"border"`.
- The settings modal must surface a clear, inline validation message adjacent to the radius sliders when the constraint is violated (e.g., *"Inner radius must be smaller than outer radius"*).
- React Hook Form must prevent the form from persisting an invalid state to Zustand; the last valid values must be retained in the store until the user resolves the conflict.
- When the user drags `innerRadius` up to meet or exceed `outerRadius`, the UI must clamp or warn — not silently apply broken values.
- Unit tests must cover: valid combinations, boundary violations (equal values), and the Zod refinement error message.
- E2E scenario: attempt to set equal radii via the sliders and verify the error message appears and settings are not corrupted.

---

### F-165 — Preset Reordering and Sequence Numbers

**Priority:** Low  
**Status:** Not started

Allow users to reorder their saved presets and display a persistent sequence number beside each preset so the order is visible and aligns with keyboard shortcuts (`1`–`9`) and touch-swipe navigation.

**Requirements:**
- Each preset in the settings modal profile list displays a sequence number badge (e.g., `1`, `2`, `3`, …) to the left of the preset name.
- Users can reorder presets by drag-and-drop within the profile list in the settings modal.
- Drag-and-drop must use a keyboard-accessible approach (Radix UI or equivalent) so the order can also be changed without a pointer device.
- The sequence number updates live as items are dragged; it always reflects the current position in the list.
- Preset order is persisted in Zustand / `localStorage` as part of the profile list array ordering; no separate `order` field is required.
- Only the first 9 presets are reachable via `1`–`9` keyboard shortcuts (F-175) and left/right swipe (F-180); presets beyond position 9 are still accessible via the settings modal but have no shortcut.
- The sequence number badge is visually distinct from the preset name and does not overflow or truncate for single or double-digit numbers.
- Reordering must not change any preset's settings, name, or ID — only its position in the list.
- Unit tests must cover: reorder action updates array order correctly, sequence numbers derive from array index, positions beyond 9 are accessible but have no shortcut.
- E2E scenario: drag preset #3 to position #1, verify the sequence numbers update and pressing `1` on the keyboard activates the relocated preset.

---

### F-170 — Keyboard Shortcuts Help Dialog

**Priority:** Low  
**Status:** Not started

Provide a discoverable help dialog that lists all available keyboard shortcuts, grouped by context, rather than cluttering individual controls with per-button hints.

**Requirements:**
- A `?` icon button is fixed in the top-right corner alongside the gear and fullscreen buttons.
- Clicking `?` (or pressing `?` / `Shift+/` when focus is not in a form control) opens a modal dialog listing all keyboard shortcuts.
- The dialog uses a Radix UI `Dialog` / shadcn/ui `Dialog` primitive and is closeable via the × button, `Escape`, or clicking outside.
- Shortcuts are presented in a two-column (`key` | `action`) table, organised under the following named groups:
  - **Global** — shortcuts active in all states (e.g., `F` fullscreen, `S` settings, `?` help).
  - **Light surface** — shortcuts active when the settings modal is closed (e.g., `↑` / `↓` brightness, `←` / `→` color temperature, `1`–`9` preset selection).
  - **Ring & Border modes** — shortcuts that only apply when `ringFormat` is `"circle"` or `"border"` (e.g., `[` / `]` outer radius, `{` / `}` inner radius).
  - **Settings modal** — shortcuts active inside the settings modal (e.g., `Escape` close).
- Keys are rendered with `<kbd>` elements for semantic correctness and visual clarity.
- The dialog itself must not intercept any of the listed shortcuts (except `Escape` to close).
- Shortcut handling must be centralised in a single `useKeyboardShortcuts` hook so bindings are easy to audit and extend.
- The hook must be fully unit-tested (all registered shortcuts, focus-guard behaviour).
- The `?` button must have an `aria-label="Keyboard shortcuts"` for screen-reader users.

---

### F-175 — Keyboard Shortcuts for Parameter Adjustment and Preset Switching

**Priority:** Low  
**Status:** Not started

Provide keyboard shortcuts for switching between saved presets (profiles) by their sequence number, and for incrementally adjusting the active profile's parameters without opening the settings modal.

**Requirements:**

**Preset selection (works in all states when focus is not in a form control):**

| Key | Action |
|---|---|
| `1` | Switch to preset #1 (first in display order) |
| `2` | Switch to preset #2 |
| `3` | Switch to preset #3 |
| `4`–`9` | Switch to preset #4–#9 if they exist; no-op otherwise |

- The sequence number of each preset is determined by its display order as defined in F-165; the number shown next to the preset in the UI matches the keyboard shortcut key.
- If fewer presets exist than the key pressed, the shortcut is silently ignored.

**Parameter adjustment (works in all states when focus is not in a form control):**

| Key | Parameter | Step |
|---|---|---|
| `←` / `→` | `colorTemperature` | −100 K / +100 K |
| `↑` / `↓` | `brightness` | +5 % / −5 % |
| `[` / `]` | `outerRadius` | −2 % / +2 % (only in `"circle"` and `"border"` modes) |
| `{` / `}` (Shift+`[`/`]`) | `innerRadius` | −2 % / +2 % (only in `"circle"` and `"border"` modes) |

**Constraints:**
- All adjustments must clamp to the parameter's valid range (e.g., brightness stays within 0–100 %; colorTemperature within 1000–10 000 K; radii within 0–100 %).
- `innerRadius` adjustments must not allow `innerRadius` to reach or exceed the current `outerRadius` (and vice-versa); the value is clamped silently at `outerRadius − 1` (or `innerRadius + 1` respectively).
- All shortcuts must be absorbed by the centralised `useKeyboardShortcuts` hook introduced in F-170; F-175 extends that hook's binding table.
- Shortcuts must not fire when focus is inside a text input, `<select>`, or other form control, or when the settings modal has focus.
- Each shortcut binding must appear in the appropriate context group within the F-170 keyboard shortcuts help dialog.
- Unit tests must cover: each preset-switch binding (including out-of-range no-op), each parameter-adjustment step, boundary clamping, and the innerRadius/outerRadius guard.
- E2E scenario: with at least two presets saved, press `2` to switch to preset #2, adjust brightness with `↑`, adjust color temperature with `→`, adjust outerRadius with `]`, and verify the surface updates live.

---

### F-180 — Touch Gestures on the Light Surface

**Priority:** Medium  
**Status:** Not started

Allow touch-screen users to cycle between presets and adjust brightness directly on the light surface without opening any UI controls.

**Requirements:**

| Gesture | Action |
|---|---|
| Swipe left | Switch to the next preset in display order (wraps from last to first) |
| Swipe right | Switch to the previous preset in display order (wraps from first to last) |
| Swipe up | Increase `brightness` by 5 % (clamped at 100 %) |
| Swipe down | Decrease `brightness` by 5 % (clamped at 0 %) |

- A swipe is recognised when the touch travel distance exceeds a minimum threshold (≥ 40 px) and the gesture is predominantly horizontal or vertical (dominant-axis detection).
- Diagonal swipes below a 60°/30° axis split are ignored to avoid ambiguous triggers.
- Gesture detection must be implemented in a `useTouchGestures` hook that accepts callbacks; it must not depend on any third-party gesture library.
- The hook attaches `touchstart` / `touchend` listeners to the light-surface element (not `window`) to avoid interfering with browser scroll or other elements.
- Gesture events must not propagate to open any settings modal or trigger any button action.
- When only a single preset exists, left/right swipe is a no-op.
- A brief, non-intrusive visual cue (e.g., a transient toast or edge flash) must indicate which preset was switched to, so the user has feedback without looking at the UI.
- The `useTouchGestures` hook must be fully unit-tested (direction detection, threshold guard, axis-dominance logic, single-preset no-op).
- E2E scenario (touch-emulated): simulate a left swipe on the light surface and verify the active preset changes; simulate a swipe-up and verify brightness increases.

---

### F-185 — Profile Bulk Import / Export

**Priority:** Low  
**Status:** Not started

Allow users to back up their entire preset library and restore it on another device, browser, or after clearing storage — without being limited to sharing one profile at a time via URL (F-140).

**Requirements:**

**Export:**
- An **Export all presets** button is available in the settings modal (e.g., in the profile manager section footer).
- Clicking it triggers a browser file download of `glowframe-profiles.json`.
- The file contains a versioned envelope:
  ```json
  { "version": 1, "exportedAt": "<ISO timestamp>", "profiles": [ … ] }
  ```
- The `profiles` array is the full Zustand profile list serialised to plain JSON, including every parameter defined in F-110.
- The exported `version` field matches the Zustand store schema version (F-090) so future migrations can handle old files.

**Import:**
- An **Import presets** button opens a native `<input type="file" accept=".json">` file picker (no drag-and-drop required in this version).
- The selected file is read fully in-browser using the `FileReader` API — no network upload ever occurs.
- Validation pipeline (all steps run before mutating state):
  1. Parse as JSON; reject with "Not a valid JSON file" on parse failure.
  2. Validate the envelope shape and `version` field with a Zod schema; reject with "Unrecognised file format" if the envelope is invalid.
  3. Validate each profile entry against the full profile Zod schema; entries that fail are skipped individually (partial import allowed).
  4. If the `version` in the file is older than the current store schema version, apply the same migration logic used by Zustand's `migrate` option before validating entries.
- Merge strategy for valid entries:
  - Profiles whose `id` already exists in the store are skipped (not overwritten).
  - Profiles whose `name` already exists (but different `id`) have a numeric suffix appended, e.g., "Sunset (2)".
  - Profiles whose `id` and `name` are both new are appended to the end of the list.
- On completion, a toast notification summarises the outcome, e.g., *"5 presets imported, 2 skipped (already exist), 1 skipped (invalid)"*.
- On any fatal error (envelope invalid, JSON unparseable), the existing profile list must not be mutated.
- The import button is disabled while a file is being processed to prevent double-submission.
- Unit tests must cover: valid round-trip (export then import), `id` collision skip, name-collision suffix, partial import on mixed-validity input, envelope schema rejection, pre-migration file handling, fatal-error state-preservation guarantee.
- E2E scenario: create three named presets, export, clear `localStorage`, reload, import the file, verify all three presets appear with correct settings; then import the same file again and verify duplicates are skipped with the toast reporting them.

---

### F-190 — What's New Dialog

**Priority:** Low  
**Status:** Not started

Inform users of meaningful changes when a new version of the PWA silently updates in the background, so they notice improvements without hunting for release notes or being confused by changed behaviour.

**Requirements:**

**Version tracking:**
- The build embeds a version string via a Vite define constant (e.g., `import.meta.env.VITE_APP_VERSION`, populated from `package.json` version at build time).
- The app stores the last-seen version in `localStorage` under a dedicated key (separate from the Zustand profile store).
- On every app load, the stored version is compared to the embedded version. If they differ — or no stored version exists and the app has pre-existing profile data (i.e., not a true first install) — the What's New dialog is queued to show.

**Dialog content:**
- Release notes are embedded as a static structured constant in the source (e.g., `src/lib/changelog.ts`) — no network request, no markdown file parsing at runtime.
- Each release entry has: `version` string, `date` string, and an array of `{ category, text }` note items.
- Categories are: `New`, `Improved`, `Fixed`. Each note is rendered with a coloured badge and a single descriptive sentence.
- Only the notes for the current version are shown by default; an expandable "Previous releases" disclosure reveals older entries.

**Dialog behaviour:**
- The dialog is shown automatically on the first render after a version change, using a Radix UI `Dialog` primitive.
- It must not block interaction — it renders as an overlay and does not trap focus aggressively (user can click outside to dismiss).
- Dismissal options: "Got it" button, `Escape` key, or clicking outside. On any dismissal, the current version is written to `localStorage`.
- The dialog does **not** re-appear on subsequent reloads until the next version increment.
- A "What's New" link in the settings modal footer (and optionally in the F-170 help dialog) opens the dialog manually at any time, regardless of version state.

**First-install handling:**
- On a genuine first install (no stored version and no pre-existing profile data), the dialog is suppressed — the user does not need to be greeted with release notes for a fresh install.

**Testing:**
- Unit tests must cover: version-bump triggers dialog, same-version suppresses dialog, genuine first-install suppression, dismissal writes version to storage, manual open from settings ignores version state.
- E2E scenario: load the app with a mocked previous version in `localStorage`, verify the dialog appears automatically, dismiss it, reload, verify it does not reappear.

---

### F-200 — PWA Update Alert

**Priority:** Medium  
**Status:** Not started

Inform the user when a new version of the PWA has been downloaded in the background and is ready to activate, so they are never silently running stale code.

**Requirements:**

**Detection:**
- The service worker lifecycle is monitored via the `vite-plugin-pwa` `useRegisterSW` hook (or equivalent `workbox-window` API).
- When the service worker signals that a new version is waiting (`needRefresh` / `waiting` state), the update UI is triggered.

**Alert UI:**
- A non-blocking toast or banner notification appears at the bottom of the screen informing the user: *"A new version is available."*
- The notification includes a **Reload** (or **Update**) action button and a **Dismiss** button.
- Uses a shadcn/ui `Toast` (via `useToast` / Sonner) or a fixed banner built from Radix UI primitives — no custom low-level DOM manipulation.
- The notification must not obscure the light surface controls; it should be visually unobtrusive.

**Reload behaviour:**
- Clicking **Reload** calls `skipWaiting()` on the waiting service worker and then reloads the page (`window.location.reload()`) so the new version activates immediately.
- Clicking **Dismiss** hides the notification for the remainder of the session. The waiting worker remains in place and activates on the next natural page load.
- If the user dismisses and later opens the settings modal, a subtle "Update available" indicator with a **Reload now** link is visible in the modal footer as a persistent reminder.

**Constraints:**
- The alert must never appear on a fresh install (no waiting worker scenario).
- The alert must not loop or re-trigger if the user dismisses it without reloading.
- All service worker interaction must be mediated through `vite-plugin-pwa`'s provided hooks — do not register a custom service worker.

**Testing:**
- Unit tests must cover: `needRefresh` true triggers visible notification, dismiss hides notification, reload calls `skipWaiting` and `window.location.reload`.
- E2E scenario (optional / manual): install the PWA, deploy a new build, reopen the app, verify the update toast appears and reloading switches to the new version.

---

### F-210 — App Version in Help Dialog Footer

**Priority:** Low  
**Status:** Not started

Display the current application version at the bottom of the keyboard shortcuts help dialog (F-170) so users and support staff can quickly verify which build is running without opening developer tools.

**Requirements:**
- The `package.json` `version` field is injected at build time as a Vite define constant (e.g., `import.meta.env.VITE_APP_VERSION`), populated via `define: { 'import.meta.env.VITE_APP_VERSION': JSON.stringify(process.env.npm_package_version) }` in `vite.config.ts`.
- The keyboard shortcuts help dialog footer renders the version string in the format `v<semver>` (e.g., `v1.2.0`).
- The version text is visually de-emphasised (e.g., muted colour, small type) so it does not compete with the shortcut content.
- The value is sourced exclusively from the build-time constant — no runtime `fetch`, no `package.json` import.
- Unit tests must cover: the version string renders correctly given a mocked `import.meta.env.VITE_APP_VERSION` value.
- No E2E scenario required beyond the existing F-170 smoke coverage.

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
