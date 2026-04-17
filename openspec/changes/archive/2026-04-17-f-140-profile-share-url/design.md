## Context

GlowFrame uses a discriminated union of 6 profile modes (`full`, `full-color`, `ring`, `ring-color`, `spot`, `spot-color`), each with different fields. Profiles are stored in Zustand with `localStorage` persistence. The app is a single-page React Router app served under a sub-path (`/glowframe/` on GitHub Pages). There is no backend.

The feature requires:
1. A pure encode/decode library for the URL parameter
2. A share button in the SettingsModal sheet footer
3. On-load URL detection with a confirmation dialog
4. Toast feedback for success/failure

## Goals / Non-Goals

**Goals:**
- Serialize the active profile (minus `id`) to a `?profile=` URL query parameter
- Copy the share URL to clipboard when the share button is clicked
- On load, detect the param, validate it with Zod, and show a confirmation dialog
- On import confirmation: add as a new profile, activate it, clean the URL, show success toast
- On import dismissal: clean the URL only
- On invalid param: show error toast, leave URL unchanged

**Non-Goals:**
- `navigator.share()` native API (clipboard-only is simpler and works everywhere HTTPS is served)
- Temporary/overlay profile mode (always import as a named preset)
- Deduplication by name (F-185 owns merge strategy; here, duplicates are fine — different IDs)
- Encoding multiple profiles in one URL

## Decisions

### D1: URL encoding — `encodeURIComponent(JSON.stringify(...))` over base64

**Chosen:** `encodeURIComponent` + `JSON.stringify`  
**Rationale:** Simpler code, no transforms needed, JSON is human-readable if manually inspected, and the resulting URL is well under any practical length limit even for the largest mode (ring). Base64 offers no meaningful benefit here.  
**Alternative considered:** `btoa`/`base64url` — marginally shorter URLs but adds non-obvious encoding logic.

### D2: Strip `id` from the encoded payload

**Chosen:** Encode `{ name, ...modeFields }` without `id`.  
**Rationale:** The recipient's app generates a fresh UUID on import. Sending an ID would either collide or be ignored — stripping it avoids confusion and keeps the payload minimal.

### D3: Auto-clean timing — clean URL on dialog dismissal (both paths)

**Chosen:** Clean URL at the moment the user takes an action (import OR dismiss), not on page load.  
**Rationale:** If we clean immediately on mount, the user sees a flash of the dirty URL in the address bar while the dialog is still open. Cleaning on action keeps the URL stable while the dialog is visible. On failure (invalid param), the URL is intentionally left unchanged so the user can inspect it.  
**Alternative considered:** Clean on mount — simpler logic but hides the param before the user has acted.

### D4: Zod schema — `z.discriminatedUnion` mirroring store types

**Chosen:** Define a `sharedProfileSchema` as `z.discriminatedUnion('mode', [...])` with all 6 mode variants, each including `name` and mode-specific fields. Use `.strict()` on each branch to reject unknown fields.  
**Rationale:** Mirrors the existing `ProfileMode` discriminated union exactly. Provides type-safe decode output. Unknown fields (e.g., injected by a tampered URL) are rejected.

### D5: Share button placement — bottom of SettingsModal sheet

**Chosen:** A "Copy share link" button with a link/share icon placed in the footer of the sheet, below the profile list and mode settings.  
**Rationale:** Profile-level action that doesn't clutter individual profile rows (which already have drag handle + delete). Easily discoverable without being in the way.

### D6: Component structure

```
src/
  lib/
    profileShare.ts          ← encodeProfile(), decodeProfile(), sharedProfileSchema
    profileShare.test.ts
  components/
    ImportProfileDialog.tsx  ← Radix UI Dialog, "Import" / "Dismiss" buttons
  pages/
    LightPage.tsx            ← useEffect reads ?profile= once on mount; drives dialog state
  components/
    SettingsModal.tsx        ← adds "Copy share link" button in footer
```

`LightPage` reads the raw query string once via `window.location.search` (not `useSearchParams`) to avoid React Router re-render coupling. It stores the decoded profile in local state and passes it to `ImportProfileDialog`.

## Risks / Trade-offs

- **Clipboard API requires HTTPS or localhost** → Acceptable: GitHub Pages is HTTPS, local dev is localhost. No fallback needed.
- **Very long profile names inflate URL** → Name is clamped at 64 chars by Zod; negligible impact.
- **URL left dirty on invalid param** → This is intentional per design, but if a social media platform truncates long URLs and corrupts the param, users will see a persistent error toast on every load. Mitigation: toast is non-blocking and dismissible; no crash.
- **Duplicate names on import** → We allow them (different IDs). This is a known trade-off vs. F-185's full merge strategy.
