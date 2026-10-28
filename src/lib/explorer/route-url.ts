/**
 * Encodes a planned route in the URL so it can be shared or bookmarked
 * without an account: `?stops=Seoul~37.56650~126.97800~city~KR|Tokyo~…&modes=f`.
 *
 * Decoding treats the query as untrusted input: anything malformed is dropped.
 */

import type { PlaceKind, TravelMode } from "@/types/explorer";
import { defaultModeFor, isValidLatLon, roundCoord } from "./geo";

export const MAX_STOPS = 25;
const MAX_NAME_LENGTH = 80;

export interface RouteStopData {
  name: string;
  lat: number;
  lon: number;
  kind: PlaceKind;
  countryCode: string | null;
}

export interface RouteData {
  stops: RouteStopData[];
  /** modes[i] is the mode from stops[i] to stops[i + 1]. */
  modes: TravelMode[];
}

const MODE_CODES: Record<TravelMode, string> = { driving: "d", walking: "w", cycling: "c", flight: "f" };
const CODE_MODES = Object.fromEntries(Object.entries(MODE_CODES).map(([mode, code]) => [code, mode])) as Record<
  string,
  TravelMode
>;
const KINDS: readonly PlaceKind[] = ["country", "region", "city", "place"];

const cleanName = (name: string) => name.replace(/[~|\p{Cc}]/gu, " ").trim().slice(0, MAX_NAME_LENGTH);

export function encodeRoute({ stops, modes }: RouteData): URLSearchParams {
  const params = new URLSearchParams();
  if (stops.length === 0) return params;
  params.set(
    "stops",
    stops
      .slice(0, MAX_STOPS)
      .map((s) =>
        [cleanName(s.name), roundCoord(s.lat).toFixed(5), roundCoord(s.lon).toFixed(5), s.kind, s.countryCode ?? ""].join(
          "~",
        ),
      )
      .join("|"),
  );
  const legModes = modes.slice(0, Math.max(0, stops.length - 1));
  if (legModes.length > 0) params.set("modes", legModes.map((m) => MODE_CODES[m]).join(""));
  return params;
}

export function decodeRoute(params: URLSearchParams): RouteData {
  const stops: RouteStopData[] = [];
  for (const chunk of (params.get("stops") ?? "").split("|").slice(0, MAX_STOPS)) {
    const [rawName = "", rawLat, rawLon, rawKind, rawCountry] = chunk.split("~");
    const name = cleanName(rawName);
    const lat = Number(rawLat);
    const lon = Number(rawLon);
    if (!name || !isValidLatLon(lat, lon)) continue;
    stops.push({
      name,
      lat: roundCoord(lat),
      lon: roundCoord(lon),
      kind: KINDS.includes(rawKind as PlaceKind) ? (rawKind as PlaceKind) : "place",
      countryCode: rawCountry && /^[A-Z]{2}$/.test(rawCountry) ? rawCountry : null,
    });
  }

  const codes = [...(params.get("modes") ?? "")];
  const modes = stops.slice(1).map((stop, i) => CODE_MODES[codes[i] ?? ""] ?? defaultModeFor(stops[i], stop));
  return { stops, modes };
}
