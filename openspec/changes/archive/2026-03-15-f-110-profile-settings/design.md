## Context

F-100 introduced profiles holding only `lightColor` and `brightness`. GlowFrame needs to control colour temperature and light shape (full, circle, border) to satisfy its core fill-light use cases. These parameters are profile-level — each saved configuration has its own shape and warmth settings.

`LightSurface` currently renders a single `backgroundColor` + `filter: brightness()`. Extending it to support three ring formats and colour temperature requires CSS decisions upfront to keep the component simple and fast.

## Goals / Non-Goals

**Goals:**
- Extend `Profile` with `colorTemperature` (1000–10000 K), `ringFormat` (`"full" | "circle" | "border"`), `innerRadius` (0–100%), and `outerRadius` (0–100%).
- Implement `setProfileField` action for live, no-save updates to any profile field.
- Render `LightSurface` correctly for all three formats.
- Bump the store schema to v3 with a migrate path from v2.

**Non-Goals:**
- The UI controls (sliders, pickers) — those belong to F-120.
- Animating transitions between formats.
- Saving a separate set of radius units (always percentage of shorter viewport dimension for `"circle"`).

## Decisions

### D-1: Color temperature blending
Rather than a separate CSS filter, colour temperature is blended into the `backgroundColor` at render time via a pure TypeScript helper `kelvinToHex(k: number)` that converts a Kelvin value to a warm/cool tint. The tint is mixed with `lightColor` using the existing CSS `mix-color` or via a `canvas`-free linear interpolation:

- `lightColor` defines the hue intent.
- `colorTemperature` modulates a warm-white (#ffb347 at 1000 K) to cool-white (#cce8ff at 10000 K) overlay blended at a fixed 30% opacity over `lightColor`.
- `filter: brightness()` is applied on top of the blended result.

This keeps all rendering inside one `style` prop with no extra DOM nodes.

### D-2: Ring format rendering

| Format | Implementation |
|---|---|
| `"full"` | `backgroundColor` fills entire `fixed inset-0` div — same as current |
| `"circle"` | `background: radial-gradient(circle, <color> <innerRadius>%, transparent <innerRadius>%, transparent <outerRadius>%, transparent)` on a transparent background element; the visible ring is between `innerRadius` and `outerRadius` as % of the element's shorter dimension via `aspect-ratio` trick or a clip approach |
| `"border"` | Four absolutely-positioned edge strips OR a CSS `outline`/`border` approach rendering a rectangular frame; `innerRadius`/`outerRadius` map to frame thickness as % of viewport |

Simplest correct approach for `"circle"`: use a radial-gradient with the two stops at `innerRadius%` and `outerRadius%` on a `min(100vw, 100vh)` circle centred in the viewport.

For `"border"`: use a `box-shadow: inset 0 0 0 <thickness>px <color>` where thickness = `(outerRadius - innerRadius) / 100 * min(vw, vh) / 2`, combined with a CSS custom property computed in the component.

### D-3: `setProfileField` action
A single generic action `updateProfile(id: string, patch: Partial<Omit<Profile, "id">>)` is cleaner than per-field setters and easier to use from form controls in F-120.

### D-4: Store migration v2 → v3
Apply default values for the four new fields on every profile that lacks them:
- `colorTemperature: 6500`
- `ringFormat: "full"`
- `innerRadius: 0`
- `outerRadius: 100`

## Risks / Trade-offs

- **Radial-gradient `"circle"` on rectangular viewports** → The short-dimension percentage trick only works cleanly if we derive the circle size in JS and pass it as a CSS custom property. This adds a `useWindowSize`-style dependency or a CSS container-query approach. Decision: use `min(100vw, 100vh)` inside the gradient `size` parameter via the `at center / min(100vw,100vh) min(100vw,100vh)` radial-gradient syntax — no JS measurement needed.
- **`"border"` format and varying viewport** → Inline CSS custom property computed from `(outerRadius - innerRadius)` passed as `--ring-thickness` keeps this reactive without JS resize listeners.
- **Schema migration ordering** → v1→v2 is handled in F-100. F-110's migrate handles v2→v3. The `migrate` function receives the version number, so both paths must be kept.
