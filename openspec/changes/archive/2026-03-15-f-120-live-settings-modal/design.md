## Context

F-100 established the profiles store and F-110 defined all profile parameters and ring-format rendering. Without a UI, users have no way to access, create, or modify profiles, or adjust any light setting. The settings modal is the sole control surface for GlowFrame.

The `LightPage` currently renders only `LightSurface`. This design adds a fixed gear icon overlay and a Sheet panel on top of it. All state interactions go through existing Zustand actions; no new store fields are introduced here.

## Goals / Non-Goals

**Goals:**
- `GearButton` component: fixed top-right button using shadcn/ui `Button` + a `Settings` (or `Sliders`) Lucide icon.
- `SettingsModal` component: a shadcn/ui `Sheet` (side panel) containing profile management and all parameter controls.
- React Hook Form + Zod integration for form validation; `defaultValues` kept in sync with the active Zustand profile.
- Conditional display of `innerRadius`/`outerRadius` sliders (only for `"circle"` and `"border"` formats).
- All Radix UI / shadcn/ui primitives for interactive elements (Sheet, Slider, Select, Input, Button).

**Non-Goals:**
- Fullscreen toggle (F-130).
- Profile share button (F-140).
- Any animation beyond what shadcn/ui provides out of the box.

## Decisions

### D-1: Modal component — Sheet vs Dialog
Use shadcn/ui `Sheet` (slide-in from the right). A Sheet feels lighter than a blocking dialog and keeps the light surface partially visible while adjusting settings, which is important for a fill-light tool where the user needs to see the effect of changes.

### D-2: Form sync strategy
The form is initialised with `defaultValues` derived from the active profile. When the active profile changes (user switches profile), `form.reset(newProfile)` is called inside a `useEffect` watching `activeProfileId`. On every `onChange` in RHF the callback calls `updateProfile(activeProfileId, changedField)`, making changes live. Zod schema validates ranges to prevent out-of-bound store writes.

```
Zod: colorTemperature → min(1000).max(10000)
     brightness → min(0).max(100)
     innerRadius / outerRadius → min(0).max(100)
     ringFormat → enum(["full","circle","border"])
     lightColor → regex(/^#[0-9a-fA-F]{6}$/)
     name → min(1).max(64)
```

### D-3: Profile management UX in the Sheet
A simple list of profile names at the top of the Sheet, each row having:
- A radio/click to activate.
- An inline editable name using a controlled `Input` (double-click or pencil icon).
- A delete `IconButton` (disabled when only one profile remains).
A "+" button creates a new profile from the active one.

### D-4: Color picker
Use `<input type="color">` wrapped in a shadcn/ui-styled label — native and zero-bundle-cost. This triggers `updateProfile` `onChange`.

### D-5: File structure
```
src/components/
  GearButton.tsx
  SettingsModal.tsx
  SettingsModal.test.tsx
```
`LightPage.tsx` mounts both alongside `LightSurface`.

## Risks / Trade-offs

- **RHF + Zustand dual-state** → Keeping both in sync adds complexity. Mitigation: RHF is authoritative for validation; Zustand is updated immediately on every valid change via the `onChange` mode. The Sheet's local RHF state is always reset from Zustand when the active profile changes.
- **Sheet obscures the light surface** → The Sheet is semi-transparent (Tailwind `bg-background/90 backdrop-blur-sm`) so users can still see the light while adjusting.
- **Accessibility** → Gear button requires `aria-label`; Sheet uses Radix's Dialog internally so focus trap and Escape key are handled automatically.
