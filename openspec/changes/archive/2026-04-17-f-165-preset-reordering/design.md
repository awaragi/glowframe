## Context

GlowFrame has a profile list stored as an ordered array in Zustand. Profiles are currently created in order but cannot be rearranged. Keyboard shortcuts `1`–`9` (F-175) and swipe navigation (F-180) derive their target profile from array index, so creation order is the only sequence a user has — with no way to change it.

The settings modal already renders the profile list using a `map` over the Zustand `profiles` array. There is no external ordering field; position in the array is the canonical order.

## Goals / Non-Goals

**Goals:**
- Add a visible sequence number badge (1-based) next to every profile in the settings modal list.
- Add drag-and-drop reordering of profiles within the settings modal list, using `@dnd-kit/core` + `@dnd-kit/sortable` for accessible, pointer + keyboard drag support.
- Persist reordered array back to Zustand (and therefore `localStorage`) via a new `reorderProfiles` action.
- Ensure keyboard shortcuts `1`–`9` continue to work correctly after reordering (they already read by index — no change required).

**Non-Goals:**
- Touch-swipe gestures (F-180) — separate feature.
- Reordering via the keyboard shortcuts themselves — the shortcuts select, not reorder.
- Any visual preview of drag state beyond what `@dnd-kit` provides by default.
- Limit the number of profiles a user can create.

## Decisions

### Decision: Use `@dnd-kit/core` + `@dnd-kit/sortable` for drag-and-drop

**Chosen**: `@dnd-kit/core` + `@dnd-kit/sortable` (v6 stable).

**Rationale**:
- Radix UI has no drag-and-drop primitive. Building one from raw `draggable` HTML attributes is not keyboard-accessible without significant custom code.
- `@dnd-kit` is the de-facto React drag-and-drop library that ships with full keyboard accessibility out of the box (arrow keys to move items when a drag handle is focused).
- It is framework-agnostic, does not rely on the HTML5 drag API (avoiding its quirks on touch and Firefox), and has no peer-dependency conflicts with the existing stack.
- Alternatives considered: `react-beautiful-dnd` (archived, React 18 issues), plain `@radix-ui` (no sortable primitive), `react-dnd` (larger bundle, older API).

**Bundle impact**: `@dnd-kit/core` + `@dnd-kit/sortable` add approximately 12 kB gzipped — acceptable.

### Decision: `reorderProfiles(fromIndex, toIndex)` action in the Zustand store

**Chosen**: A single `reorderProfiles(fromIndex: number, toIndex: number)` action that uses `arrayMove` (from `@dnd-kit/sortable`) to produce a new array and replaces `profiles` in the store.

**Rationale**:
- Keeping the reorder logic in the store keeps it testable in isolation (unit test can call the action without rendering).
- Using indices (rather than IDs) aligns with how `@dnd-kit` reports drag results via `arrayMove`.
- `arrayMove` is a pure utility already included in `@dnd-kit/sortable` — no need to re-implement.

### Decision: Sequence number derived from array index, not stored separately

**Chosen**: No `order` or `sequenceNumber` field on the profile object.

**Rationale**:
- The array position is the single source of truth. Adding a redundant numeric field would require keeping it in sync and complicate migration.
- Badge rendering: `index + 1` is computed at render time inside the map, not stored.

### Decision: Drag handle, not full-row drag

**Chosen**: A dedicated drag handle icon on the left side of each profile row; only the handle initiates drag.

**Rationale**:
- Making the entire row draggable conflicts with the click-to-switch interaction on the same row.
- A distinct handle (e.g., six-dot grip icon from `lucide-react`) is the standard pattern and is clearly discoverable.

## Risks / Trade-offs

- [Risk] `@dnd-kit` keyboard drag relies on focus being on the drag handle, which may be unfamiliar to users. → Mitigation: the drag handle has `aria-label="Drag to reorder"` and `title` tooltip for discoverability.
- [Risk] Touch events on the drag handle may conflict with the planned swipe gestures (F-180) on the light surface. → Mitigation: swipe gestures attach to the light surface element only, not the settings modal; these are separate DOM subtrees, so no conflict.
- [Risk] `arrayMove` mutates the store `profiles` array, which could break equality checks in selectors. → Mitigation: Zustand's `immer`-style produce always returns a new array reference; existing tests should pass without change.
- [Risk] Users with > 9 presets won't have shortcuts for positions 10+. → This is by design (per F-165 requirements); the sequence badge stops showing a shortcut hint at position 10.
