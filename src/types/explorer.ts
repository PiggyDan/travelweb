/**
 * World explorer (/explore) domain types. Shared by the map UI and the
 * `/api/geo/*` route handlers, so they are also the shape of those responses.
 */

export type TravelMode = "driving" | "walking" | "cycling" | "flight";

export type RoadMode = Exclude<TravelMode, "flight">;

export type PlaceKind = "country" | "region" | "city" | "place";

/** A searchable location: a geocoder result or one of our curated points. */
export interface Place {
  /** Stable for the same source result, e.g. "photon:R123" or "featured:gobi-desert". */
  id: string;
  name: string;
  /** Context shown under the name, e.g. "Seoul, South Korea". */
  context: string | null;
  lat: number;
  lon: number;
  kind: PlaceKind;
  /** ISO 3166-1 alpha-2, when the source provides it. */
  countryCode: string | null;
  /** [west, south, east, north], when the source provides an extent. */
  bbox: [number, number, number, number] | null;
}

export interface GeoSearchResponse {
  results: Place[];
  /** Attribution the provider requires next to its results. */
  attribution: string;
}

/** Why a road route could not be shown. The UI explains each one. */
export type RouteUnavailableReason =
  | "not_configured"
  | "no_route"
  | "no_road_nearby"
  | "too_far"
  | "quota"
  | "rate_limited"
  | "provider_error"
  | "invalid";

export type GeoRouteResponse =
  | {
      status: "ok";
      /** [lon, lat] pairs as returned by the routing engine. */
      coordinates: [number, number][];
      distanceMeters: number;
      durationSeconds: number;
      attribution: string;
    }
  | { status: "unavailable"; reason: RouteUnavailableReason };

/** Country facts loaded from /geo/countries.json (see scripts/build-world-data.mjs). */
export interface CountryInfo {
  iso2: string;
  iso3: string;
  name: string;
  official: string;
  flag: string;
  capitals: string[];
  region: string;
  subregion: string | null;
  /** Representative point from the source dataset, not the capital. */
  lat: number;
  lon: number;
  areaKm2: number | null;
  landlocked: boolean;
  independent: boolean | null;
  currencies: { code: string; name: string; symbol: string | null }[];
  languages: string[];
  callingCodes: string[];
  tld: string[];
  altNames: string[];
}

/** One of our own Mongolia destinations, pinned on the world map. */
export interface FeaturedDestination {
  slug: string;
  name: string;
  region: string;
  tagline: string;
  lat: number;
  lon: number;
  /** True when the pin marks a broad region rather than one site. */
  approximate: boolean;
  image: { src: string; alt: string };
}
