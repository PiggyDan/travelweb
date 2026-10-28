import type { RouteStopData } from "./route-url";

/** The "Try an example" route: city-centre coordinates of each city. */
export const EXAMPLE_ROUTE: RouteStopData[] = [
  { name: "Ulaanbaatar", lat: 47.91847, lon: 106.9177, kind: "city", countryCode: "MN" },
  { name: "Seoul", lat: 37.56668, lon: 126.97829, kind: "city", countryCode: "KR" },
  { name: "Tokyo", lat: 35.68125, lon: 139.76671, kind: "city", countryCode: "JP" },
  { name: "Osaka", lat: 34.69374, lon: 135.50218, kind: "city", countryCode: "JP" },
  { name: "Bangkok", lat: 13.75633, lon: 100.50177, kind: "city", countryCode: "TH" },
  { name: "Singapore", lat: 1.29028, lon: 103.85196, kind: "city", countryCode: "SG" },
];
