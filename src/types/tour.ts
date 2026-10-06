import type { FaqItem, ImageAsset, Money, Season } from "./common";

export type TourType = "private" | "group" | "custom";

export type ActivityLevel = "easy" | "moderate" | "active" | "challenging";

export type Meal = "breakfast" | "lunch" | "dinner";

export type AccommodationKind = "guest-house" | "hotel" | "ger-camp" | "nomad-family" | "tent";

export type DepartureStatus = "available" | "limited" | "full" | "on-request";

/** Tours are grouped into duration buckets for filtering. */
export type DurationBucket = "short" | "medium" | "long";

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  /** Where the night is spent, e.g. "Ger camp near Khongoryn Els". */
  overnight: string;
  meals: Meal[];
  /** Approximate driving or riding distance, if meaningful. */
  distanceKm?: number;
}

export interface Accommodation {
  kind: AccommodationKind;
  name: string;
  nights: number;
  description: string;
}

/** A scheduled departure of a tour. Maps to the future `tour_dates` table. */
export interface TourDate {
  id: string;
  /** ISO date, YYYY-MM-DD. */
  startDate: string;
  /** ISO date, YYYY-MM-DD. */
  endDate: string;
  price: Money;
  status: DepartureStatus;
  seatsLeft?: number;
}

export interface GroupSize {
  min: number;
  max: number;
}

export interface Tour {
  id: string;
  slug: string;
  title: string;
  /** One-line hook shown in the hero. */
  tagline: string;
  /** Short description for cards and meta descriptions. */
  summary: string;
  /** Long-form overview paragraphs. */
  overview: string[];
  type: TourType;
  /** Human-readable region label, e.g. "Gobi Desert & Central Mongolia". */
  regionLabel: string;
  destinationSlugs: string[];
  durationDays: number;
  priceFrom: Money;
  activityLevel: ActivityLevel;
  seasons: Season[];
  groupSize: GroupSize;
  heroImage: ImageAsset;
  gallery: ImageAsset[];
  highlights: string[];
  itinerary: ItineraryDay[];
  accommodations: Accommodation[];
  included: string[];
  excluded: string[];
  departures: TourDate[];
  faqs: FaqItem[];
  featured: boolean;
}

/** The lightweight shape returned by list endpoints and used by cards. */
export type TourSummary = Pick<
  Tour,
  | "id"
  | "slug"
  | "title"
  | "summary"
  | "type"
  | "regionLabel"
  | "destinationSlugs"
  | "durationDays"
  | "priceFrom"
  | "activityLevel"
  | "seasons"
  | "heroImage"
>;

export interface TourFilters {
  destination?: string;
  duration?: DurationBucket;
  type?: TourType;
  season?: Season;
  /** Free-text search across title, region and summary. */
  query?: string;
}
