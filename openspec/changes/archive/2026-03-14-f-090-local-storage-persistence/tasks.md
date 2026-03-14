## 1. Harden persist configuration

- [x] 1.1 Add `partialize` to the `persist` options in `src/store/index.ts` to explicitly include only `lightColor`, `brightness`, and `_version` (exclude action functions)
- [x] 1.2 Add `version: 1` to the `persist` options

## 2. Unit tests

- [x] 2.1 Add a test in `src/store/index.test.ts` that writes a valid persisted payload to `localStorage` under key `glowframe-store` and verifies the store hydrates with those values after a `rehydrate()` call (or by re-creating the store with mocked storage)
- [x] 2.2 Add a test verifying that the `partialize` output contains no function-valued keys

## 3. Verify

- [x] 3.1 Run `npm run test` and confirm all unit tests pass
