---
description: "Release GlowFrame: show changes since last tag, confirm version bump, build production, commit, tag, and push."
name: "release"
argument-hint: "Optional: patch | minor | major | <explicit semver>"
agent: "agent"
---

You are performing a release of GlowFrame. Follow these steps exactly and in order. Do not skip any step.

## Step 1 — Summarise changes since the last release

Run the following command and capture the output:

```
git log $(git describe --tags --abbrev=0 2>/dev/null || git rev-list --max-parents=0 HEAD)..HEAD --oneline
```

If `git describe` fails (no tags exist yet), fall back to listing all commits via `git log --oneline`.

Also retrieve the current version from `package.json` and the latest git tag:

```
node -p "require('./package.json').version"
git describe --tags --abbrev=0 2>/dev/null || echo "(no tags yet)"
```

Present the commit list and the current version clearly to the user.

## Step 2 — Confirm the version bump

Ask the user to choose a bump type using the `vscode_askQuestions` tool. Show the list of commits from Step 1 as context in your message.

Questions to ask (in one call):
1. **bumpType** — "Which version bump type should be applied?" with options `patch`, `minor`, `major`, and a free-form option for an explicit semver (e.g. `1.2.3`). Mark `patch` as recommended.
2. **confirmRelease** — "Ready to proceed with the release?" with options `Yes, proceed` and `No, abort`. Mark `Yes, proceed` as recommended.

If the user selects **No, abort**, stop immediately and inform them that no changes have been made.

## Step 3 — Bump the version

Run:

```
npm version <bumpType> --no-git-tag-version
```

Use `--no-git-tag-version` so npm does not create its own commit or tag — the commit and tag are handled manually in later steps so the production build is included.

Capture and display the new version string (e.g. `v1.2.1`).

## Step 4 — Build for production

Run:

```
npm run build:prod
```

If the build fails, stop immediately, report the error, and remind the user that `package.json` has been modified but not committed. They should either fix the build error or revert with `git checkout -- package.json package-lock.json`.

## Step 5 — Commit all changes

Stage and commit everything that was produced by the build and version bump:

```
git add docs/ package.json package-lock.json
git commit -m "chore: release <newVersion>"
```

Replace `<newVersion>` with the version string captured in Step 3 (e.g. `chore: release v1.2.1`).

## Step 6 — Create a git tag

Create an annotated tag matching the version in `package.json`:

```
git tag -a <newVersion> -m "Release <newVersion>"
```

## Step 7 — Push commits and tags

```
git push
git push --tags
```

## Step 8 — Confirm success

Report a brief success summary to the user:
- New version released
- Tag created and pushed
- GitHub Pages will be updated once GitHub serves the new `docs/` folder from `main`
