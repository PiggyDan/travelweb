import { allowRequest, clientKey } from "@/services/geo/rate-limit";
import { searchPlaces } from "@/services/geo/geocoder";

/**
 * GET /api/geo/search?q=seoul&lang=en — place search for the world explorer.
 *
 * Served by this Next.js app (static route handlers win over the `/api/*`
 * rewrite to the FastAPI backend in next.config.ts). Results are cached at
 * the CDN for a day, so repeated queries don't reach the geocoder.
 */

const LANG = /^[a-z]{2}$/;

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const query = (params.get("q") ?? "").replace(/\s+/g, " ").trim();
  const lang = params.get("lang") ?? "en";

  if (query.length < 2 || query.length > 100 || !LANG.test(lang)) {
    return Response.json({ error: "Enter 2 to 100 characters." }, { status: 400 });
  }
  if (!allowRequest("geo-search", clientKey(request), 60)) {
    return Response.json({ error: "Too many searches. Please wait a moment." }, { status: 429, headers: { "Retry-After": "60" } });
  }

  try {
    const data = await searchPlaces(query, lang);
    return Response.json(data, {
      headers: { "Cache-Control": "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800" },
    });
  } catch (error) {
    console.error("[geo/search]", error);
    return Response.json({ error: "Place search is unavailable right now." }, { status: 502, headers: { "Cache-Control": "no-store" } });
  }
}
