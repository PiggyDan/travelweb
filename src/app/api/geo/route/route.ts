import { isValidLatLon, roundCoord } from "@/lib/explorer/geo";
import { allowRequest, clientKey } from "@/services/geo/rate-limit";
import { routeLeg } from "@/services/geo/router";
import type { GeoRouteResponse, RoadMode, RouteUnavailableReason } from "@/types/explorer";

/**
 * GET /api/geo/route?mode=driving&from=lon,lat&to=lon,lat — one road leg.
 *
 * Flight legs never reach this handler: the browser draws them as
 * illustrative great-circle lines. Coordinates are rounded so equal legs
 * share one CDN cache entry; successful routes are cached for a week.
 */

const ROAD_MODES: readonly RoadMode[] = ["driving", "walking", "cycling"];

/** Outcomes that won't change on retry are cached; transient failures are not. */
const STABLE_REASONS: readonly RouteUnavailableReason[] = ["no_route", "no_road_nearby", "too_far", "not_configured"];

function parsePoint(value: string | null): [number, number] | null {
  const [lon, lat] = (value ?? "").split(",").map(Number);
  return lon !== undefined && lat !== undefined && isValidLatLon(lat, lon) ? [roundCoord(lon), roundCoord(lat)] : null;
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const mode = params.get("mode") as RoadMode;
  const from = parsePoint(params.get("from"));
  const to = parsePoint(params.get("to"));

  if (!ROAD_MODES.includes(mode) || !from || !to) {
    return Response.json({ status: "unavailable", reason: "invalid" } satisfies GeoRouteResponse, { status: 400 });
  }
  if (!allowRequest("geo-route", clientKey(request), 30)) {
    return Response.json({ status: "unavailable", reason: "rate_limited" } satisfies GeoRouteResponse, {
      status: 429,
      headers: { "Retry-After": "60" },
    });
  }

  const result = await routeLeg(mode, from, to);
  const cacheable = result.status === "ok" || STABLE_REASONS.includes(result.reason);
  if (result.status === "unavailable" && !cacheable) console.error("[geo/route]", mode, result.reason);

  return Response.json(result, {
    headers: {
      "Cache-Control":
        result.status === "ok"
          ? "public, max-age=3600, s-maxage=604800, stale-while-revalidate=604800"
          : cacheable
            ? "public, max-age=600, s-maxage=3600"
            : "no-store",
    },
  });
}
