# Eternal Sky Tour — Frontend (Phase 1)

Next.js (App Router) + React + TypeScript (strict) + Tailwind CSS v4 + Framer Motion.
Site content comes from local mock data through a service layer. Trip plans, the website chat and the staff
admin area (`/admin`) run on the FastAPI backend in [`backend/`](backend/README.md); start it alongside
`npm run dev` (the site proxies `/api/*` to it, `BACKEND_URL` defaults to `http://127.0.0.1:8000`).

```bash
npm install
npm run dev        # http://localhost:3000  → redirects to /en
npm run lint
npm run typecheck
npm run build && npm start
```

## Architecture

```
mock data (src/data)  →  services (src/services)  →  pages (src/app/[locale])  →  components (props only)
```

- **Components never import `src/data`.** Pages call async services; services are the single seam to replace with REST calls.
- **Locales:** every URL is prefixed (`/en/...`). `src/lib/i18n.ts` lists `en mn ko ja zh ru`; only `en` is enabled.
  `src/proxy.ts` redirects un-prefixed or not-yet-enabled locales to `/en`. Internal links use `<LocaleLink>`.
- **Images:** self-hosted in `public/images`, registered once in `src/data/images.ts` with alt text and attribution.
  They are openly licensed Wikimedia Commons photos — CC BY / CC BY-SA credits are shown on `/en/gallery#credits`.
- **SEO:** `lib/metadata.ts` (title template, canonical, hreflang, OG/Twitter), `lib/structured-data.ts` (JSON-LD),
  `app/sitemap.ts`, `app/robots.ts`.

## World explorer (`/en/explore`)

A full-screen world map (MapLibre GL JS) with place search and a multi-stop route planner. The route is kept in the
URL (`?stops=…&modes=…`), so any route can be shared without an account. Mongolia is highlighted and our destinations
are pinned on the map.

```
src/app/[locale]/explore/page.tsx      page (server) → components/explorer/explorer-loader.tsx (client-only)
src/components/explorer/               map-view (MapLibre), place-search, route-panel, detail-panels, world-explorer
src/app/api/geo/search/route.ts        GET place search  → services/geo/geocoder.ts
src/app/api/geo/route/route.ts         GET one road leg  → services/geo/router.ts
src/lib/explorer/                      geometry, URL encoding, formatting, EN/MN strings (messages.ts)
public/geo/                            country facts + shapes, built by scripts/build-world-data.mjs
```

`/api/geo/*` are Next.js route handlers; they take precedence over the `/api/*` rewrite to the FastAPI backend, so the
explorer works without the backend. API keys stay server-side.

| Service | Used for | Key | Cost / limits |
| --- | --- | --- | --- |
| [OpenFreeMap](https://openfreemap.org) | Basemap tiles (light `positron`, dark `dark`) | none | Free, commercial use allowed, no request limits, **no SLA** |
| [Photon](https://photon.komoot.io) (default) | Place search | none | Free fair-use public instance, no published quota or SLA; heavy use is throttled |
| [openrouteservice](https://openrouteservice.org) | Driving / walking / cycling routes (and optional search) | `ORS_API_KEY` | Free Standard plan: 2,000 directions/day (40/min), 1,000 autocomplete/day |

Flight legs are drawn locally as great-circle lines and labelled illustrative; no schedules, fares or flight times are
shown. Without `ORS_API_KEY`, road legs say routing isn't configured instead of estimating anything.

Environment variables (Vercel → Project → Settings → Environment Variables):

| Variable | Default | Purpose |
| --- | --- | --- |
| `ORS_API_KEY` | — | Enables road routing. Server-side only; never prefix with `NEXT_PUBLIC_`. |
| `GEOCODER_PROVIDER` | `photon` | `ors` to search with openrouteservice instead (uses the same key). |
| `PHOTON_URL` | `https://photon.komoot.io` | Point at a self-hosted Photon instance. |
| `NEXT_PUBLIC_MAP_STYLE_LIGHT` / `_DARK` | OpenFreeMap styles | Swap the basemap, e.g. a MapTiler style with a domain-restricted key. |

Cost controls: search results are CDN-cached for a day and routes for a week (`Cache-Control: s-maxage`), the browser
debounces and caches searches, and each IP is limited to 60 searches and 30 route requests per minute per server
instance. For a hard global limit, add a Vercel Firewall rate-limit rule on `/api/geo/*`.

MapLibre v6 loads its Web Worker from a URL, so `npm run dev` / `npm run build` first copy it to `public/vendor/`
(`scripts/copy-maplibre-worker.mjs`, git-ignored). Regenerate the country data with the commands at the top of
`scripts/build-world-data.mjs`. Unit tests: `npm test`.

## Placeholders to replace before launch

- `src/lib/site-config.ts` — domain, email, phone, social URLs (or set `NEXT_PUBLIC_SITE_URL`)
- `src/data/testimonials.ts` — sample reviews (flagged `isPlaceholder`)
- `src/data/guest-house.ts` — rooms, rates, address, photos
- `src/data/legal.ts` — draft booking terms and privacy policy
- `src/services/inquiry-service.ts` — the trip planner is live; the contact form and newsletter do not submit anywhere yet
