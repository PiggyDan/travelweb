/**
 * Geometry helpers for the world explorer. Pure functions with no imports at
 * runtime, so they run in the browser, in route handlers and under `node --test`.
 */

import type { TravelMode } from "@/types/explorer";

export interface LatLon {
  lat: number;
  lon: number;
}

const EARTH_RADIUS_M = 6_371_008.8;
const toRad = (deg: number) => (deg * Math.PI) / 180;
const toDeg = (rad: number) => (rad * 180) / Math.PI;

/** Great-circle ("as the crow flies") distance in metres. */
export function haversineMeters(a: LatLon, b: LatLon): number {
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

/**
 * Points along the great circle from `a` to `b` as [lon, lat] pairs.
 *
 * Longitudes are unwrapped (they may run past ±180) so a line across the
 * Pacific is drawn as one continuous arc instead of jumping across the map.
 */
export function greatCircle(a: LatLon, b: LatLon, segments = 96): [number, number][] {
  const lat1 = toRad(a.lat);
  const lon1 = toRad(a.lon);
  const lat2 = toRad(b.lat);
  const lon2 = toRad(b.lon);
  const d = haversineMeters(a, b) / EARTH_RADIUS_M;

  if (d < 1e-9) return [[a.lon, a.lat], [b.lon, b.lat]];

  const points: [number, number][] = [];
  for (let i = 0; i <= segments; i++) {
    const f = i / segments;
    const A = Math.sin((1 - f) * d) / Math.sin(d);
    const B = Math.sin(f * d) / Math.sin(d);
    const x = A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2);
    const y = A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2);
    const z = A * Math.sin(lat1) + B * Math.sin(lat2);
    points.push([toDeg(Math.atan2(y, x)), toDeg(Math.atan2(z, Math.sqrt(x * x + y * y)))]);
  }
  return unwrapLongitudes(points);
}

/** Shift each longitude by ±360 so consecutive points never jump more than 180°. */
export function unwrapLongitudes(points: [number, number][]): [number, number][] {
  const out: [number, number][] = [];
  for (const [lon, lat] of points) {
    const prev = out.at(-1);
    if (!prev) {
      out.push([lon, lat]);
      continue;
    }
    let next = lon;
    while (next - prev[0] > 180) next -= 360;
    while (next - prev[0] < -180) next += 360;
    out.push([next, lat]);
  }
  return out;
}

/** [west, south, east, north] around the given [lon, lat] points, or null for none. */
export function boundsOf(points: [number, number][]): [number, number, number, number] | null {
  if (points.length === 0) return null;
  let west = Infinity;
  let south = Infinity;
  let east = -Infinity;
  let north = -Infinity;
  for (const [lon, lat] of points) {
    west = Math.min(west, lon);
    east = Math.max(east, lon);
    south = Math.min(south, lat);
    north = Math.max(north, lat);
  }
  return [west, south, east, north];
}

/**
 * The mode a new leg starts with. Long hops default to an illustrative
 * flight line; the traveller can switch any leg to a road mode.
 */
export const FLIGHT_DEFAULT_THRESHOLD_M = 800_000;

export function defaultModeFor(a: LatLon, b: LatLon): TravelMode {
  return haversineMeters(a, b) > FLIGHT_DEFAULT_THRESHOLD_M ? "flight" : "driving";
}

export function isValidLatLon(lat: number, lon: number): boolean {
  return Number.isFinite(lat) && Number.isFinite(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180;
}

/** Round to ~1 m so equal points produce equal cache keys and URLs. */
export function roundCoord(value: number): number {
  return Math.round(value * 1e5) / 1e5;
}
