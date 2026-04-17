## 1. Schema — Add Cross-Validation Rule

- [x] 1.1 In `RingModeSettings.tsx`, add `.superRefine()` to the Zod schema to reject `innerRadius >= outerRadius` with error path `["innerRadius"]` and message `"Inner radius must be less than outer radius."`
- [x] 1.2 In `RingColorModeSettings.tsx`, add the same `.superRefine()` rule to its Zod schema

## 2. Form Logic — Gate Store Updates on Validity

- [x] 2.1 In `RingModeSettings.tsx`, update the `patch` helper to call `await trigger()` after updating the field value and only call `updateProfile` when `formState.isValid` is `true`
- [x] 2.2 In `RingColorModeSettings.tsx`, apply the same `trigger()`-gated `patch` logic

## 3. UI — Inline Validation Error

- [x] 3.1 In `RingModeSettings.tsx`, render the `formState.errors.innerRadius?.message` string below the `outerRadius` slider (below the radius group) when the error is present
- [x] 3.2 In `RingColorModeSettings.tsx`, render the same inline error message in the equivalent position

## 4. Unit Tests

- [x] 4.1 In `RingModeSettings.test.tsx` (create if absent), add tests: valid pair passes, equal values fail with correct message, inner > outer fails with correct message
- [x] 4.2 In `RingColorModeSettings.test.tsx` (create if absent), add the same three schema validation tests
- [x] 4.3 Add a test that verifies `updateProfile` is NOT called when the form is invalid (mock the store action)
- [x] 4.4 Add a test that verifies `updateProfile` IS called when the form is valid after a slider change

## 5. E2E Test

- [x] 5.1 In `e2e/settings.spec.ts` (or a new `ring-radius-validation.spec.ts`), add a scenario: open settings with a ring-mode profile, drag `innerRadius` slider to equal `outerRadius`, verify the error text `"Inner radius must be less than outer radius."` is visible
- [x] 5.2 Add assertion that verifies the store/displayed values are not corrupted (the slider shows the draft invalid value but the light surface has not updated its geometry)

## 6. Build & Test Verification

- [x] 6.1 Run `npm run build` and confirm no TypeScript or Vite errors
- [x] 6.2 Run `npm run test` and confirm all unit tests pass
