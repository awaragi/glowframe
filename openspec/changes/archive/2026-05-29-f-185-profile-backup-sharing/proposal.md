## Why

GlowFrame currently lets users share a single preset through a URL, but it does not provide a way to back up or restore the full preset library. With clock configuration now stored per profile, both sharing and backup flows need to carry clock settings so users can transfer complete presets without losing clock behavior.

## What Changes

- Add a bulk backup/export flow that downloads all presets as a JSON file.
- Add a bulk restore/import flow that replaces all existing presets with the imported presets.
- Regenerate profile IDs during share import and bulk restore instead of preserving serialized IDs.
- Make bulk restore activate the first restored preset instead of restoring a serialized active profile ID.
- Extend share-link encoding and decoding to include each preset's clock configuration.
- Validate backup files and share payloads with explicit versioned schemas before import.

## Capabilities

### New Capabilities
- `profile-backup-restore`: Export all presets to a JSON backup and restore them by replacing the current preset collection.

### Modified Capabilities
- `profile-share`: Expand shared preset payloads to include clock configuration while continuing to import them as new presets with regenerated IDs.

## Impact

- Affected specs: `profile-share`, new `profile-backup-restore`
- Affected code: settings modal actions, share payload helpers, import flows, Zustand profile store persistence, related unit and e2e coverage
- Affected data contracts: serialized preset payloads for share links and backup files
