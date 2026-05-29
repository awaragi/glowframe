## 1. Transferable Preset Schema

- [x] 1.1 Add a `clockConfigSchema` Zod object in `src/lib/profileShare.ts` that validates all four `ClockConfig` fields (`enabled`, `position`, `size`, `format`) with the same constraints as the store type
- [x] 1.2 Add an optional `.extend({ clock: clockConfigSchema })` to each of the six existing mode Zod schemas in `profileShare.ts` so `clock` is validated when present
- [x] 1.3 Replace `.strict()` on each mode schema with `.passthrough()` before re-applying `.strip()`, OR keep strict and explicitly include `clock` — ensure `SharedProfile` type now includes `clock?: ClockConfig`
- [x] 1.4 Update `encodeProfile` in `profileShare.ts` to normalize `profile.clock` to `CLOCK_DEFAULTS` when absent before serializing, so `clock` is always present in the encoded string
- [x] 1.5 Update `decodeProfile` in `profileShare.ts` to accept and validate the `clock` field as part of each mode schema

## 2. Backup File Helpers

- [x] 2.1 Create `src/lib/profileBackup.ts` and define a `backupProfileSchema` Zod object equal to each mode's transferable shape plus `clock` (reuse the extended schemas from task 1)
- [x] 2.2 Define a `backupPayloadSchema` in `profileBackup.ts` as `z.object({ version: z.literal(1), profiles: z.array(backupProfileSchema).min(1) })`
- [x] 2.3 Export `BackupPayload` and `BackupProfile` TypeScript types inferred from those schemas
- [x] 2.4 Implement `exportBackup(profiles: Profile[]): string` that normalizes clock fields, strips `id`, builds the `{ version: 1, profiles }` payload, and returns a pretty-printed JSON string
- [x] 2.5 Implement `importBackup(json: string): BackupPayload | null` that JSON-parses and Zod-validates the input, returning `null` on any failure

## 3. Store: Restore Action

- [x] 3.1 Add a `restoreProfiles(profiles: BackupProfile[]) => void` action to the `AppState` interface in `src/store/index.ts`
- [x] 3.2 Implement `restoreProfiles` in the store: map each entry to a new `Profile` by spreading the backup data and assigning `crypto.randomUUID()` as `id`, normalize missing `clock` to `CLOCK_DEFAULTS`, replace the `profiles` array atomically, and set `activeProfileId` to the first restored profile's new ID

## 4. Share Link: Clock Inclusion

- [x] 4.1 Update the `sharedProfileSchema` export so its inferred `SharedProfile` type includes `clock` (should follow automatically from tasks 1.2–1.3; verify the type)
- [x] 4.2 Update `ImportProfileDialog` to pass the shared `clock` field through to `importProfile` — verify that `importProfile` in the store already stores whatever data is passed (it does via spread); no store action change needed here
- [x] 4.3 Update existing `profileShare.test.ts` round-trip tests to include a `clock` field in every fixture profile and assert that `clock` is present in the decoded result

## 5. Backup UI: Export

- [x] 5.1 Add an "Export presets" `Button` (variant `outline`) to the settings panel in `src/components/SettingsModal.tsx`, placed in the Profiles section below the profile list
- [x] 5.2 Wire the export button to call `exportBackup(profiles)`, create a `Blob`, trigger a `<a download="glowframe-backup.json">` click, and show a success toast

## 6. Backup UI: Restore

- [x] 6.1 Create `src/components/RestoreBackupDialog.tsx` as a Radix UI `Dialog` that receives `onConfirm`, `onCancel`, and a `profileCount` prop; the dialog body MUST warn that this will replace all existing presets and state how many presets will be restored
- [x] 6.2 Add a hidden `<input type="file" accept=".json">` and a visible "Restore presets" `Button` (variant `outline`) in the settings panel `SettingsModal.tsx`, below the export button
- [x] 6.3 On file selection, read the file with `FileReader`, call `importBackup`, and if valid show `RestoreBackupDialog`; if invalid show an error toast and do not open the dialog
- [x] 6.4 On confirm in `RestoreBackupDialog`, call `restoreProfiles` from the store, show a success toast with the restored preset count, and close the dialog
- [x] 6.5 On cancel in `RestoreBackupDialog`, do nothing and close the dialog

## 7. Unit Tests

- [x] 7.1 Add unit tests in `src/lib/profileBackup.test.ts` for `exportBackup`: verify the output parses to valid JSON, has `version: 1`, has the correct preset count, includes `clock` on each preset, and excludes `id`
- [x] 7.2 Add unit tests for `importBackup` with a valid round-trip (export → import), a malformed JSON string (returns `null`), a payload missing `version` (returns `null`), and a payload with a bad clock field (returns `null`)
- [x] 7.3 Add unit tests in `src/store/index.test.ts` for `restoreProfiles`: verify it replaces all existing profiles, assigns new IDs, activates the first profile, and normalizes missing `clock` fields
- [x] 7.4 Update `profileShare.test.ts` `encodeProfile` tests to assert the encoded payload includes a `clock` object
- [x] 7.5 Update `profileShare.test.ts` `decodeProfile` round-trip tests to include `clock` in fixture data and assert `clock` survives the round-trip
- [x] 7.6 Add a `decodeProfile` test for a share payload without `clock` to confirm the behavior (reject or accept with default — must match the implementation decision from task 1.2)

## 8. E2E Tests

- [x] 8.1 Add an e2e scenario in `e2e/profile-share.spec.ts` that shares a profile and verifies the imported profile has clock settings matching the original
- [x] 8.2 Create `e2e/profile-backup.spec.ts` with a test that clicks "Export presets" and verifies a download is triggered
- [x] 8.3 Add a test that programmatically injects a valid backup JSON via the file input, confirms the restore dialog, and verifies the preset list is replaced and the first preset is active
- [x] 8.4 Add a test that injects an invalid JSON string via the file input and verifies no restore dialog appears and an error toast is shown
