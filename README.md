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
