# Bible Songs

A responsive Bible song player with all 66 books, chapter selection, musical styles, voices, English and Spanish, favorites, and playback controls.

## Development

Use Node.js 22.13 or newer.

```sh
npm ci
npm run dev
npm run build
```

## Deployment

The GitHub Actions workflow builds and deploys to https://bible-songs.github.io/Bible-Songs1/ on pushes to `main`. In repository Settings → Pages, set **Source** to **GitHub Actions** once. The Vite base path is `/Bible-Songs1/`.

Audio streams from [TheSinging.Bible](https://thesinging.bible/), whose availability and content remain controlled by that provider. Images are from Unsplash. Favorites are stored locally in the listener’s browser.

## Supabase authentication

Bible Songs uses project `Bible-songs1` at `https://rzvfeeatzksvgxucbzbo.supabase.co` for email/password sign-in, registration, and password recovery. The browser publishable key in `source/supabase.ts` is public by design. No administrative key is used. Existing users from this reused project can also sign in. No existing tables, users, or provider settings are modified by this app.

In Supabase **Authentication → URL Configuration**, set Site URL to `https://bible-songs.github.io/Bible-Songs1/` and add that exact URL to Redirect URLs. These settings are needed for password reset and any email confirmation links. The publishable key cannot change dashboard settings.

Sessions persist in session storage for the current browser tab, matching the other project's sign-in pattern. Favorites are stored on this browser under a user-specific key; they do not sync to Supabase. The previous anonymous favorites key is retained locally without assigning it to an arbitrary account.

GitHub Pages serves public static files and the source audio remains public. The sign-in screen manages application sessions, not server-enforced privacy for the audio or source files.

## Version history

The version in package.json is displayed on both sign-in and home page footers. Increase it for each published change and keep package-lock.json aligned. The local pre-push hook also checks that the new version is greater than the currently uploaded version.

- **1.0.1** — Copyright footer and visible version on sign-in and home screens.
