import type { Season } from "@/types/common";
import type { DurationBucket, TourFilters, TourSummary, TourType } from "@/types/tour";
import { firstParam } from "./utils";

const TOUR_TYPES: readonly TourType[] = ["private", "group", "custom"];
const DURATIONS: readonly DurationBucket[] = ["short", "medium", "long"];
const SEASONS: readonly Season[] = ["spring", "summer", "autumn", "winter"];

function pick<T extends string>(allowed: readonly T[], value: string | undefined): T | undefined {
  return allowed.find((candidate) => candidate === value);
}

export function durationBucket(days: number): DurationBucket {
  if (days <= 7) return "short";
  if (days <= 12) return "medium";
  return "long";
}

type SearchParams = Record<string, string | string[] | undefined>;

/** Turn untrusted URL search params into validated filters. */
export function parseTourFilters(params: SearchParams): TourFilters {
  const query = firstParam(params.q)?.trim().slice(0, 80);
  return {
    destination: firstParam(params.destination)?.slice(0, 60) || undefined,
    duration: pick(DURATIONS, firstParam(params.duration)),
    type: pick(TOUR_TYPES, firstParam(params.type)),
    season: pick(SEASONS, firstParam(params.season)),
    query: query || undefined,
  };
}

/** Serialize filters back into a query string (without the leading "?"). */
export function serializeTourFilters(filters: TourFilters): string {
  const params = new URLSearchParams();
  if (filters.query) params.set("q", filters.query);
  if (filters.type) params.set("type", filters.type);
  if (filters.destination) params.set("destination", filters.destination);
  if (filters.duration) params.set("duration", filters.duration);
  if (filters.season) params.set("season", filters.season);
  return params.toString();
}

export function hasActiveFilters(filters: TourFilters): boolean {
  return Object.values(filters).some(Boolean);
}

export function matchesTourFilters(tour: TourSummary, filters: TourFilters): boolean {
  if (filters.type && tour.type !== filters.type) return false;
  if (filters.destination && !tour.destinationSlugs.includes(filters.destination)) return false;
  if (filters.duration && durationBucket(tour.durationDays) !== filters.duration) return false;
  if (filters.season && !tour.seasons.includes(filters.season)) return false;
  if (filters.query) {
    const haystack = `${tour.title} ${tour.regionLabel} ${tour.summary}`.toLowerCase();
    const terms = filters.query.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.every((term) => haystack.includes(term))) return false;
  }
  return true;
}
