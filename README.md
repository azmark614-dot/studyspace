# StudySpace — fresh starter build

A simple static web app starter for an Android tablet. Includes subject dashboard, typed notes, local saving, math symbol insertion, paper-like canvas drawing, pen/highlighter/eraser controls, undo, dark mode, and JSON backup/restore.

## Files
- `index.html` — app structure
- `style.css` — responsive design and themes
- `app.js` — note data, drawing tools, local storage, backup/restore
- `manifest.webmanifest` — PWA metadata
- `service-worker.js` — offline cache starter

## Run locally
Open `index.html` in a modern browser. Local storage and canvas work in a browser. PWA/offline caching requires serving over HTTPS or localhost and registering the service worker.

## Publish on GitHub Pages
1. Back up the existing repository and any notes.
2. Upload the contents of this folder to the repository root or the configured Pages publishing folder.
3. Commit the changes to the branch/folder configured in Settings → Pages.
4. Wait for deployment and open the published site.
5. Test on the actual Android tablet.

## Important limitations of this starter
- Language selector currently saves the selected language but does not translate every UI label.
- Notes are stored in this browser's local storage; clearing browser/site data can remove them. Use Export Backup regularly.
- The drawing canvas is a single page per note in this first build.
- This is a starter implementation and has not been verified on the user's device or deployed website yet.
