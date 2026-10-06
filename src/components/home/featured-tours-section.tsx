import { TourGrid } from "@/components/tours/tour-grid";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { routes } from "@/lib/routes";
import type { TourSummary } from "@/types/tour";

export function FeaturedToursSection({ tours }: { tours: readonly TourSummary[] }) {
  return (
    <section aria-labelledby="tours-title" className="bg-sand-50 py-24 sm:py-32">
      <Container>
        <div className="mb-12 flex flex-col gap-8 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="tours-title"
            eyebrow="Featured journeys"
            title={
              <>
                Itineraries with <span className="italic">room to breathe.</span>
              </>
            }
            description="Small-group departures, private journeys and custom starting points — each one paced for the land, not the schedule."
          />
          <ButtonLink href={routes.tours} variant="outline-dark" className="shrink-0 self-start lg:self-auto">
            View all tours
          </ButtonLink>
        </div>
        <TourGrid tours={tours} />
      </Container>
    </section>
  );
}
