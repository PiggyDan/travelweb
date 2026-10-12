import type { TourType } from "@/types/tour";

/**
 * Unlocalized route paths. Render them with `<LocaleLink>` (or pass them
 * through `localizePath`) so the active locale is prefixed automatically.
 */
export const routes = {
  home: "/",
  destinations: "/destinations",
  destination: (slug: string) => `/destinations/${slug}`,
  tours: "/tours",
  toursByType: (type: TourType) => `/tours?type=${type}`,
  tour: (slug: string) => `/tours/${slug}`,
  experiences: "/experiences",
  hunting: "/hunting-shooting",
  guestHouse: "/guest-house",
  festivals: "/festivals",
  gallery: "/gallery",
  journal: "/journal",
  journalPost: (slug: string) => `/journal/${slug}`,
  travelInformation: "/travel-information",
  about: "/about",
  contact: "/contact",
  tourInquiry: (slug: string, departureId?: string) =>
    `/contact?tour=${slug}${departureId ? `&departure=${departureId}` : ""}`,
  faq: "/faq",
  tripPlanner: "/trip-planner",
  bookingTerms: "/booking-terms",
  privacy: "/privacy",
} as const;

/** Static pages included in the sitemap. Dynamic entries are added from services. */
export const staticSitemapPaths: readonly string[] = [
  routes.home,
  routes.destinations,
  routes.tours,
  routes.experiences,
  routes.hunting,
  routes.guestHouse,
  routes.festivals,
  routes.gallery,
  routes.journal,
  routes.travelInformation,
  routes.about,
  routes.contact,
  routes.faq,
  routes.tripPlanner,
  routes.bookingTerms,
  routes.privacy,
];
