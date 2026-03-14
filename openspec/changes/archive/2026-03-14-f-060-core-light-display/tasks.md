## 1. Store — extend Zustand state

- [x] 1.1 Add `lightColor: string` and `brightness: number` fields to `AppState` in `src/store/index.ts`
- [x] 1.2 Set defaults `lightColor: "#ffffff"` and `brightness: 100` in the store initializer
- [x] 1.3 Add `setLightColor(color: string): void` and `setBrightness(value: number): void` actions to the store
- [x] 1.4 Update the unit tests in `src/store/index.test.ts` to cover the new state and actions

## 2. LightSurface component

- [x] 2.1 Create `src/components/LightSurface.tsx` — a `div` filling `100vw × 100vh` with `overflow: hidden`, `background-color` set to `lightColor` via an inline style, and `filter: brightness(<brightness/100>)` applied
- [x] 2.2 Read `lightColor` and `brightness` directly from `useAppStore` inside the component
- [x] 2.3 Write a Vitest unit test in `src/components/LightSurface.test.tsx` verifying the correct background color and filter style are applied for default and custom values

## 3. Route — wire up LightPage

- [x] 3.1 Create `src/pages/LightPage.tsx` that renders only `<LightSurface />`
- [x] 3.2 Update `src/App.tsx` to route `/` to `LightPage` (replacing the existing `ConfigPage` placeholder)
- [x] 3.3 Remove or archive `src/pages/ConfigPage.tsx` if it is no longer needed

## 4. Global styles — eliminate scrollbars

- [x] 4.1 Confirm `html, body { margin: 0; overflow: hidden; }` (or equivalent Tailwind reset) is applied globally in `src/index.css` so no scrollbars appear

## 5. Tests — unit and E2E

- [x] 5.1 Update `src/App.test.tsx` to assert the `LightSurface` is rendered at `/` rather than old placeholder content
- [x] 5.2 Update `e2e/smoke.spec.ts` to assert the light surface fills the viewport (e.g., check that a full-size element with white background is present)
- [x] 5.3 Run `npm run test` and confirm all unit tests pass
- [x] 5.4 Run `npm run test:e2e` and confirm all E2E tests pass
