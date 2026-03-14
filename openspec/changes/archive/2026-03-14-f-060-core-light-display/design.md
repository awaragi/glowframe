## Context

GlowFrame currently has a scaffolded Vite + React 19 + TypeScript project with Zustand, Tailwind CSS, and a placeholder `ConfigPage`. The Zustand store is empty aside from a `_version` field. There is no light display surface yet. This change introduces the core visual output — a full-viewport background panel — and the minimal store state needed to drive it.

## Goals / Non-Goals

**Goals:**
- Render a full-viewport (`100vw × 100vh`) `LightSurface` component as the root view.
- Derive background color from `lightColor` (hex) and `brightness` (0–100) stored in Zustand.
- Re-render the surface immediately when either value changes (live preview).
- Eliminate scrollbars and unwanted chrome from the light view.
- Keep the Zustand store structure forward-compatible with future profile and settings features (F-090, F-110).

**Non-Goals:**
- Gear icon, fullscreen button, or any other UI overlay (F-120, F-130).
- Multiple profiles (F-100).
- localStorage persistence (F-090) — the store will use Zustand but without the persist middleware for now (or persist with the existing key if it is already set up).
- Color temperature, ring formats, or other advanced settings (F-110).

## Decisions

### Brightness applied via CSS `filter: brightness()`

**Decision:** Apply brightness by wrapping `lightColor` into a `div` with `style={{ filter: \`brightness(${brightness / 100})\` }}`.

**Alternatives considered:**
- *Darken the hex value in JS* — requires manual color math; loses accuracy at edge values.
- *Mix with black using `color-mix()`* — good browser support now, but not universally supported in the test matrix and adds complexity.
- *`opacity` on a black overlay* — visually equivalent but adds DOM nesting and complicates future effects.

`filter: brightness()` is a single inline style on a dynamic computed value, which is explicitly permitted by the project's Tailwind-only styling rule.

### `lightColor` stored as hex string

**Decision:** Store `lightColor` as a CSS hex string (e.g., `#ffffff`). Default is `#ffffff`.

**Rationale:** Hex is the most portable format — directly usable as a CSS value, unambiguous for serialization, and supported by every color input primitive.

### Brightness stored as `number` (0–100)

**Decision:** Store `brightness` as an integer percentage from 0 to 100. Default is `100`.

**Rationale:** Matches the F-110 spec's stated type and maps directly to the slider range. Dividing by 100 produces the `filter: brightness()` factor.

### `LightSurface` reads from Zustand directly

**Decision:** `LightSurface` calls `useAppStore` internally rather than receiving props.

**Rationale:** This is shared UI state (driven by settings, eventually from a modal). Prop-drilling would violate the Zustand-for-shared-state rule established in the project conventions.

### Route structure

**Decision:** Replace the current `ConfigPage` at `/` with the new `LightPage` that renders only `LightSurface`.

**Rationale:** The light surface is the app's primary view. No routing structure changes are needed at this stage; a single `/` route is sufficient.

## Risks / Trade-offs

- [`filter: brightness(0)` produces full black] → Acceptable; brightness = 0 is a valid "off" state.
- [Store grows over time] → Mitigated by the forward-compatible structure (lightColor, brightness as top-level fields that will later move into a profile object in F-100).
- [Removing ConfigPage breaks E2E smoke tests] → Smoke tests must be updated to assert on the light surface rather than the old placeholder content. This is in scope for this change.

## Open Questions

<!-- none -->
