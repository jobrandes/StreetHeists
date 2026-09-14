#!/usr/bin/env bash
# Netlify ignore script — exit 0 skips the build (does not burn quota).
# Exit 1 (or non-zero) proceeds with a normal build.
#
# Skips when:
# - Commit message has [skip ci] / [skip netlify] / [netlify skip]
# - Diff vs last built commit is empty or only docs / probe / agent chrome
set -euo pipefail

MSG="$(git log -1 --pretty=%B 2>/dev/null || true)"
if printf '%s' "$MSG" | grep -qiE '\[skip[[:space:]]+(ci|netlify)\]|\[netlify[[:space:]]+skip\]'; then
  echo "netlify-ignore: skip marker in commit message"
  exit 0
fi

BASE="${CACHED_COMMIT_REF:-}"
HEAD="${COMMIT_REF:-HEAD}"

if [[ -z "$BASE" || "$BASE" == "null" ]]; then
  echo "netlify-ignore: no cache ref — build"
  exit 1
fi

CHANGED="$(git diff --name-only "$BASE" "$HEAD" 2>/dev/null || true)"
if [[ -z "${CHANGED//[[:space:]]/}" ]]; then
  echo "netlify-ignore: empty diff — skip"
  exit 0
fi

# If every changed path is skippable, skip the build.
while IFS= read -r path; do
  [[ -z "$path" ]] && continue
  case "$path" in
    README.md|docs/*|.cursor/*|.cursor-agent-probe*|*.md)
      continue
      ;;
    *)
      echo "netlify-ignore: code change ($path) — build"
      exit 1
      ;;
  esac
done <<< "$CHANGED"

echo "netlify-ignore: docs/probe-only — skip"
exit 0
