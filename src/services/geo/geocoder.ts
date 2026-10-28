import "server-only";
import type { GeoSearchResponse, Place, PlaceKind } from "@/types/explorer";

/**
 * Place search for the world explorer, behind `GET /api/geo/search`.
 *
 * Providers (set GEOCODER_PROVIDER):
 * - "photon" (default): Photon, OpenStreetMap data, no API key. The public
 *   instance at photon.komoot.io is free under a fair-use policy with no
 *   published quota or SLA; heavy use is throttled. Set PHOTON_URL to use a
 *   self-hosted instance instead.
 * - "ors": openrouteservice geocoding (Pelias). Needs ORS_API_KEY; the free
 *   Standard plan allows 1,000 autocomplete requests/day and 100/minute.
 *
 * Responses are cached at the CDN by the route handler, so a popular query
 * reaches the provider about once a day.
 */

const TIMEOUT_MS = 8_000;
const USER_AGENT = "TravelWeb-WorldExplorer/1.0 (+https://travelweb-neon.vercel.app)";

export class GeocoderError extends Error {}

export async function searchPlaces(query: string, lang: string, limit = 8): Promise<GeoSearchResponse> {
  const provider = process.env.GEOCODER_PROVIDER === "ors" && process.env.ORS_API_KEY ? "ors" : "photon";
  const results = provider === "ors" ? await searchOrs(query, lang, limit) : await searchPhoton(query, lang, limit);
  return {
    results: dedupe(results).slice(0, limit),
    attribution: provider === "ors" ? "© openrouteservice.org, © OpenStreetMap contributors" : "Photon, © OpenStreetMap contributors",
  };
}

// --- Photon ---------------------------------------------------------------

interface PhotonFeature {
  geometry: { coordinates: [number, number] };
  properties: {
    osm_type?: string;
    osm_id?: number;
    osm_key?: string;
    osm_value?: string;
    type?: string;
    name?: string;
    city?: string;
    state?: string;
    country?: string;
    countrycode?: string;
    /** [minLon, maxLat, maxLon, minLat] */
    extent?: [number, number, number, number];
  };
}

/** Photon only localizes into a few languages; others get local names ("default"). */
const PHOTON_LANGS = new Set(["en", "de", "fr"]);

async function searchPhoton(query: string, lang: string, limit: number): Promise<Place[]> {
  const url = new URL("/api/", process.env.PHOTON_URL || "https://photon.komoot.io");
  url.searchParams.set("q", query);
  url.searchParams.set("limit", String(limit + 4));
  url.searchParams.set("lang", PHOTON_LANGS.has(lang) ? lang : "default");

  const response = await fetch(url, {
    headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
    signal: AbortSignal.timeout(TIMEOUT_MS),
    next: { revalidate: 86_400 },
  });
  if (!response.ok) throw new GeocoderError(`Photon responded ${response.status}`);
  const data = (await response.json()) as { features?: PhotonFeature[] };

  return (data.features ?? []).flatMap((feature): Place[] => {
    const p = feature.properties;
    const [lon, lat] = feature.geometry.coordinates;
    if (!p.name) return [];
    const kind = photonKind(p);
    const context = [p.city !== p.name ? p.city : null, p.state !== p.name ? p.state : null, kind === "country" ? null : p.country]
      .filter(Boolean)
      .join(", ");
    return [
      {
        id: `photon:${p.osm_type ?? "X"}${p.osm_id ?? `${lat},${lon}`}`,
        name: p.name,
        context: context || null,
        lat,
        lon,
        kind,
        countryCode: p.countrycode?.length === 2 ? p.countrycode.toUpperCase() : null,
        bbox: p.extent ? [p.extent[0], p.extent[3], p.extent[2], p.extent[1]] : null,
      },
    ];
  });
}

function photonKind(p: PhotonFeature["properties"]): PlaceKind {
  if (p.type === "country") return "country";
  // Photon's `type` wins: Tokyo is an OSM province but `type: "city"`, which is how travellers think of it.
  if (p.type === "city") return "city";
  // "district"/"locality" also cover land-use areas such as industrial estates; only settlements count.
  if ((p.type === "district" || p.type === "locality") && (p.osm_key === "place" || p.osm_key === "boundary")) return "city";
  if (p.osm_key === "place" && ["city", "town", "village", "municipality", "hamlet"].includes(p.osm_value ?? "")) return "city";
  if (p.type === "state" || p.type === "county") return "region";
  return "place";
}

// --- openrouteservice (Pelias) --------------------------------------------

interface PeliasFeature {
  geometry: { coordinates: [number, number] };
  bbox?: [number, number, number, number];
  properties: {
    gid: string;
    layer?: string;
    name?: string;
    region?: string;
    country?: string;
    country_code?: string;
  };
}

async function searchOrs(query: string, lang: string, limit: number): Promise<Place[]> {
  const url = new URL("https://api.openrouteservice.org/geocode/autocomplete");
  url.searchParams.set("text", query);
  url.searchParams.set("size", String(limit));
  url.searchParams.set("lang", lang);

  const response = await fetch(url, {
    headers: { Authorization: process.env.ORS_API_KEY ?? "", Accept: "application/json" },
    signal: AbortSignal.timeout(TIMEOUT_MS),
    next: { revalidate: 86_400 },
  });
  if (!response.ok) throw new GeocoderError(`openrouteservice geocoder responded ${response.status}`);
  const data = (await response.json()) as { features?: PeliasFeature[] };

  return (data.features ?? []).flatMap((feature): Place[] => {
    const p = feature.properties;
    const [lon, lat] = feature.geometry.coordinates;
    if (!p.name) return [];
    const kind: PlaceKind =
      p.layer === "country"
        ? "country"
        : p.layer === "region" || p.layer === "macroregion" || p.layer === "county"
          ? "region"
          : p.layer === "locality" || p.layer === "localadmin" || p.layer === "borough"
            ? "city"
            : "place";
    const context = [p.region !== p.name ? p.region : null, kind === "country" ? null : p.country].filter(Boolean).join(", ");
    return [
      {
        id: `ors:${p.gid}`,
        name: p.name,
        context: context || null,
        lat,
        lon,
        kind,
        countryCode: p.country_code?.length === 2 ? p.country_code.toUpperCase() : null,
        bbox: feature.bbox ?? null,
      },
    ];
  });
}

/** Providers often return the same city twice (e.g. the place node and its boundary). */
function dedupe(places: Place[]): Place[] {
  const seen = new Set<string>();
  return places.filter((place) => {
    const key = `${place.name.toLowerCase()}|${place.countryCode}|${Math.round(place.lat * 4)}|${Math.round(place.lon * 4)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
