import "server-only";
import type { GeoRouteResponse, RoadMode, RouteUnavailableReason } from "@/types/explorer";

/**
 * Road routing for one leg, behind `GET /api/geo/route`, using the
 * openrouteservice Directions API (OpenStreetMap data).
 *
 * Needs ORS_API_KEY (server-side only). The free Standard plan allows 2,000
 * directions requests/day and 40/minute. Without a key, road legs report
 * "not_configured" and the UI says so; nothing is estimated in their place.
 */

const PROFILES: Record<RoadMode, string> = {
  driving: "driving-car",
  walking: "foot-walking",
  cycling: "cycling-regular",
};

/** How far (metres) a stop may be from the nearest road. Cities are geocoded to their centre. */
const SNAP_RADIUS_M = 5_000;
const TIMEOUT_MS = 12_000;

export function isRoutingConfigured(): boolean {
  return Boolean(process.env.ORS_API_KEY);
}

export async function routeLeg(
  mode: RoadMode,
  from: [number, number],
  to: [number, number],
): Promise<GeoRouteResponse> {
  const key = process.env.ORS_API_KEY;
  if (!key) return { status: "unavailable", reason: "not_configured" };

  let response: Response;
  try {
    response = await fetch(`https://api.openrouteservice.org/v2/directions/${PROFILES[mode]}/geojson`, {
      method: "POST",
      headers: {
        Authorization: key,
        "Content-Type": "application/json",
        Accept: "application/geo+json, application/json",
      },
      body: JSON.stringify({ coordinates: [from, to], radiuses: [SNAP_RADIUS_M, SNAP_RADIUS_M], instructions: false }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
  } catch {
    return { status: "unavailable", reason: "provider_error" };
  }

  const body = (await response.json().catch(() => null)) as OrsResponse | null;

  if (!response.ok || !body?.features?.length) {
    const code = typeof body?.error === "object" ? body.error.code : undefined;
    return { status: "unavailable", reason: reasonFor(response.status, code) };
  }

  const feature = body.features[0];
  const summary = feature.properties?.summary;
  if (feature.geometry?.type !== "LineString" || !summary) {
    return { status: "unavailable", reason: "provider_error" };
  }

  return {
    status: "ok",
    coordinates: feature.geometry.coordinates,
    // A zero-length summary is omitted by ORS when both points snap to the same spot.
    distanceMeters: summary.distance ?? 0,
    durationSeconds: summary.duration ?? 0,
    attribution: "© openrouteservice.org by HeiGIT, © OpenStreetMap contributors",
  };
}

interface OrsResponse {
  features?: {
    geometry?: { type: string; coordinates: [number, number][] };
    properties?: { summary?: { distance?: number; duration?: number } };
  }[];
  error?: { code?: number; message?: string } | string;
}

/** Maps openrouteservice error codes (docs: api-reference/error-codes) to what the UI explains. */
function reasonFor(status: number, code: number | undefined): RouteUnavailableReason {
  if (status === 429 || status === 403) return "quota";
  switch (code) {
    case 2009:
    case 2016:
      return "no_route";
    case 2010:
    case 2013:
    case 2014:
    case 2015:
      return "no_road_nearby";
    case 2004:
    case 2017:
      return "too_far";
  }
  if (status === 413) return "too_far";
  if (status === 404) return "no_route";
  return "provider_error";
}
