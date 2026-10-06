import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CtaBanner } from "@/components/shared/cta-banner";
import { FaqList } from "@/components/shared/faq-list";
import { JsonLd } from "@/components/shared/json-ld";
import { PageHero } from "@/components/shared/page-hero";
import { BookingPanel } from "@/components/tours/detail/booking-panel";
import { MobileBookingBar } from "@/components/tours/detail/mobile-booking-bar";
import { TourAccommodation } from "@/components/tours/detail/tour-accommodation";
import { TourDepartures } from "@/components/tours/detail/tour-departures";
import { TourFacts } from "@/components/tours/detail/tour-facts";
import { TourGallery } from "@/components/tours/detail/tour-gallery";
import { TourInclusions } from "@/components/tours/detail/tour-inclusions";
import { TourItinerary } from "@/components/tours/detail/tour-itinerary";
import { TourOverview } from "@/components/tours/detail/tour-overview";
import { TourSection } from "@/components/tours/detail/tour-section";
import { TourGrid } from "@/components/tours/tour-grid";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { TOUR_TYPE_LABELS } from "@/lib/labels";
import { localeStaticParams, resolveLocale } from "@/lib/locale-params";
import { buildPageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";
import { breadcrumbJsonLd, faqJsonLd, tourJsonLd } from "@/lib/structured-data";
import { getRelatedTours, getTourBySlug, getTourSlugs } from "@/services/tour-service";

export async function generateStaticParams() {
  const slugs = await getTourSlugs();
  return localeStaticParams().flatMap(({ locale }) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/tours/[slug]">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  const tour = await getTourBySlug(slug);
  if (!tour) return {};
  return buildPageMetadata({
    locale,
    path: routes.tour(tour.slug),
    title: tour.title,
    description: tour.summary,
    image: tour.heroImage,
  });
}

export default async function TourDetailPage({ params }: PageProps<"/[locale]/tours/[slug]">) {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  const tour = await getTourBySlug(slug);
  if (!tour) notFound();

  const related = await getRelatedTours(tour, 3);
  const breadcrumbs = [
    { name: "Home", path: routes.home },
    { name: "Tours", path: routes.tours },
    { name: tour.title, path: routes.tour(tour.slug) },
  ];

  return (
    <>
      <PageHero
        size="large"
        image={tour.heroImage}
        top={<Breadcrumbs items={breadcrumbs} />}
        eyebrow={tour.regionLabel}
        title={tour.title}
        description={tour.summary}
      >
        <div className="mb-8">
          <Badge tone="glass">{TOUR_TYPE_LABELS[tour.type]} journey</Badge>
        </div>
        <TourFacts tour={tour} />
      </PageHero>

      <Container className="pt-16 sm:pt-24">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 xl:gap-16">
          <div className="lg:col-span-8">
            <TourOverview tour={tour} />
            <TourItinerary days={tour.itinerary} />
            <TourAccommodation accommodations={tour.accommodations} />
            <TourInclusions included={tour.included} excluded={tour.excluded} />
            <TourGallery images={tour.gallery} />
            <TourDepartures tourSlug={tour.slug} tourType={tour.type} departures={tour.departures} />
            {tour.faqs.length > 0 && (
              <TourSection id="faq" eyebrow="Questions" title="Good to know">
                <FaqList items={tour.faqs} />
              </TourSection>
            )}
            <MobileBookingBar tour={tour} />
          </div>

          <div className="hidden lg:col-span-4 lg:block">
            <div className="sticky top-28">
              <BookingPanel tour={tour} />
            </div>
          </div>
        </div>
      </Container>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="bg-sand-50 py-20 sm:py-28">
          <Container>
            <SectionHeading id="related-title" eyebrow="Keep exploring" title="You may also love" className="mb-12" />
            <TourGrid tours={related} />
          </Container>
        </section>
      )}

      <CtaBanner
        eyebrow="Ready when you are"
        title={
          <>
            Make this journey <span className="italic">yours.</span>
          </>
        }
        description="Tell us your dates and how you like to travel. A Mongolia-based planner will reply personally."
        image={tour.gallery[0] ?? tour.heroImage}
        primary={{ label: "Request this journey", href: routes.tourInquiry(tour.slug) }}
        secondary={{ label: "Design a custom version", href: routes.tripPlanner }}
      />

      <JsonLd data={tourJsonLd(tour, locale)} />
      <JsonLd data={breadcrumbJsonLd(locale, breadcrumbs)} />
      {tour.faqs.length > 0 && <JsonLd data={faqJsonLd(tour.faqs)} />}
    </>
  );
}
