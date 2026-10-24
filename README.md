# StudySpace Notes Studio — Complete Rebuild

A small, offline-ready study-notes PWA designed for tablets. The ZIP contents are at the repository root: upload the files directly, not an enclosing folder.

## Features

- **Mathematics is included by default** in the left-side subject list and is named **Mathematics** in English, **بیرکاری** in Kurdish, and **الرياضيات** in Arabic.
- Three interface languages: Kurdish (Sorani), English, and Arabic. Kurdish and Arabic switch to RTL layout.
- Typed notes with highlight colors and an always-visible number/symbol keyboard.
- Dedicated Math workspace: question/equation field, symbol toolbar, working steps/answer field, and a live text preview.
- Separate grid-paper handwriting canvas with pen color/size, eraser, undo, clear, touch/stylus pointer support, and stored strokes.
- Auto-save to browser local storage, saved-notes list, custom subjects, import/export backup, PWA manifest, and offline service-worker cache.
- No external JavaScript libraries, fonts, or network APIs are required for normal use.

## Publish or update with GitHub Pages

1. Back up your existing repository files and export any notes from the existing app first.
2. Extract this ZIP. The six source/support files and two icon files are directly at the ZIP root; do not upload a parent folder.
3. Open the repository root on GitHub and upload `index.html`, `style.css`, `app.js`, `manifest.webmanifest`, `sw.js`, `icon-192.png`, `icon-512.png`, and `README.md` directly to it.
4. Commit the changes and wait for GitHub Pages to finish publishing.
5. On the tablet, open the published site in Chrome. Do a hard refresh or clear only the site's cached files if it is displaying an older cached version. Do not clear site storage unless your notes have been exported.
6. Verify Mathematics appears at left, switch the language between all three options, create a test note, add a few equation symbols, write on the grid, reload, and confirm the test note remains.

## Data safety

This build uses a **new storage key** (`studyspace_notes_studio_rebuild_v3`) so it will not overwrite local data saved by an older StudySpace/Notes Studio version. Consequently, old-version notes do not automatically appear in this build. Export them from the old app before switching and retain the backup file. The app's Import Backup accepts this build's own export format; migration from older/custom schemas may need a manual conversion if the structures differ.

## Basic local checks

Run `node --check app.js` to verify JavaScript syntax. Service worker caching works on HTTPS (such as GitHub Pages) or localhost, not by opening `index.html` as a `file://` URL.
