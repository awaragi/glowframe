## 1. Constants and Engine Hook

- [x] 1.1 Create `src/lib/keyboardShortcutConstants.ts` exporting `BRIGHTNESS_STEP = 5`, `TEMPERATURE_STEP = 100`, `RADIUS_STEP = 2`
- [x] 1.2 Create `src/hooks/useKeyboardShortcuts.ts` — accepts `KeyBinding[]`, attaches single `keydown` listener on `document`, applies focus guard (`HTMLInputElement`, `HTMLSelectElement`, `HTMLTextAreaElement`, `contentEditable`), removes listener on unmount
- [x] 1.3 Write Vitest unit tests for `useKeyboardShortcuts` — handler fires on matching key, all four focus guard cases (input/range, select, textarea, contentEditable), shift modifier fires, shift binding does not fire without shift, listener removed on unmount

## 2. Global Shortcuts Component

- [x] 2.1 Create `src/components/shortcuts/GlobalShortcuts.tsx` — headless component (returns `null`), calls `useKeyboardShortcuts` with bindings for `f` (fullscreen toggle), `s` (settings toggle), `?` (help toggle), `1`–`9` (preset by array index, no-op if out of bounds)
- [x] 2.2 Write Vitest unit tests for `GlobalShortcuts` — `f` calls fullscreen toggle, `s` toggles settings, `?` toggles help, `1` selects first profile, digit no-op when profile does not exist, `9` selects ninth profile when it exists

## 3. Per-Mode Shortcut Components

- [x] 3.1 Create `src/components/shortcuts/FullModeShortcuts.tsx` — registers `ArrowUp`/`ArrowDown` for `lightBrightness` ±`BRIGHTNESS_STEP` (clamped 0–100), `ArrowLeft`/`ArrowRight` for `lightTemperature` ±`TEMPERATURE_STEP` (clamped 1000–10000)
- [x] 3.2 Create `src/components/shortcuts/FullColorModeShortcuts.tsx` — no bindings (empty, renders `null`)
- [x] 3.3 Create `src/components/shortcuts/RingModeShortcuts.tsx` — brightness + temperature shortcuts (same as `full`), plus `]`/`[` for `outerRadius` ±`RADIUS_STEP` (clamped to `innerRadius+1`–100), `{`/`}` (Shift+`[`/`]`) for `innerRadius` ±`RADIUS_STEP` (clamped to 0–`outerRadius-1`)
- [x] 3.4 Create `src/components/shortcuts/RingColorModeShortcuts.tsx` — only `]`/`[` for `outerRadius` and `{`/`}` for `innerRadius` with same clamping as ring
- [x] 3.5 Create `src/components/shortcuts/SpotModeShortcuts.tsx` — brightness + temperature shortcuts plus `]`/`[` for `radius` ±`RADIUS_STEP` (clamped 0–100); `{`/`}` are no-ops
- [x] 3.6 Create `src/components/shortcuts/SpotColorModeShortcuts.tsx` — only `]`/`[` for `radius` ±`RADIUS_STEP` (clamped 0–100)
- [x] 3.7 Create `src/components/shortcuts/ActiveModeShortcuts.tsx` — reads active profile `mode` from Zustand, mounts the corresponding mode shortcut component (mirrors pattern of `LightSurface`)
- [x] 3.8 Write Vitest unit tests for `FullModeShortcuts` — `ArrowUp` increases brightness, `ArrowDown` decreases, clamped at 100 and 0; `ArrowRight` increases temperature, `ArrowLeft` decreases, clamped at 10000 and 1000
- [x] 3.9 Write Vitest unit tests for `RingModeShortcuts` — `]` increases `outerRadius`, `[` decreases clamped to `innerRadius+1`, `{` increases `innerRadius` clamped to `outerRadius-1`, `}` decreases `innerRadius` clamped to 0; cross-guard: `outerRadius` clamps to `innerRadius+1`, `innerRadius` clamps to `outerRadius-1`
- [x] 3.10 Write Vitest unit tests for `SpotModeShortcuts` — `]`/`[` adjusts `radius`, clamped 0–100; `{`/`}` do nothing

## 4. Help Button and Dialog

- [x] 4.1 Create `src/components/HelpButton.tsx` — `<Button>` fixed at `top-4 right-28 z-50`, `aria-label="Keyboard shortcuts"`, renders `?` icon (e.g., `CircleHelp` or `HelpCircle` from Lucide), accepts `onClick` prop
- [x] 4.2 Create `src/components/HelpDialog.tsx` — shadcn/ui `Dialog`, four groups (Global, Light surface, Ring & Spot radius, Settings modal) with hardcoded `<kbd>`-rendered shortcut tables, closeable via ×, Escape, or outside click
- [x] 4.3 Write Vitest unit tests for `HelpButton` — renders with correct `aria-label`, click calls `onClick`
- [x] 4.4 Write Vitest unit tests for `HelpDialog` — dialog visible when `open={true}`, all four groups rendered, `<kbd>` elements present, closes on Escape

## 5. LightPage Wiring

- [x] 5.1 Add `isHelpOpen` / `setIsHelpOpen` local state to `LightPage`
- [x] 5.2 Mount `<GlobalShortcuts>` in `LightPage`, passing `onToggleFullscreen`, `onToggleSettings`, `onToggleHelp`, and `profiles` / `setActiveProfile` from Zustand
- [x] 5.3 Mount `<ActiveModeShortcuts>` in `LightPage`
- [x] 5.4 Mount `<HelpButton onClick={() => setIsHelpOpen(true)}>` in `LightPage` at the correct position (`right-28`)
- [x] 5.5 Mount `<HelpDialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>` in `LightPage`
- [x] 5.6 Remove the existing inline `useEffect` `F` key handler from `LightPage.tsx`

## 6. Tests — Constants and Integration

- [x] 6.1 Write Vitest unit tests for `keyboardShortcutConstants` — all three constants exported, each is a positive number
- [x] 6.2 Write Playwright E2E scenario — open app, press `S` to open settings modal, verify it opens; press `S` again to close; press `?` to open help dialog, verify all four shortcut groups visible; press `Escape` to close; press `1` to select first preset; press `ArrowUp` to increase brightness and verify light surface updates; press `ArrowRight` to increase temperature and verify light surface updates

## 7. Build Verification

- [x] 7.1 Run `npm run build` and confirm zero TypeScript / Vite errors
- [x] 7.2 Run `npm run test` and confirm all unit tests pass
