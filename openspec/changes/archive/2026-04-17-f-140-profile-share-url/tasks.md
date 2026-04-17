## 1. Encode / Decode Library

- [x] 1.1 Create `src/lib/profileShare.ts` with `sharedProfileSchema` (Zod discriminated union for all 6 modes, each with `name` field, `.strict()`)
- [x] 1.2 Implement `encodeProfile(profile: Profile): string` — strips `id`, JSON.stringify + encodeURIComponent
- [x] 1.3 Implement `decodeProfile(param: string): SharedProfile | null` — decodeURIComponent + JSON.parse + Zod parse; return null on any failure
- [x] 1.4 Create `src/lib/profileShare.test.ts` — unit tests: round-trip for all 6 modes, null on tampered input, null on missing mode, null on out-of-range values, `id` is absent from encoded output

## 2. Import Confirmation Dialog

- [x] 2.1 Create `src/components/ImportProfileDialog.tsx` — Radix UI Dialog showing incoming profile name and mode; "Import" and "Dismiss" buttons
- [x] 2.2 Wire "Import" button: call `createProfile`-equivalent (append to store with new UUID), `setActiveProfile`, call `onImport` callback
- [x] 2.3 Wire "Dismiss" button / Escape / outside click: call `onDismiss` callback, no store mutation
- [x] 2.4 Add `aria-label` / accessible labels to all interactive elements in the dialog

## 3. On-Load URL Detection

- [x] 3.1 In `src/pages/LightPage.tsx`, add a `useEffect` (runs once on mount) that reads `window.location.search` for `?profile=`
- [x] 3.2 On detection: call `decodeProfile`; if null → show error toast (shadcn/ui Sonner) and leave URL; if valid → store decoded payload in local state to show `ImportProfileDialog`
- [x] 3.3 On `ImportProfileDialog` confirm: append profile to store (new UUID), set active, call `history.replaceState` to remove `?profile=`, show success toast
- [x] 3.4 On `ImportProfileDialog` dismiss: call `history.replaceState` to remove `?profile=`, no toast

## 4. Share Button in Settings Modal

- [x] 4.1 In `src/components/SettingsModal.tsx`, add a "Copy share link" `<Button>` with `Share2` (Lucide) icon in the sheet footer below mode settings
- [x] 4.2 On click: build full share URL (`window.location.origin + window.location.pathname + '?profile=' + encodeProfile(activeProfile)`), write to clipboard via `navigator.clipboard.writeText`, show "Link copied!" toast on success

## 5. Toast Infrastructure Check

- [x] 5.1 Verify shadcn/ui Sonner (or equivalent toast) is already wired in the app; add `<Toaster />` to `RootLayout` or `LightPage` if not already present

## 6. End-to-End Test

- [x] 6.1 Create `e2e/profile-share.spec.ts`: open settings, click "Copy share link", navigate to the copied URL, verify the import dialog appears with the correct profile name
- [x] 6.2 E2E: confirm import — verify profile appears in the preset list, URL is clean, success toast shown
- [x] 6.3 E2E: navigate to a URL with a deliberately malformed `?profile=` param — verify error toast appears and no new profile is added

## 7. Build & Test Verification

- [x] 7.1 Run `npm run test` — all unit tests pass
- [x] 7.2 Run `npm run build` — no TypeScript or Vite compilation errors
