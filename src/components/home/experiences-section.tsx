import { ExperienceTile } from "@/components/shared/experience-tile";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { routes } from "@/lib/routes";
import type { Experience } from "@/types/content";

/**
 * Horizontal snap-scroller on mobile (contained, so the page itself never
 * scrolls sideways); an offset two-row grid on desktop.
 */
export function ExperiencesSection({ experiences }: { experiences: readonly Experience[] }) {
  return (
    <section aria-labelledby="experiences-title" className="overflow-hidden bg-felt-200 py-24 sm:py-32">
      <Container>
        <div className="mb-12 flex flex-col gap-8 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="experiences-title"
            eyebrow="Experiences"
            title="Ways to feel the land."
            description="Ride, walk, sleep in felt, sit with eagle hunters. Mix experiences into any journey."
          />
          <ButtonLink href={routes.experiences} variant="outline-dark" className="shrink-0 self-start lg:self-auto">
            All experiences
          </ButtonLink>
        </div>
      </Container>

      <div className="mx-auto max-w-[90rem] lg:px-12">
        <ul
          aria-label="Experiences"
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-4 sm:scroll-px-8 sm:px-8 lg:grid lg:grid-cols-4 lg:gap-5 lg:overflow-visible lg:px-0 lg:pb-0"
        >
          {experiences.map((experience, index) => (
            <Reveal
              as="li"
              key={experience.id}
              delay={(index % 4) * 0.06}
              className={`w-[78%] shrink-0 snap-start sm:w-[44%] lg:w-auto ${index % 2 === 1 ? "lg:translate-y-12" : ""}`}
            >
              <ExperienceTile experience={experience} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
