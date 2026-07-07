# Charlène & Julien — site de mariage

Production implementation of the Claude Design prototype (`project/Mariage.html` + `project/app.jsx`) for the wedding of Charlène & Julien, 11–13 June 2027, Château les Oliviers de Salette (Provence).

The original design bundle (`README.md` history, `chats/`, `project/`) is kept for reference; this is the real build.

## Stack

- **client/** — React + Vite static frontend, ported section-by-section from the prototype.
- **server/** — Express + SQLite (`better-sqlite3`) API: password-gated session auth, room booking, photo uploads.

## Setup

```bash
npm install
cp server/.env.example server/.env   # adjust SITE_PASSWORD if needed
npm run dev                          # runs client (5173) + server (4000) together
```

Open http://localhost:5173 — the Vite dev server proxies `/api` and `/uploads` to the backend.

Site password (change via `SITE_PASSWORD` in `server/.env`): `provence2027`

## Production

```bash
npm run build     # builds client/dist
npm start         # runs the Express server (serve client/dist separately or add static hosting as needed)
```

The SQLite database lives at `server/data/wedding.sqlite` (created on first run, pre-seeded with 5 rooms already booked by other guests, matching the original design's demo state). Uploaded photos are stored in `server/uploads/`. Both are gitignored — back them up before redeploying.

## What changed vs. the design prototype

- Rewrote the single `app.jsx` (React-via-CDN + in-browser Babel) into a proper Vite-built React app with one component per file.
- Room booking (`Chambres`) and photo uploads (`PhotoSlot`) now persist server-side (SQLite + disk) instead of `localStorage`, so they're visible to every guest, not just the browser that made the change.
- The password gate now checks the password server-side and issues an httpOnly session cookie, instead of comparing a hardcoded string in client JS.
- Dropped the "Tweaks" panel and `postMessage` edit-mode code — that was a Claude Design authoring affordance, not part of the real site. The chosen defaults (crème palette, EB Garamond serif, terracotta accent) are baked into `client/src/styles/global.css`.
- No payment integration yet — "Réserver" persists a real booking but doesn't charge a card. Wire in Stripe (or similar) when ready.
