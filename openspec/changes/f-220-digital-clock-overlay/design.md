## Context

GlowFrame is a React 19 + TypeScript app using Zustand with `persist` middleware (current store schema version: 4), Tailwind CSS for all styling, and `@base-ui/react` as the component primitive library. The settings modal is a `Sheet` (right-side drawer) built on `@base-ui/react`. Profile state is the single source of truth — all per-profile settings live in the Zustand store.

The clock overlay must be a fixed-position element rendered on the light surface, always behind the application button cluster (top-right), legible over any background colour or brightness level, and updated every second. All clock configuration (visibility, position, size, format) is per-profile and persisted alongside existing profile fields.

## Goals / Non-Goals

**Goals:**
- Add a live digital clock overlay driven by per-profile settings
- Extend the profile schema with four clock fields (defaults applied to new profiles only)
- Restructure the settings modal into a two-tab layout (Light / Clock) without changing existing light controls
- Keep the clock off by default to preserve the existing clean light-surface experience
- Use `@base-ui/react/tabs` — already installed, no new dependencies

**Non-Goals:**
- Custom fonts or animated clock transitions
- Time zone configuration (system local time only)
- A/B corner at top-right (reserved permanently for application buttons)
- Any server-side or networked time synchronisation

## Decisions

### Decision 1 — `useClockTime` hook with `setInterval`

The clock time is derived from `new Date()` ticked via `setInterval(1000)` inside a `useClockTime(format)` hook. The hook returns the formatted time string directly, clearing the interval on unmount.

**Alternatives considered:**
- `requestAnimationFrame`: Higher precision but 60 fps re-renders for a 1-second display are wasteful.
- `Date` worker: Unnecessary complexity for a display-only feature.

**Rationale:** A 1-second interval is correct granularity, cheap, and directly testable by mocking `Date`.

### Decision 2 — Format string handled by a pure `formatTime(date, format)` utility

Time formatting is extracted to a pure `formatTime(date: Date, format: ClockFormat): string` function in `src/lib/clockFormat.ts`. This function handles the four supported format tokens (`HH:mm`, `HH:mm:ss`, `hh:mm a`, `hh:mm:ss a`) with zero runtime dependencies.

**Alternatives considered:**
- `date-fns` or `Intl.DateTimeFormat`: Correct approach for complex i18n needs, but unnecessary for four hardcoded patterns. Adding a dependency for this is over-engineering.

**Rationale:** Pure function is trivially testable with a fixed `Date` object and introduces no bundle weight.

### Decision 3 — Clock position encoded as Tailwind class map, not inline styles

Each `clockPosition` value maps to a fixed set of Tailwind utility classes (`top-4 left-4`, `bottom-4 left-4`, `bottom-4 right-4`). The `ClockOverlay` component selects the class set via a lookup object — no computed inline styles.

**Alternatives considered:**
- CSS custom properties / inline `style`: Would require dynamic value computation and bypass Tailwind's purging semantics.

**Rationale:** Tailwind classes are statically present, consistent with project conventions, and fully testable (unit test asserts class presence given position value).

### Decision 4 — `@base-ui/react/tabs` for the settings modal tab bar

The settings modal gains a two-tab layout using `@base-ui/react/tabs` (already installed). The profile management panel renders above the `Tabs.Root` so it is always visible regardless of active tab. Tab 1 (Light) wraps existing light-surface controls verbatim; Tab 2 (Clock) contains new clock controls via React Hook Form fields synced to Zustand.

**Alternatives considered:**
- Custom CSS-toggle tab: Simpler markup but not keyboard-accessible by default.
- Separate modal for clock settings: Avoids tab restructuring but fragments the UX.

**Rationale:** `@base-ui/react/tabs` provides WAI-ARIA `role="tablist"` / `role="tab"` / `role="tabpanel"` semantics and arrow-key navigation with no extra code. It is already available in the installed package.

### Decision 5 — Clock fields added directly to the `Profile` union type

The four clock fields (`clockEnabled`, `clockPosition`, `clockSize`, `clockFormat`) are appended directly to the `Profile` base type (the `{ id, name } & ProfileMode` union), not to individual mode sub-types. This means all six modes share the same clock configuration shape without duplication.

**Rationale:** Clock settings are orthogonal to light mode — they behave identically across `full`, `full-color`, `ring`, etc. Putting them in the base makes the migration straightforward: one default value set applies to all profiles uniformly.

### Decision 6 — Clock fields added to the profile schema with defaults; no migration

The four clock fields are added to the `Profile` type and the `_defaultProfile` constant with their defaults (`clockEnabled: false`, `clockPosition: 'bottom-right'`, `clockSize: 'medium'`, `clockFormat: 'HH:mm'`). The store schema version is **not** bumped; no `migrate` function is added. Any existing `localStorage` data from before this change is treated as a clean install.

**Rationale:** Simplest approach. Migration complexity is not justified when the clock is a purely additive, off-by-default feature.

## Risks / Trade-offs

- **`setInterval` drift**: 1-second intervals can drift slightly over hours. For a display clock this is acceptable; the next `new Date()` call auto-corrects. → No mitigation needed.
- **Settings modal restructuring**: Moving existing light controls into a tab panel changes the DOM structure, which could break existing Playwright selectors. → E2E tests for settings must be updated to navigate to Tab 1 first; this is a known, bounded change.
- **No migration**: Existing `localStorage` profiles will lack clock fields and will be treated as a fresh start. This is acceptable — the feature is new and off by default.
- **Tab default state**: If a future feature causes the modal to open on Tab 2, the default must be re-evaluated. → `defaultValue="light"` is explicit in the `Tabs.Root`, making it easy to find and change.
- **`aria-live="off"` on clock**: Prevents second-by-second screen reader announcements but means a screen reader user cannot hear the time. → Acceptable per F-220 requirements; the clock is a visual aid.

## Open Questions

- None at this time. All decisions are settled based on the existing codebase patterns.
