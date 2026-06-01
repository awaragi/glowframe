## 1. Mode Cycle Module

- [ ] 1.1 Create `src/lib/modeCycle.ts` exporting `MODE_CYCLE_ORDER`, `MODE_LABELS`, `MODE_OVERLAY_DURATION_MS` (1750), and `nextMode(current)` helper
- [ ] 1.2 Add `src/lib/modeCycle.test.ts` covering cycle order advancement, wrap-around from `spot-color` to `full`, and label lookup

## 2. ModeNameOverlay Component

- [ ] 2.1 Create `src/components/ModeNameOverlay.tsx` — centred fixed overlay with clock-matching backdrop (`bg-black/40 backdrop-blur-sm rounded-lg`), `pointer-events-none`, `role="status"`, `aria-live="polite"`, auto-dismiss via `useEffect` timer calling `onDismiss`
- [ ] 2.2 Create `src/components/ModeNameOverlay.test.tsx` covering: renders label when set, absent when null, auto-dismiss after duration, timer restart on label change, backdrop class present, accessibility attributes

## 3. GlobalShortcuts M Binding

- [ ] 3.1 Add `onModeCycled: (label: string) => void` prop to `GlobalShortcuts`; wire `m` binding that reads active profile from store, calls `switchMode(id, nextMode(mode))`, then invokes `onModeCycled(MODE_LABELS[next])`
- [ ] 3.2 Update `src/components/shortcuts/GlobalShortcuts.test.tsx` covering: M advances mode, M wraps from spot-color to full, M calls onModeCycled with correct label, M suppressed when input focused, M fires when settings open (no form focus)

## 4. LightPage Integration

- [ ] 4.1 Add `modeOverlayLabel` state to `LightPage`; mount `ModeNameOverlay` with label and dismiss handler; pass `onModeCycled` to `GlobalShortcuts`

## 5. Help Dialog

- [ ] 5.1 Add `M` row to Global shortcuts table in `HelpDialog.tsx`: "Cycle light mode (resets mode settings)"
- [ ] 5.2 Update `HelpDialog.test.tsx` to assert the M shortcut row is present

## 6. Shared MODE_LABELS Refactor (optional but recommended)

- [ ] 6.1 Replace local `MODE_LABELS` in `SettingsModal.tsx` and `ImportProfileDialog.tsx` with import from `src/lib/modeCycle.ts`

## 7. E2E Tests

- [ ] 7.1 Add E2E scenario in `e2e/keyboard-shortcuts.spec.ts`: press M twice with settings closed, verify overlay text and light surface mode change; open settings (no input focus), press M, verify mode selector updates

## 8. Verification

- [ ] 8.1 Run `npm run test` and confirm all unit tests pass
- [ ] 8.2 Run `npm run build` and confirm no TypeScript or Vite compilation errors
