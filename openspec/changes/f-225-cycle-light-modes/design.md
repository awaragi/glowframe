## Context

GlowFrame already has a centralised keyboard shortcut system (`useKeyboardShortcuts`, `GlobalShortcuts`, per-mode shortcut components) and a destructive `switchMode(id, newMode)` store action that resets mode-specific fields to defaults. Mode selection is currently only available via the settings modal dropdown. The F-220 `ClockOverlay` component establishes the legibility pattern for fixed overlays on the light surface: white text on a semi-transparent dark pill (`bg-black/40 backdrop-blur-sm rounded-lg px-3 py-1`) at `z-10`, below the application button cluster.

F-225 adds a global `M` shortcut to cycle through all six light modes in canonical order, with a brief centred overlay showing the new mode name.

## Goals / Non-Goals

**Goals:**

- Register `M` in `GlobalShortcuts` to cycle the active preset to the next mode using `switchMode`.
- Define `MODE_CYCLE_ORDER`, `MODE_LABELS`, and a `nextMode(current)` helper in a single shared module.
- Show a transient centred `ModeNameOverlay` after each cycle, matching the clock overlay legibility treatment.
- Document `M` in the `HelpDialog` Global group.
- Unit-test shortcut behaviour, overlay lifecycle, and help dialog content; E2E-test cycling with settings open and closed.

**Non-Goals:**

- Reverse cycling (`Shift+M`).
- Non-destructive mode switching (preserving tuned parameters across modes).
- Persisting overlay state.
- Touch-gesture mode cycling (F-180 scope).

## Decisions

### D-1: Shared mode cycle module in `src/lib/modeCycle.ts`

Export `MODE_CYCLE_ORDER`, `MODE_LABELS`, and `nextMode(mode)` from a dedicated `modeCycle.ts` file rather than extending `modeDefaults.ts`.

**Alternatives considered:**

- Inline array in `GlobalShortcuts`: duplicates order already implied by settings dropdown.
- Extend `modeDefaults.ts`: mixes defaults with UI/shortcut concerns.

**Rationale:** Keeps `modeDefaults.ts` focused on default field values; `modeCycle.ts` is the single source of truth for order and labels. `SettingsModal` and `ImportProfileDialog` can import `MODE_LABELS` to eliminate local duplicates.

### D-2: Overlay state owned by `LightPage`, overlay logic in `ModeNameOverlay`

`LightPage` holds `modeOverlayLabel: string | null` and passes `onModeCycled: (label: string) => void` to `GlobalShortcuts`. `ModeNameOverlay` receives the label prop and manages its own dismiss timer via `useEffect`.

**Alternatives considered:**

- Zustand slice for transient UI: unnecessary persistence overhead.
- Timer entirely in `LightPage`: spreads overlay concerns across two files.

**Rationale:** Mirrors how settings/help open state lives in `LightPage`. `ModeNameOverlay` encapsulates timer restart on label change and fade/unmount behaviour.

### D-3: Fixed dismiss duration constant `MODE_OVERLAY_DURATION_MS = 1750`

Auto-dismiss after 1.75 seconds. Defined in `modeCycle.ts` alongside cycle order.

**Rationale:** Within the F-225 requirement range (1.5–2 s). Single constant keeps tests deterministic.

### D-4: Reuse clock overlay backdrop classes verbatim

`ModeNameOverlay` inner container uses `bg-black/40 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-2xl font-medium` — same legibility approach as `ClockOverlay`, slightly larger horizontal padding and sans-serif for a label (not monospace time digits).

**Rationale:** Visual consistency with an existing, tested pattern; no new design tokens.

### D-5: Centred overlay with `pointer-events-none`

Outer wrapper: `fixed inset-0 flex items-center justify-center pointer-events-none z-10`. Does not trap focus or block clicks on buttons or the light surface.

**Rationale:** F-225 explicitly requires non-blocking behaviour. `pointer-events-none` on the overlay wrapper ensures the top-right buttons remain clickable even while the label is visible.

### D-6: `M` handler in `GlobalShortcuts` reads store directly

`GlobalShortcuts` imports `useAppStore` to read `activeProfileId`, active profile mode, and `switchMode`. On `M`: compute `nextMode(current)`, call `switchMode`, then invoke `onModeCycled(MODE_LABELS[next])`.

**Alternatives considered:**

- Pass all store actions as props from `LightPage`: more prop drilling for no benefit.

**Rationale:** Consistent with how `ClockShortcuts` reads the store directly. `onModeCycled` is the only new callback prop.

### D-7: Accessibility via `aria-live="polite"` on overlay container

The overlay root uses `role="status"` and `aria-live="polite"` so screen readers announce the new mode name once per cycle, without the aggressive per-second updates of the clock.

## Risks / Trade-offs

- **Destructive reset surprises users** → Mitigated by help dialog wording ("resets mode settings") and existing parameter shortcuts for re-tuning.
- `**M` fires while typing in profile name field** → Existing focus guard suppresses the shortcut when an input has focus; no change needed.
- **Overlay overlaps clock when both visible** → Acceptable; both are informational and centred clock is not a valid clock position. Centre overlay is transient.
- **Settings mode selector out of sync briefly** → `switchMode` updates Zustand immediately; Radix Select re-renders from store. No risk if settings modal reads active profile from store (it does).

## Migration Plan

No store schema change. Purely additive UI and shortcut binding. Deploy as a normal frontend release; no rollback complexity beyond reverting the commit.

## Open Questions

None — requirements are fully specified in F-225 and the exploration session.