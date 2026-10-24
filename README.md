# StudySpace Notes — complete source

A responsive, installable PWA-style study notebook for tablet and mobile. All project files are at the ZIP root.

## Features
- Subject list: کوردی، عەرەبی، ئینگلیزی، فەلسەفە، ئاین، ئابووری، مێژوو، بیرکاری، جوگرافیا
- Kurdish, English, Arabic interface switch; Arabic RTL layout
- Typed notes with bold, italic, bullets, numbered lists, to-do lines, font size, text color, and highlight color
- Separate grid-paper pen canvas with color, thickness, eraser, undo, clear, and save
- Autosave in browser local storage
- JSON backup export/import
- Basic service-worker caching for offline app shell
- Responsive layout for tablet and phone

## Run locally
Open `index.html` in a browser. For PWA/offline service-worker behavior, serve these files from a local web server or publish with HTTPS (for example GitHub Pages).

## Publish to GitHub Pages
1. Back up your current repository and export existing notes before replacing files.
2. Extract this ZIP.
3. Upload the contents directly into the repository root (not an extra nested folder).
4. Commit changes and wait for Pages to finish publishing.
5. Reload the website. If an older app shell remains cached, close the installed PWA and refresh the website; the service worker cache name is `studyspace-notes-v1`.

## Important data note
This project uses localStorage key `studyspace-notetaking-v1`. It does not automatically import data from other StudySpace prototypes or sync notes across devices. Use Backup/Restore to move data manually. Restoring a backup replaces the current data after confirmation.
