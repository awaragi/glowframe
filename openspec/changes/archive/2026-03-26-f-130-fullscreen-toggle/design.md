## Context

GlowFrame's `LightPage` currently renders `LightSurface` behind a fixed `GearButton` at `top-4 right-4`. The app has no mechanism to enter native browser fullscreen. Users operating in a browser window lose roughly 10–15 % of light-emitting area to browser chrome (address bar, tabs, OS window frame), which reduces the effectiveness of the fill light.

The `useWakeLock` hook (already in `src/hooks/`) provides a reference pattern for encapsulating a browser API in a React hook with an availability guard.

## Goals / Non-Goals

**Goals:**
- Provide a `useFullscreen` hook that abstracts `requestFullscreen` / `exitFullscreen`, tracks current state reactively, and fails silently when the API is unavailable.
- Provide a `FullscreenButton` component that renders beside the gear icon and changes icon based on fullscreen state.
- Support keyboard shortcut `F` to toggle fullscreen when a text input is not focused.
- No crashes or console errors on iOS Safari or other environments that do not implement the Fullscreen API.

**Non-Goals:**
- Persisting fullscreen preference across sessions.
- Entering fullscreen on a specific DOM element (always `document.documentElement`).
- Polyfilling the Fullscreen API for unsupported browsers.
- Changing any other layout or behavioural aspect of `LightPage`.

## Decisions

### D1 — Custom hook, not inline component logic

**Decision:** Encapsulate all Fullscreen API interaction in `useFullscreen` returning `{ isFullscreen, isAvailable, toggle }`.

**Rationale:** Mirrors the existing `useWakeLock` pattern; keeps `FullscreenButton` a pure presentational component; makes the hook independently unit-testable with mock APIs.

**Alternative considered:** Inline logic directly in `LightPage` — rejected because it scatters side-effect management and makes testing harder.

---

### D2 — `fullscreenchange` event for reactive state

**Decision:** Listen to `document.addEventListener('fullscreenchange', …)` to update `isFullscreen` state, rather than polling or relying on promise resolution alone.

**Rationale:** `fullscreenchange` fires reliably when the user exits fullscreen via the Escape key or the browser's built-in UI, ensuring the button icon stays in sync regardless of how fullscreen was exited.

---

### D3 — Availability guard via `document.fullscreenEnabled`

**Decision:** Check `'fullscreenEnabled' in document && document.fullscreenEnabled` to set `isAvailable`. When unavailable, hide the button entirely (don't render a disabled button).

**Rationale:** A disabled button on iOS Safari offers no value and may confuse users. Hiding it keeps the UI clean. The Fullscreen API is a progressive enhancement, not a core requirement.

---

### D4 — Keyboard shortcut `F` via `keydown` listener on `document`

**Decision:** Register a `keydown` listener in `LightPage` (not in the hook) that calls `toggle()` when `key === 'F'` (case-insensitive) and `document.activeElement` is not an `<input>`, `<textarea>`, or `[contenteditable]`.

**Rationale:** Keeping the shortcut in `LightPage` separates UI interaction policy from API mechanics. The hook remains reusable without embedded keyboard logic.

**Alternative considered:** Including the shortcut in the hook — rejected for same reusability reason.

---

### D5 — Button placement: left of gear icon

**Decision:** `FullscreenButton` is positioned at `top-4 right-16` (two icon widths from the right) so it sits immediately left of the gear button without overlap.

**Rationale:** A predictable fixed position is consistent with `GearButton` styling. Using Tailwind's spacing scale avoids custom CSS. The two-button cluster stays in the same corner for discovoverability.

**Icon choice:** `Maximize2` (enter fullscreen) / `Minimize2` (exit fullscreen) from `lucide-react`, which is already a project dependency.

## Risks / Trade-offs

- **iOS Safari unsupported** → Mitigated by D3 (button is hidden entirely when API unavailable).
- **Escape key exits fullscreen without button involvement** → Mitigated by D2 (`fullscreenchange` event keeps state in sync).
- **Promise rejection from `requestFullscreen`** (e.g., if called outside a user gesture in some browsers) → `toggle` wraps both calls in try/catch and swallows errors silently, consistent with `useWakeLock` pattern.
- **`right-16` placement may collide if more buttons are added** → Acceptable for now; layout of the button cluster can be revisited when a third button is needed (F-140 share).
