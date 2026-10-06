import { DestinationMosaic } from "@/components/destinations/destination-mosaic";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { routes } from "@/lib/routes";
import type { DestinationSummary } from "@/types/destination";

export function DestinationsSection({ destinations }: { destinations: readonly DestinationSummary[] }) {
  return (
    <section aria-labelledby="destinations-title" className="pb-24 sm:pb-32">
      <Container>
        <div className="mb-12 flex flex-col gap-8 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="destinations-title"
            eyebrow="Destinations"
            title="Seven landscapes, one country."
            description="From the dunes of the south to the glaciers of the far west, Mongolia holds more variety than most continents. Each region has its season and its people."
          />
          <ButtonLink href={routes.destinations} variant="outline-dark" className="shrink-0 self-start lg:self-auto">
            All destinations
          </ButtonLink>
        </div>
        <DestinationMosaic destinations={destinations} />
      </Container>
    </section>
  );
}
