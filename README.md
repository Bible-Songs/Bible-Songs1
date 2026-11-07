# Bible Songs

An original Bible-inspired music app, beginning with “Let There Be Light,” a Genesis 1 song adaptation. Includes a locally synthesized instrumental demo, original lyrics, MIDI, the full public-domain chapter reference, user favorites, and Supabase sign-in. A robotic synthetic vocal draft is available alongside the instrumental version; it uses only free local tools.

## Development

Use Node.js 22.13 or newer.

```sh
npm ci
npm run dev
npm run build
```

## Deployment

The GitHub Actions workflow builds and deploys to https://bible-songs.github.io/Bible-Songs1/ on pushes to `main`. In repository Settings → Pages, set **Source** to **GitHub Actions** once. The Vite base path is `/Bible-Songs1/`.

Music is generated from our own composition script, using no external recordings or samples. Images are from Unsplash. Favorites are stored locally in the listener’s browser.

## Supabase authentication

Bible Songs uses project `Bible-songs1` at `https://rzvfeeatzksvgxucbzbo.supabase.co` for email/password sign-in, registration, and password recovery. The browser publishable key in `source/supabase.ts` is public by design. No administrative key is used. Existing users from this reused project can also sign in. No existing tables, users, or provider settings are modified by this app.

In Supabase **Authentication → URL Configuration**, set Site URL to `https://bible-songs.github.io/Bible-Songs1/` and add that exact URL to Redirect URLs. These settings are needed for password reset and any email confirmation links. The publishable key cannot change dashboard settings.

Sessions persist in session storage for the current browser tab, matching the other project's sign-in pattern. Favorites are stored on this browser under a user-specific key; they do not sync to Supabase. The previous anonymous favorites key is retained locally without assigning it to an arbitrary account.

GitHub Pages serves public static files and the original demo audio remains public. The sign-in screen manages application sessions, not server-enforced privacy for the audio or source files.

## Version history

The version in package.json is displayed on both sign-in and home page footers. Increase it for each published change and keep package-lock.json aligned. The local pre-push hook also checks that the new version is greater than the currently uploaded version.

- **1.0.1** — Copyright footer and visible version on sign-in and home screens.

- **1.0.2** — Removed the third-party audio catalog, all stream references, featured recordings and old favorites display. Introduced the original Genesis 1 project: adapted lyrics, composition demo, editable MIDI and public-domain chapter text.

## Original music production

See `public/originals/genesis-1/production-notes.md`. Run `python3 scripts/compose-genesis.py` to rebuild the demo. No paid service is called by this script. `song.json` records section timings, lyrics, source text attribution and production status. A future sung recording must have its publishing rights documented before replacing the demo.

Historical commits and local historical snapshots retain the old application as records; the current deployed application contains none of its previous third-party song catalog or stream links.

- **1.0.3** — Switched the complete Genesis 1 reference text, source links and production credits to the public-domain Berean Standard Bible (BSB), selected as the best overall modern-English alternative for NIV readers among the translations reviewed. Original adapted lyrics and instrumental melody are unchanged; they are not labeled as verbatim BSB.

Scripture text: Berean Standard Bible (BSB), dedicated to the public domain on April 30, 2023. All uses freely permitted: https://berean.bible/terms.htm. Text source: https://ebible.org/engbsb/GEN01.htm. See `docs/translation-choice.md` for the comparison and limitations.

The **1.0.3** update also includes a free local synthetic vocal draft, with an instrumental/vocal selector and downloadable audio. This is a deliberately robotic proof of concept, not a natural human vocal. No paid tools or generation services were used. Production details and software licensing notes are in `public/originals/genesis-1/production-notes.md`.

- **1.0.4** — Added vocal choices with a remembered selection: the unchanged Classic synthetic voice, new Warm expressive experimental voice, and instrumental-only playback. Added short in-app notes explaining both vocal creation processes.

### Rebuilding the warm voice (free, offline inference)

Install `kokoro-onnx==0.6.1`, `onnxruntime==1.22.0` and NumPy in a local Python environment. Download the free model `kokoro-v1.0.onnx` and voice file `voices-v1.0.bin` from the official model-files-v1.1 release: https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.1. Default runtime location is the sibling `voice-tools/` directory, with Python packages under `deps/`. Run `python3 scripts/render-warm-vocal.py --runtime-dir ../voice-tools`. The model/runtime files are not part of the published app. See `docs/vocal-design.md` for the performance brief and `public/originals/genesis-1/production-notes.md` for licensing/provenance.
