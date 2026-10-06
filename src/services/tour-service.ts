import { tours } from "@/data/tours";
import { DURATION_LABELS, SEASON_LABELS, TOUR_TYPE_LABELS } from "@/lib/labels";
import { matchesTourFilters } from "@/lib/tour-filters";
import type { SelectOption, Season } from "@/types/common";
import type { DurationBucket, Tour, TourFilters, TourSummary, TourType } from "@/types/tour";
import { getDestinations } from "./destination-service";

/**
 * Tour service — the only module that touches tour data.
 *
 * Today it reads local mock data. In Phase 2 each function becomes a call to
 * the FastAPI backend (e.g. `GET /tours?type=group&season=summer`) and keeps
 * the same signature, so pages and components do not change.
 */

function toSummary(tour: Tour): TourSummary {
  return {
    id: tour.id,
    slug: tour.slug,
    title: tour.title,
    summary: tour.summary,
    type: tour.type,
    regionLabel: tour.regionLabel,
    destinationSlugs: tour.destinationSlugs,
    durationDays: tour.durationDays,
    priceFrom: tour.priceFrom,
    activityLevel: tour.activityLevel,
    seasons: tour.seasons,
    heroImage: tour.heroImage,
  };
}

export async function getTours(filters: TourFilters = {}): Promise<TourSummary[]> {
  return tours.map(toSummary).filter((tour) => matchesTourFilters(tour, filters));
}

export async function getFeaturedTours(limit = 6): Promise<TourSummary[]> {
  return tours
    .filter((tour) => tour.featured)
    .slice(0, limit)
    .map(toSummary);
}

export async function getTourBySlug(slug: string): Promise<Tour | null> {
  return tours.find((tour) => tour.slug === slug) ?? null;
}

export async function getTourSlugs(): Promise<string[]> {
  return tours.map((tour) => tour.slug);
}

export async function getToursByDestination(destinationSlug: string): Promise<TourSummary[]> {
  return getTours({ destination: destinationSlug });
}

/** Tours sharing a destination with `tour`, falling back to other tours. */
export async function getRelatedTours(tour: Tour, limit = 3): Promise<TourSummary[]> {
  const others = tours.filter((candidate) => candidate.id !== tour.id);
  const overlapping = others.filter((candidate) =>
    candidate.destinationSlugs.some((slug) => tour.destinationSlugs.includes(slug)),
  );
  const rest = others.filter((candidate) => !overlapping.includes(candidate));
  return [...overlapping, ...rest].slice(0, limit).map(toSummary);
}

export interface TourFilterOptions {
  destinations: SelectOption[];
  durations: SelectOption<DurationBucket>[];
  types: SelectOption<TourType>[];
  seasons: SelectOption<Season>[];
}

export async function getTourFilterOptions(): Promise<TourFilterOptions> {
  const destinations = await getDestinations();
  return {
    destinations: destinations.map((d) => ({ value: d.slug, label: d.name })),
    durations: (Object.keys(DURATION_LABELS) as DurationBucket[]).map((value) => ({
      value,
      label: DURATION_LABELS[value],
    })),
    types: (Object.keys(TOUR_TYPE_LABELS) as TourType[]).map((value) => ({
      value,
      label: TOUR_TYPE_LABELS[value],
    })),
    seasons: (Object.keys(SEASON_LABELS) as Season[]).map((value) => ({
      value,
      label: SEASON_LABELS[value],
    })),
  };
}
