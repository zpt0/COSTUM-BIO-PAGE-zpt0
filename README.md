# bio — guns.lol style profile page (static, no build)

Vanilla HTML/CSS/JS, ES modules, zero dependencies. Upload the folder as-is.

## Run locally

```powershell
node server.js
# -> http://127.0.0.1:8000
```
Zero dependencies (only `node:http`). Preloads everything into RAM once,
answers `/health` with ok, keeps foreign `/v1/*` probes quiet, supports
Range requests (video seeking) and never serves stale files (`no-cache`).

## Configure

All in `js/config.js`: name, bio, location, avatar, background video/poster,
audio tracks, socials, theme, effects, `protect`, `viewsStart`.

Social `icon` is a built-in key (`github steam roblox discord youtube tiktok
twitch instagram x telegram spotify link` — paths verified vs Simple Icons v13)
or a custom image path/URL, e.g. `{ icon: "./assets/discord.webp", url: "..." }`.

## Deploy (any static host, no build command, output = `/`)

- **Vercel:** `vercel` in this folder (or drag-drop). Headers via `vercel.json`.
- **GitHub Pages:** push repo → Settings → Pages → Deploy from branch.
  `.nojekyll` is included. Project subpaths work (all paths are relative).
- **Cloudflare Pages:** `Create → Pages → Upload assets` or `wrangler pages
  deploy .`. Cache/security headers via `_headers`.

## Performance (measured locally)

| asset | size | when loaded |
|---|---|---|
| `index.html` + css + js | ~30 KB | immediately |
| `assets/bg-poster.jpg` (exakt Frame 0, preloaded) | 6 KB | immediately |
| `assets/pfp.png` | 157 KB | immediately |
| `assets/bg.mp4` (960x540, faststart, no audio) | 9,6 MB | buffers in background, starts on enter |
| `assets/song.mp3` (128k) | 2,4 MB | buffers in background, starts on enter |

Video (156,6565 s) und Audio (156,6650 s) sind 8,5 ms auseinander. Sync-Design:
Enter wartet auf `canplaythrough` beider Medien (`loading...`), dann starten
beide ab 0 im selben Tick. Audio ist Master-Clock, `js/modules/sync.js`
zieht das Video jede Sekunde nach (Schwelle 0,3 s, auch nach Tab-Wechsel).
Am Track-Ende starten beide gemeinsam neu — Loop läuft endlos synchron.

First paint ≈ 200 KB. The 195 MB 4K source was re-encoded to 960p and the
originals deleted (GitHub refuses files > 100 MB). Keep `assets/` filenames
simple (no spaces/brackets) or hosting + URLs break.

## Copy protection

`protect: true` in `js/config.js` enables: no right-click, no drag, no text
selection, blocked F12 / Ctrl+U/S/C / Ctrl+Shift+I,J,C, console warning,
non-draggable images, `user-select: none` (`css/base.css`).

Honest limit: a static site cannot be truly protected — the browser must
download everything to display it. This stops casual copying only.

## Structure

```text
index.html
vercel.json  _headers  .nojekyll  .gitignore  server.js
css/    base.css enter.css card.css player.css effects.css
js/     config.js main.js
js/modules/  theme.js background.js socials.js player.js fx.js
             icons.js extras.js protect.js sync.js typewriter.js
assets/ bg.mp4 bg-poster.jpg song.mp3 pfp.png favicon.png (rund, aus pfp)
        cover-static.webp ...
```

After changing any css/js, bump the `?v=` query in `index.html` + all
`import` lines (e.g. `?v=5` → `?v=6`) so browsers fetch fresh files.
