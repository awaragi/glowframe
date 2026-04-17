## Context

The app uses a discriminated union of six profile modes (`full`, `full-color`, `ring`, `ring-color`, `spot`, `spot-color`). The `ring` and `ring-color` modes each carry `innerRadius` and `outerRadius` number fields (0–100). These are managed by two separate mode settings components — `RingModeSettings.tsx` and `RingColorModeSettings.tsx` — each with its own React Hook Form + Zod form.

Currently both schemas validate each radius field independently (`z.number().min(0).max(100)`) but apply no cross-field constraint. The `patch` helper inside each component calls `updateProfile` directly on every slider `onValueChange`, so invalid combinations (where `innerRadius >= outerRadius`) are immediately written to the Zustand store and persisted to `localStorage`.

## Goals / Non-Goals

**Goals:**
- Add a Zod `.superRefine()` cross-field rule to both ring schemas that rejects `innerRadius >= outerRadius`.
- Gate `updateProfile` calls behind form validity — persist to Zustand only when the form is valid.
- Display a single, inline validation error message below the radius sliders when the constraint is violated.
- Cover the constraint with unit tests (valid pairs, equal values, inner > outer) and an E2E scenario.

**Non-Goals:**
- Automatic clamping of one slider when the other is adjusted (warn and block, not auto-fix).
- Changes to `full`, `full-color`, `spot`, or `spot-color` mode components.
- Changes to the Zustand store's `updateProfile` action signature or the `Profile` type.

## Decisions

### Decision: Use `.superRefine()` at the form schema level, not the store level

The cross-validation lives in the React Hook Form Zod schema inside `RingModeSettings` and `RingColorModeSettings`, not in the store's type system or a shared schema.

**Rationale:** The Zustand store holds a discriminated union where `innerRadius` and `outerRadius` are plain numbers — adding a runtime refinement at the store layer would require wrapping every `updateProfile` call in a try/catch and would make the store responsible for UI-layer concerns. Keeping the validation in the form layer is consistent with the existing pattern (each mode component owns its schema) and allows the form to hold the invalid draft state while the store retains the last valid persisted state.

**Alternative considered:** A shared `ringRadiusSchema` helper exported from `@/lib/` and imported by both components. Rejected for now because the two schemas are otherwise independent (different fields) and a shared helper would add indirection for a single constraint.

### Decision: Buffer invalid state in the form, not in the store

When a slider is moved to an invalid position, the form value updates (so the slider moves in the UI) but `updateProfile` is NOT called. The store retains the last valid radii. When the user resolves the conflict, the next valid change is persisted normally.

**Rationale:** This matches the requirement: "the last valid values must be retained in the store until the user resolves the conflict." It avoids a flash of broken geometry on the light surface.

**Implementation note:** The current `patch` helper calls `updateProfile` on every `onValueChange`. It must be changed to call `trigger()` (React Hook Form's manual validation) and only call `updateProfile` when `formState.isValid` is true after the trigger resolves.

### Decision: Inline error message below the radius slider group

A single error string is rendered below both sliders (not next to each individually) when the cross-validation fails. Text: *"Inner radius must be less than outer radius."*

**Rationale:** The constraint is cross-field, so attaching the error to a single field's label would be ambiguous. Placing it below the pair is visually clear and requires the least DOM restructuring.

## Risks / Trade-offs

- **Stale form state on profile switch** → The existing `useEffect` in both ring components already calls `reset()` when `profile.id` changes, so switching profiles clears any pending invalid state.
- **`trigger()` is async** → `trigger()` returns a Promise. The `onValueChange` handler must `await trigger()` and then check `formState.isValid`. This requires the handler to be `async`, which is safe inside React event handlers but must be tested carefully.
- **Keyboard shortcut radius adjustments (F-175)** → The keyboard shortcut hook adjusts `innerRadius` / `outerRadius` via `updateProfile` directly, bypassing the form. F-175 already specifies its own guard (`clamp at outerRadius − 1`), so those adjustments remain valid by construction and do not interact with this change.
