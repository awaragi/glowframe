## 1. Hook — useFullscreen

- [x] 1.1 Create `src/hooks/useFullscreen.ts` returning `{ isFullscreen, isAvailable, toggle }`
- [x] 1.2 Guard `isAvailable` with `'fullscreenEnabled' in document && document.fullscreenEnabled`
- [x] 1.3 Listen to `fullscreenchange` on `document` to keep `isFullscreen` in sync with `document.fullscreenElement`
- [x] 1.4 Wrap `requestFullscreen` / `exitFullscreen` calls in try/catch (silent swallow)
- [x] 1.5 Remove `fullscreenchange` event listener on hook cleanup

## 2. Component — FullscreenButton

- [x] 2.1 Create `src/components/FullscreenButton.tsx` using shadcn/ui `Button` (variant ghost, size icon)
- [x] 2.2 Position with `fixed top-4 right-16 z-50` Tailwind classes (left of gear icon)
- [x] 2.3 Render `Maximize2` icon when `isFullscreen` is false, `Minimize2` when true (both from `lucide-react`)
- [x] 2.4 Set `aria-label="Enter fullscreen"` / `aria-label="Exit fullscreen"` to match state
- [x] 2.5 Return `null` when `isAvailable` is false

## 3. Integration — LightPage

- [x] 3.1 Mount `<FullscreenButton />` in `src/pages/LightPage.tsx` beside `<GearButton />`
- [x] 3.2 Add `keydown` listener on `document` in `LightPage` that calls `toggle()` when `key === 'f'` or `key === 'F'` and active element is not `INPUT`, `TEXTAREA`, or `[contenteditable]`
- [x] 3.3 Remove the `keydown` listener on `LightPage` unmount

## 4. Unit Tests

- [x] 4.1 Create `src/hooks/useFullscreen.test.ts` — mock `document.fullscreenEnabled`, `requestFullscreen`, `exitFullscreen`, `fullscreenchange` event; assert all scenarios in the spec
- [x] 4.2 Create `src/components/FullscreenButton.test.tsx` — assert button hidden when `isAvailable` false; correct icon and aria-label per state; click calls `toggle`

## 5. E2E Tests

- [x] 5.1 Add fullscreen toggle scenario to `e2e/` — verify button is visible; click enters fullscreen; button icon changes; pressing `F` toggles fullscreen; pressing `Escape` exits fullscreen and button icon reverts

## 6. Build Verification

- [x] 6.1 Run `npm run build` — confirm no TypeScript or Vite compilation errors
- [x] 6.2 Run `npm run test` — confirm all unit tests pass
