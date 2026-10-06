import { DEFAULT_LOCALE, localizePath } from "@/lib/i18n";
import { ACCOMMODATION_LABELS, ACTIVITY_LEVEL_LABELS, SEASON_LABELS, TOUR_TYPE_LABELS } from "@/lib/labels";
import { routes } from "@/lib/routes";
import { formatPrice } from "@/lib/utils";
import { getTourBySlug, getTourSlugs } from "@/services/tour-service";

/**
 * Machine-readable tour catalog for the chat assistant (backend/app/assistant.py).
 * It is the same data the tour pages render, so the assistant never quotes
 * a trip, price or departure the website doesn't show.
 */
export async function GET() {
  const slugs = await getTourSlugs();
  const tours = (await Promise.all(slugs.map(getTourBySlug))).filter((tour) => tour !== null);

  const catalog = tours.map((tour) => ({
    slug: tour.slug,
    title: tour.title,
    tagline: tour.tagline,
    summary: tour.summary,
    type: TOUR_TYPE_LABELS[tour.type],
    region: tour.regionLabel,
    durationDays: tour.durationDays,
    priceFrom: formatPrice(tour.priceFrom),
    priceFromAmount: tour.priceFrom.amount,
    activityLevel: ACTIVITY_LEVEL_LABELS[tour.activityLevel],
    seasons: tour.seasons.map((season) => SEASON_LABELS[season]),
    groupSize: `${tour.groupSize.min}–${tour.groupSize.max} travellers`,
    highlights: tour.highlights,
    itinerary: tour.itinerary.map((day) => `Day ${day.day}: ${day.title} (overnight: ${day.overnight})`),
    accommodation: tour.accommodations.map(
      (stay) => `${stay.nights} night${stay.nights === 1 ? "" : "s"} ${ACCOMMODATION_LABELS[stay.kind]}: ${stay.name}`,
    ),
    included: tour.included,
    excluded: tour.excluded,
    departures: tour.departures.map((departure) => ({
      start: departure.startDate,
      end: departure.endDate,
      price: formatPrice(departure.price),
      status: departure.status,
      seatsLeft: departure.seatsLeft ?? null,
    })),
    url: localizePath(DEFAULT_LOCALE, routes.tour(tour.slug)),
    image: tour.heroImage.src,
  }));

  return Response.json({ tours: catalog });
}
