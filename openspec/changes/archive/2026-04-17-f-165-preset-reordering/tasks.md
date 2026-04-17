## 1. Dependencies

- [x] 1.1 Install `@dnd-kit/core` and `@dnd-kit/sortable` npm packages
- [x] 1.2 Verify no peer-dependency conflicts with the existing React 19 stack

## 2. Zustand Store

- [x] 2.1 Add `reorderProfiles(fromIndex: number, toIndex: number)` action to `src/store/index.ts` using `arrayMove` from `@dnd-kit/sortable`
- [x] 2.2 Write unit tests in `src/store/index.test.ts` covering: move to earlier index, move to later index, same-index no-op, and data-integrity check (profile fields unchanged after reorder)

## 3. Settings Modal — Sequence Badges

- [x] 3.1 Update the profile list render in `src/components/SettingsModal.tsx` to include a sequence number badge (`index + 1`) to the left of each profile name
- [x] 3.2 Style the badge to be visually distinct (e.g., muted small rounded chip) and not overflow for values 1–99
- [x] 3.3 Update `src/components/SettingsModal.test.tsx` to verify sequence badges render with correct values (`1`, `2`, `3`, …)

## 4. Settings Modal — Drag-and-Drop

- [x] 4.1 Wrap the profile list in `DndContext` and `SortableContext` (strategy: `verticalListSortingStrategy`) in `SettingsModal.tsx`
- [x] 4.2 Extract each profile row into a `SortableProfileItem` component (or inline `useSortable` hook usage) with a `GripVertical` drag handle icon from `lucide-react`
- [x] 4.3 Add `aria-label="Drag to reorder"` to the drag handle element
- [x] 4.4 Wire `onDragEnd` of `DndContext` to call `reorderProfiles(fromIndex, toIndex)` in the store
- [x] 4.5 Verify sequence badges update live as items are dragged (they re-derive from array index on each render)
- [x] 4.6 Update `src/components/SettingsModal.test.tsx` to verify the drag handle is rendered on each profile row with the correct `aria-label`

## 5. End-to-End Test

- [x] 5.1 Add an E2E scenario in `e2e/preset-reordering.spec.ts`: sequence badges visible, drag handles present, keyboard shortcut `1` activates first-position profile

## 6. Build & Test Verification

- [x] 6.1 Run `npm run build` and confirm zero TypeScript/Vite errors
- [x] 6.2 Run `npm run test` and confirm all unit tests pass
