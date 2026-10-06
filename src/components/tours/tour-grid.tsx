import { Reveal } from "@/components/ui/reveal";
import type { TourSummary } from "@/types/tour";
import { TourCard } from "./tour-card";

export function TourGrid({
  tours,
  headingLevel = "h3",
}: {
  tours: readonly TourSummary[];
  headingLevel?: "h2" | "h3";
}) {
  return (
    <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 xl:gap-8">
      {tours.map((tour, index) => (
        <Reveal as="li" key={tour.id} delay={(index % 3) * 0.08}>
          <TourCard tour={tour} headingLevel={headingLevel} />
        </Reveal>
      ))}
    </ul>
  );
}
