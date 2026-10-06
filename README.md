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

## Placeholders to replace before launch

- `src/lib/site-config.ts` — domain, email, phone, social URLs (or set `NEXT_PUBLIC_SITE_URL`)
- `src/data/testimonials.ts` — sample reviews (flagged `isPlaceholder`)
- `src/data/guest-house.ts` — rooms, rates, address, photos
- `src/data/legal.ts` — draft booking terms and privacy policy
- `src/services/inquiry-service.ts` — the trip planner is live; the contact form and newsletter do not submit anywhere yet
