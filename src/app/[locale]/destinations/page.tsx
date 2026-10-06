import type { Metadata } from "next";
import { DestinationMosaic } from "@/components/destinations/destination-mosaic";
import { SeasonGuide } from "@/components/destinations/season-guide";
import { CtaBanner } from "@/components/shared/cta-banner";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { resolveLocale } from "@/lib/locale-params";
import { buildPageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";
import { getPageImages, getSeasonGuides } from "@/services/content-service";
import { getDestinations } from "@/services/destination-service";

export async function generateMetadata({ params }: PageProps<"/[locale]/destinations">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return buildPageMetadata({
    locale,
    path: routes.destinations,
    title: "Destinations in Mongolia",
    description:
      "The Gobi Desert, Altai Mountains, Lake Khuvsgul, the Orkhon Valley and more — discover Mongolia's regions and the best season to visit each.",
  });
}

export default async function DestinationsPage({ params }: PageProps<"/[locale]/destinations">) {
  await resolveLocale(params);
  const [destinations, seasons, images] = await Promise.all([getDestinations(), getSeasonGuides(), getPageImages()]);

  return (
    <>
      <PageHero
        eyebrow="Destinations"
        title="A country the size of a continent"
        description="Desert, taiga, glaciers and grassland. Each region of Mongolia has its own light, its own season and its own people."
        image={images.destinationsHero}
      />

      <section aria-labelledby="destinations-intro" className="py-20 sm:py-28">
        <Container className="grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <h2
              id="destinations-intro"
              className="font-display text-4xl leading-[1.08] font-light tracking-tight text-sky-950 sm:text-5xl"
            >
              Fewer places, <span className="italic">seen properly.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="text-lg leading-relaxed text-charcoal-700 lg:col-span-5 lg:col-start-8">
            <p>
              Mongolia is three times the size of France with a fraction of the roads. Rather than racing between
              highlights, we suggest choosing one or two regions and giving them time. Every destination below can be
              explored on its own or combined into a longer journey.
            </p>
          </Reveal>
        </Container>
      </section>

      <section aria-label="All destinations" className="pb-24 sm:pb-32">
        <Container>
          <DestinationMosaic destinations={destinations} headingLevel="h3" />
        </Container>
      </section>

      <SeasonGuide seasons={seasons} />

      <CtaBanner
        eyebrow="Not sure where to begin?"
        title={
          <>
            Let us draw <span className="italic">the map.</span>
          </>
        }
        description="Share your dates and interests, and we'll suggest the regions that suit them best."
        image={images.finalCta}
        primary={{ label: "Plan my journey", href: routes.tripPlanner }}
        secondary={{ label: "Browse tours", href: routes.tours }}
      />
    </>
  );
}
