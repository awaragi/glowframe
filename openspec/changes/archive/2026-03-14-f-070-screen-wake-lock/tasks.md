## 1. Implement useWakeLock hook

- [x] 1.1 Create `src/hooks/useWakeLock.ts` — guard with `'wakeLock' in navigator`, call `navigator.wakeLock.request('screen')` inside a `useEffect`, store the sentinel in a `useRef`
- [x] 1.2 Add a `visibilitychange` event listener in the same `useEffect` to release the sentinel on `hidden` and re-request on `visible`
- [x] 1.3 Return the sentinel ref from the effect cleanup so it is released on unmount
- [x] 1.4 Wrap all `navigator.wakeLock` calls in `try/catch` to silently swallow errors on unsupported browsers

## 2. Wire hook into app root

- [x] 2.1 Call `useWakeLock()` inside `src/App.tsx` so the lock is active for the full app lifetime

## 3. Unit tests

- [x] 3.1 Create `src/hooks/useWakeLock.test.ts` with a `vi.stubGlobal` mock for `navigator.wakeLock`
- [x] 3.2 Test: wake lock is requested on mount when API is available
- [x] 3.3 Test: wake lock is released on unmount
- [x] 3.4 Test: wake lock is re-requested when `visibilityState` changes to `"visible"` after `"hidden"`
- [x] 3.5 Test: no error thrown when `navigator.wakeLock` is undefined (API unavailable)
- [x] 3.6 Test: no error thrown when `navigator.wakeLock.request()` rejects

## 4. Verify

- [x] 4.1 Run `npm run test` and confirm all unit tests pass
