import type { Metadata } from "next";
import { TripPlannerForm } from "@/components/forms/trip-planner-form";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/ui/container";
import { resolveLocale } from "@/lib/locale-params";
import { buildPageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";
import { getExperiences, getPageImages } from "@/services/content-service";
import { getDestinations } from "@/services/destination-service";

export async function generateMetadata({ params }: PageProps<"/[locale]/trip-planner">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return buildPageMetadata({
    locale,
    path: routes.tripPlanner,
    title: "Plan Your Trip",
    description: "Tell us your dates, interests and travel style, and start shaping a Mongolia journey designed around you.",
  });
}

export default async function TripPlannerPage({ params }: PageProps<"/[locale]/trip-planner">) {
  await resolveLocale(params);
  const [images, experiences, destinations] = await Promise.all([getPageImages(), getExperiences(), getDestinations()]);

  return (
    <>
      <PageHero
        eyebrow="Trip planner"
        title="Design your Mongolia"
        description="Answer a few questions about how you like to travel. It takes about two minutes."
        image={images.tripPlannerHero}
      />
      <section aria-label="Trip planner" className="py-20 sm:py-28">
        <Container width="narrow" className="max-w-4xl">
          <TripPlannerForm
            interests={experiences.map((e) => ({ value: e.slug, label: e.title }))}
            destinations={destinations.map((d) => ({ value: d.slug, label: d.name }))}
          />
        </Container>
      </section>
    </>
  );
}
