import { CalendarDays, Clock, Sparkle } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CtaBanner } from "@/components/shared/cta-banner";
import { JsonLd } from "@/components/shared/json-ld";
import { PageHero } from "@/components/shared/page-hero";
import { TourGrid } from "@/components/tours/tour-grid";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { SEASON_LABELS } from "@/lib/labels";
import { localeStaticParams, resolveLocale } from "@/lib/locale-params";
import { buildPageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { getDestinationBySlug, getDestinationSlugs } from "@/services/destination-service";
import { getToursByDestination } from "@/services/tour-service";

export async function generateStaticParams() {
  const slugs = await getDestinationSlugs();
  return localeStaticParams().flatMap(({ locale }) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/destinations/[slug]">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);
  if (!destination) return {};
  return buildPageMetadata({
    locale,
    path: routes.destination(destination.slug),
    title: `${destination.name}, Mongolia`,
    description: destination.summary,
    image: destination.image,
  });
}

export default async function DestinationDetailPage({ params }: PageProps<"/[locale]/destinations/[slug]">) {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);
  if (!destination) notFound();

  const tours = await getToursByDestination(destination.slug);
  const breadcrumbs = [
    { name: "Home", path: routes.home },
    { name: "Destinations", path: routes.destinations },
    { name: destination.name, path: routes.destination(destination.slug) },
  ];
  const facts = [
    { label: "Best months", value: destination.bestMonths, Icon: CalendarDays },
    { label: "Ideal stay", value: destination.idealDuration, Icon: Clock },
    { label: "Seasons", value: destination.bestSeasons.map((s) => SEASON_LABELS[s]).join(" · "), Icon: Sparkle },
  ];

  return (
    <>
      <PageHero
        size="large"
        image={destination.image}
        top={<Breadcrumbs items={breadcrumbs} />}
        eyebrow={destination.region}
        title={destination.name}
        description={destination.tagline}
      />

      <section aria-labelledby="destination-overview" className="py-20 sm:py-28">
        <Container className="grid gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <h2 id="destination-overview" className="eyebrow text-copper-600">
              About {destination.name}
            </h2>
            <div className="prose-editorial mt-6 font-display text-2xl leading-snug font-light text-sky-950 sm:text-[1.75rem]">
              <p>{destination.summary}</p>
            </div>
            <div className="prose-editorial mt-8 text-lg leading-relaxed text-charcoal-700">
              {destination.description.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9">
            <dl className="space-y-6 rounded-[1.5rem] bg-sand-100 p-8">
              {facts.map(({ label, value, Icon }) => (
                <div key={label}>
                  <dt className="flex items-center gap-2 text-[0.6875rem] font-semibold tracking-[0.18em] text-charcoal-500 uppercase">
                    <Icon aria-hidden className="size-3.5 text-copper-600" />
                    {label}
                  </dt>
                  <dd className="mt-1.5 font-display text-xl text-sky-950">{value}</dd>
                </div>
              ))}
            </dl>
            <h3 className="mt-10 font-display text-xl text-sky-950">Highlights</h3>
            <ul className="mt-4 space-y-3">
              {destination.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-3 text-charcoal-700">
                  <Sparkle aria-hidden className="mt-1 size-4 shrink-0 text-copper-500" strokeWidth={1.5} />
                  {highlight}
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>

      {destination.gallery.length > 1 && (
        <section aria-label={`${destination.name} photographs`} className="pb-20 sm:pb-28">
          <Container>
            <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {destination.gallery.map((image, index) => (
                <li
                  key={image.src}
                  className={`relative overflow-hidden rounded-[1.25rem] ${index === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"}`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes={index === 0 ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
                    className="object-cover"
                  />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <section aria-labelledby="destination-tours" className="bg-sand-50 py-20 sm:py-28">
        <Container>
          <SectionHeading
            id="destination-tours"
            eyebrow="Journeys"
            title={`Tours visiting ${destination.name}`}
            className="mb-12"
          />
          {tours.length > 0 ? (
            <TourGrid tours={tours} />
          ) : (
            <EmptyState
              title="A journey waiting to be written"
              description={`We don't have a scheduled tour to ${destination.name} yet, but we design private journeys here regularly.`}
              action={
                <ButtonLink href={routes.tripPlanner} variant="dark">
                  Design my journey
                </ButtonLink>
              }
            />
          )}
        </Container>
      </section>

      <CtaBanner
        title={
          <>
            {destination.name}, <span className="italic">your way.</span>
          </>
        }
        description="Every journey can be adapted. Tell us what you would like to see and how you like to travel."
        image={destination.gallery[0] ?? destination.image}
        primary={{ label: "Plan my journey", href: routes.tripPlanner }}
        secondary={{ label: "All destinations", href: routes.destinations }}
      />

      <JsonLd data={breadcrumbJsonLd(locale, breadcrumbs)} />
    </>
  );
}
