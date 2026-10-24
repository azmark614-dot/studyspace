# StudySpace 11–12 — installable web app

## What is included
- Nine school subjects
- Typed notes and chapter/topic field
- Hide/reveal answers for recall practice
- Pen/math drawing pad for a universal touchscreen stylus
- Search, local saving, JSON backup and restore
- Offline cache after the first successful visit

## Important
A Progressive Web App (PWA) normally must be served from an HTTPS website to install reliably and use offline caching. Opening `index.html` directly from Files is not enough to install it as an app.

## Easiest free hosting option: GitHub Pages
1. On your tablet, open github.com and sign in or create an account.
2. Create a new public repository, for example `studyspace`.
3. Upload `index.html`, `manifest.webmanifest`, `sw.js`, and `icon.svg` from this folder to the repository's root.
4. In the repository, open **Settings → Pages**.
5. Under build/deployment, choose **Deploy from a branch**, select `main` and `/(root)`, then Save.
6. Wait until GitHub Pages gives you an HTTPS website address.
7. Open that website in Chrome on your Infinix XPad.
8. Tap Chrome's **⋮** menu → **Install app** or **Add to Home screen** → confirm.
9. Open StudySpace from the new home-screen icon. Visit it once while online before trying offline mode.

## Keep your notes safe
- Notes are saved in browser local storage on this device/browser profile.
- Tap **Backup** regularly; save the JSON file to Google Drive or another safe place.
- **Restore replaces the current notes** with the backup, so export a fresh backup first.
- Do not clear Chrome site data or uninstall/reset the browser before backing up.
- This prototype does not provide automatic cloud sync, accounts, or secure multi-device sync.

## Updating the app
Upload the replacement files to the same repository. Reopen the website while online. If the old version remains, close and reopen Chrome or clear the site's cached files only after exporting your notes.


MODERN UPDATE
Includes system/light/dark theme choices, a custom background color, multiple highlight colors,
emoji stickers, colored tags, and attachments for photos/files (up to 4 MB each). Attachments are
stored locally in browser storage and included in JSON backups. Keep backups safe; there is no
automatic cloud sync. To update an existing GitHub Pages repository, upload index.html and sw.js
from this folder and commit the changes. Do not upload the ZIP itself.


PINK ABSTRACT EDITION
This customized edition opens in Dark mode with a pink accent and an abstract image background (abstract-pink.svg). Keep abstract-pink.svg in the same repository folder as index.html. To publish, upload all files from this ZIP to the repository root and commit changes. Back up your notes before clearing browser data; this app stores notes locally and does not auto-sync.
