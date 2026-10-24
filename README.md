# StudySpace Notes Studio — full source code

## Files
- `index.html` — app structure and controls
- `style.css` — responsive dark UI styling
- `app.js` — local note storage, highlight toggle/colors, pen canvas, undo/eraser, backup import/export
- `manifest.webmanifest` — installable PWA metadata
- `sw.js` — offline caching service worker

## Test on your tablet
Extract the ZIP and open `index.html` to test basic functions. Browser local-file mode may not support installing the PWA or service worker. To install and use offline through GitHub Pages, upload all files/folders to your repository root and wait for deployment. Open the HTTPS GitHub Pages URL once while online, then refresh and test offline.

## Important note storage warning
Notes are stored in browser localStorage on this device. Export backups regularly. Clearing site data or uninstalling/clearing browser data can erase notes. This prototype uses a new storage key (`studyspace11201_data_v1`) and does not automatically merge into your existing StudySpace data. Back up existing notes before integrating.


Math support: the default subject list now includes Math. The typed-note editor includes number buttons (0–9), arithmetic operators (+, −, ×, ÷, =), brackets, powers, square root, pi, percent, slash, and decimal point. Tap a button to insert it at the cursor, then press Save typed note. Back up your current notes before replacing files.
