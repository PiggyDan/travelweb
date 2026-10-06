import type { Metadata } from "next";
import { LocaleLink } from "@/components/shared/locale-link";
import { PageHero } from "@/components/shared/page-hero";
import { TourFilters } from "@/components/tours/tour-filters";
import { TourGrid } from "@/components/tours/tour-grid";
import { TourTypeNav } from "@/components/tours/tour-type-nav";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { TOUR_TYPE_DESCRIPTIONS } from "@/lib/labels";
import { resolveLocale } from "@/lib/locale-params";
import { buildPageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";
import { parseTourFilters } from "@/lib/tour-filters";
import { getPageImages } from "@/services/content-service";
import { getTourFilterOptions, getTours } from "@/services/tour-service";

export async function generateMetadata({ params }: PageProps<"/[locale]/tours">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return buildPageMetadata({
    locale,
    path: routes.tours,
    title: "Mongolia Tours",
    description:
      "Small-group departures, private journeys and custom itineraries across the Gobi, Altai, Khuvsgul and central Mongolia. Filter by destination, length and season.",
  });
}

export default async function ToursPage({ params, searchParams }: PageProps<"/[locale]/tours">) {
  await resolveLocale(params);
  const filters = parseTourFilters(await searchParams);
  const [tours, options, images] = await Promise.all([
    getTours(filters),
    getTourFilterOptions(),
    getPageImages(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Tours"
        title="Journeys across Mongolia"
        description="Every itinerary is a starting point. Join a small group, travel privately, or let us build something entirely your own."
        image={images.toursHero}
      />

      <section aria-labelledby="tour-results-title" className="py-16 sm:py-24">
        <Container>
          <h2 id="tour-results-title" className="sr-only">
            Available tours
          </h2>
          <TourTypeNav filters={filters} />
          {filters.type && (
            <p className="mt-5 text-charcoal-600">{TOUR_TYPE_DESCRIPTIONS[filters.type]}</p>
          )}

          <div className="mt-8">
            <TourFilters filters={filters} options={options} />
          </div>

          <div className="mt-10 mb-8 flex flex-wrap items-baseline justify-between gap-4" aria-live="polite">
            <p className="text-sm text-charcoal-600">
              <span className="font-semibold text-sky-950">{tours.length}</span>{" "}
              {tours.length === 1 ? "journey" : "journeys"}
              {filters.query && (
                <>
                  {" "}
                  matching <span className="font-semibold text-sky-950">“{filters.query}”</span>
                </>
              )}
            </p>
            {filters.query && (
              <LocaleLink href={routes.tours} className="text-sm font-semibold text-copper-600 underline-offset-4 hover:underline">
                Clear search
              </LocaleLink>
            )}
          </div>

          {tours.length > 0 ? (
            <TourGrid tours={tours} />
          ) : (
            <EmptyState
              title="No journeys match — yet"
              description="Try widening your filters, or tell us what you have in mind and we'll design it for you."
              action={
                <div className="flex flex-col gap-3 sm:flex-row">
                  <ButtonLink href={routes.tours} variant="outline-dark">
                    Show all tours
                  </ButtonLink>
                  <ButtonLink href={routes.tripPlanner} variant="dark">
                    Design my journey
                  </ButtonLink>
                </div>
              }
            />
          )}
        </Container>
      </section>
    </>
  );
}
