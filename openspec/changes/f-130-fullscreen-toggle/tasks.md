## 1. Hook — useFullscreen

- [ ] 1.1 Create `src/hooks/useFullscreen.ts` returning `{ isFullscreen, isAvailable, toggle }`
- [ ] 1.2 Guard `isAvailable` with `'fullscreenEnabled' in document && document.fullscreenEnabled`
- [ ] 1.3 Listen to `fullscreenchange` on `document` to keep `isFullscreen` in sync with `document.fullscreenElement`
- [ ] 1.4 Wrap `requestFullscreen` / `exitFullscreen` calls in try/catch (silent swallow)
- [ ] 1.5 Remove `fullscreenchange` event listener on hook cleanup

## 2. Component — FullscreenButton

- [ ] 2.1 Create `src/components/FullscreenButton.tsx` using shadcn/ui `Button` (variant ghost, size icon)
- [ ] 2.2 Position with `fixed top-4 right-16 z-50` Tailwind classes (left of gear icon)
- [ ] 2.3 Render `Maximize2` icon when `isFullscreen` is false, `Minimize2` when true (both from `lucide-react`)
- [ ] 2.4 Set `aria-label="Enter fullscreen"` / `aria-label="Exit fullscreen"` to match state
- [ ] 2.5 Return `null` when `isAvailable` is false

## 3. Integration — LightPage

- [ ] 3.1 Mount `<FullscreenButton />` in `src/pages/LightPage.tsx` beside `<GearButton />`
- [ ] 3.2 Add `keydown` listener on `document` in `LightPage` that calls `toggle()` when `key === 'f'` or `key === 'F'` and active element is not `INPUT`, `TEXTAREA`, or `[contenteditable]`
- [ ] 3.3 Remove the `keydown` listener on `LightPage` unmount

## 4. Unit Tests

- [ ] 4.1 Create `src/hooks/useFullscreen.test.ts` — mock `document.fullscreenEnabled`, `requestFullscreen`, `exitFullscreen`, `fullscreenchange` event; assert all scenarios in the spec
- [ ] 4.2 Create `src/components/FullscreenButton.test.tsx` — assert button hidden when `isAvailable` false; correct icon and aria-label per state; click calls `toggle`

## 5. E2E Tests

- [ ] 5.1 Add fullscreen toggle scenario to `e2e/` — verify button is visible; click enters fullscreen; button icon changes; pressing `F` toggles fullscreen; pressing `Escape` exits fullscreen and button icon reverts

## 6. Build Verification

- [ ] 6.1 Run `npm run build` — confirm no TypeScript or Vite compilation errors
- [ ] 6.2 Run `npm run test` — confirm all unit tests pass
