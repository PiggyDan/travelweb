import type { Season } from "@/types/common";
import type {
  AccommodationKind,
  ActivityLevel,
  DepartureStatus,
  DurationBucket,
  Meal,
  TourType,
} from "@/types/tour";

/**
 * Display labels for domain enums. When translations arrive these move into
 * per-locale dictionaries; until then they live in one place.
 */

export const TOUR_TYPE_LABELS: Record<TourType, string> = {
  private: "Private",
  group: "Small Group",
  custom: "Custom",
};

export const TOUR_TYPE_DESCRIPTIONS: Record<TourType, string> = {
  private: "Your own guide, driver and pace.",
  group: "Fixed departures, never more than twelve travellers.",
  custom: "A starting point we reshape around you.",
};

export const SEASON_LABELS: Record<Season, string> = {
  spring: "Spring",
  summer: "Summer",
  autumn: "Autumn",
  winter: "Winter",
};

export const ACTIVITY_LEVEL_LABELS: Record<ActivityLevel, string> = {
  easy: "Easy",
  moderate: "Moderate",
  active: "Active",
  challenging: "Challenging",
};

export const DURATION_LABELS: Record<DurationBucket, string> = {
  short: "Up to 7 days",
  medium: "8 – 12 days",
  long: "13 days or more",
};

export const ACCOMMODATION_LABELS: Record<AccommodationKind, string> = {
  "guest-house": "Guest house",
  hotel: "Hotel",
  "ger-camp": "Ger camp",
  "nomad-family": "Nomad family ger",
  tent: "Expedition tent",
};

export const MEAL_LABELS: Record<Meal, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
};

export const DEPARTURE_STATUS_LABELS: Record<DepartureStatus, string> = {
  available: "Available",
  limited: "Few places left",
  full: "Fully booked",
  "on-request": "On request",
};
