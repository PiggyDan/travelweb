import type { RouteStopData } from "@/lib/explorer/route-url";
import type { GeoRouteResponse, TravelMode } from "@/types/explorer";

/** A stop in the planner. `uid` survives reordering; coordinates may repeat. */
export interface Stop extends RouteStopData {
  uid: string;
  context: string | null;
}

export type LegState =
  | { status: "loading" }
  | { status: "flight"; coordinates: [number, number][]; distanceMeters: number }
  | GeoRouteResponse;

export interface Leg {
  /** Identifies the pair of stops, e.g. "a1>b2"; used to remember the chosen mode. */
  pair: string;
  /** Mode + rounded coordinates; identical legs share one routing result. */
  key: string;
  from: Stop;
  to: Stop;
  mode: TravelMode;
  state: LegState;
}
