# StudySpace Android app

This Android project wraps the StudySpace HTML note-taking app in a native Android WebView and uses a notebook-and-pen launcher icon. It supports JavaScript, localStorage, and the file picker for importing backups and adding photos/videos.

## Build an APK with GitHub Actions (no computer build tools needed)

1. Create a new GitHub repository, for example `studyspace-android`.
2. Upload the **contents** of this folder (not the outer folder) to the repository's main branch. Make sure `.github/workflows/build-apk.yml` is included.
3. Open the repository on GitHub and choose **Actions**.
4. Select **Build StudySpace APK** and tap **Run workflow** (or push a commit to `main`/`master` to trigger a build).
5. When it finishes, open that workflow run and download the artifact named **StudySpace-debug-APK**.
6. Extract the downloaded artifact ZIP to get `app-debug.apk`, then open it on your Android phone and allow installation from that source if Android asks.

This produces a debug APK for personal testing. For public Play Store distribution, create a signed release build and review the app's privacy/data-storage behavior first.

## Data note

Notes are stored in the app's WebView local storage on that device. They do not automatically sync with the website or another device. Use the app's **Export backup** function regularly. Clearing app data or uninstalling can erase notes that have not been backed up.
