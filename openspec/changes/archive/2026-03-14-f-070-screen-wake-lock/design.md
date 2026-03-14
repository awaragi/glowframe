## Context

The Wake Lock API (`navigator.wakeLock.request('screen')`) is a browser standard available in Chrome 84+, Edge 84+, and Safari 16.4+. The lock must be re-requested after the page becomes visible again (e.g., after a tab switch) because browsers automatically release it on visibility change. GlowFrame's core value proposition depends on the screen staying on.

## Goals / Non-Goals

**Goals:**
- Keep the screen awake while GlowFrame is the active tab.
- Release the lock automatically when the tab is hidden or the component unmounts.
- Re-acquire automatically when the tab becomes visible again.
- Degrade gracefully when the API is unavailable (no crash, no visible error).

**Non-Goals:**
- Exposing wake lock status in the UI.
- User-controlled enable/disable toggle for wake lock (out of scope for this change).

## Decisions

### Custom hook encapsulates the full lifecycle

**Decision:** Implement a `useWakeLock` hook that manages acquire/release/re-acquire internally using `useEffect` and a `visibilitychange` event listener.

**Rationale:** All the logic is self-contained and only used in one place (`App.tsx`). A hook is the idiomatic React pattern; it keeps `App.tsx` clean and makes the behaviour easily testable in isolation with mocked APIs.

**Alternatives considered:**
- *Module-level singleton* — harder to test, doesn't integrate with React lifecycle.
- *Zustand action* — wake lock is a side-effect, not state; Zustand is wrong layer.

### Silent failure on unsupported browsers

**Decision:** Wrap all `navigator.wakeLock` calls in `try/catch` and a `'wakeLock' in navigator` guard. Errors are swallowed silently.

**Rationale:** The app is fully functional without wake lock — it just won't prevent screen dimming. Showing an error to the user would be confusing and unhelpful. Logging to `console.warn` in development is acceptable.

### Single hook call at App root

**Decision:** Call `useWakeLock()` once inside `App.tsx`.

**Rationale:** The lock should be active whenever the app is mounted. Placing it at the root means no prop-drilling and no risk of duplicate lock requests.

## Risks / Trade-offs

- [Safari < 16.4 doesn't support Wake Lock] → Gracefully skipped; the app still works.
- [Lock is released on tab switch] → Re-acquired via `visibilitychange` listener; user may see a very brief screen-dim on slow devices.
- [Multiple lock requests could accumulate] → Mitigated by releasing the previous sentinel before requesting a new one.

## Open Questions

<!-- none -->
