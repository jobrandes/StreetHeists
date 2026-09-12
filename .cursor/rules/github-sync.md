# GitHub sync (always)

Jo tests from **https://github.com/jobrandes/StreetHeists**, not only Cursor Origin.

Whenever you commit finished work:

1. Push to Cursor Origin `main` as usual.
2. **Also sync the same commit to GitHub** `jobrandes/StreetHeists` on `main` (create/update files via GitHub MCP `push_files`, or `git push` if a GitHub remote is configured).
3. Tell Jo to `git pull` on her machine after the GitHub sync.

Do not assume Origin and GitHub are the same remote — they are not. If Jo says she is “up to date” but still sees old UI (e.g. dark theme), sync GitHub immediately.
