import type { TourType } from "./tour";

/**
 * Payloads the frontend POSTs to the backend. Trip plans are live (see
 * backend/app/schemas.py); inquiries and the newsletter are not wired yet.
 *
 * Booking, Payment and Customer models are intentionally not defined yet:
 * they belong to the backend contract and will be written against the
 * FastAPI OpenAPI schema when those flows are built.
 */

export interface InquiryPayload {
  fullName: string;
  email: string;
  country?: string;
  travelers: number;
  /** YYYY-MM */
  travelMonth?: string;
  tourSlug?: string;
  departureId?: string;
  message: string;
  consent: boolean;
}

export type ActivityPreference = "relaxed" | "balanced" | "active" | "expedition";

export type AccommodationStyle = "comfort" | "authentic" | "mixed" | "camping";

export type BudgetRange = "under-2000" | "2000-3500" | "3500-5000" | "5000-plus";

export interface TripPlannerContact {
  fullName: string;
  email: string;
  /** Phone or WhatsApp number. */
  phone?: string;
  country?: string;
  /** Anything else the traveller wants the planner to know. */
  message?: string;
}

export interface TripPlannerRequest extends TripPlannerContact {
  startDate?: string;
  endDate?: string;
  days: number;
  adults: number;
  children: number;
  interests: string[];
  destinations: string[];
  activityLevel: ActivityPreference;
  accommodationStyle: AccommodationStyle;
  budget: BudgetRange;
  tourType?: TourType;
}

export type SubmissionResult =
  | { status: "accepted"; reference: string }
  | { status: "unavailable"; message: string };

/** Problems with specific fields, reported back by the API. */
export type FieldErrors = Partial<Record<string, string>>;

export type TripPlanResult =
  | { status: "accepted"; reference: string; conversationId: number }
  | { status: "invalid"; message: string; fieldErrors: FieldErrors }
  | { status: "unavailable"; message: string };
