import { Reveal } from "@/components/ui/reveal";
import type { DestinationSummary } from "@/types/destination";
import { DestinationCard } from "./destination-card";

/**
 * Asymmetric editorial layout for up to seven destinations:
 *
 *   ┌───────────┬───────┐
 *   │           │   2   │
 *   │     1     ├───────┤
 *   │           │   3   │
 *   ├─────┬─────┼───────┤
 *   │  4  │  5  │   6   │
 *   ├─────┴─────┴───────┤
 *   │         7         │
 *   └───────────────────┘
 */
const layout = [
  { tile: "md:col-span-2 lg:col-span-7 lg:row-span-2", sizes: "(min-width: 1024px) 58vw, 100vw", emphasis: true },
  { tile: "lg:col-span-5", sizes: "(min-width: 1024px) 42vw, (min-width: 768px) 50vw, 100vw" },
  { tile: "lg:col-span-5", sizes: "(min-width: 1024px) 42vw, (min-width: 768px) 50vw, 100vw" },
  { tile: "lg:col-span-4", sizes: "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" },
  { tile: "lg:col-span-4", sizes: "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" },
  { tile: "md:col-span-2 lg:col-span-4", sizes: "(min-width: 1024px) 33vw, 100vw" },
  { tile: "md:col-span-2 lg:col-span-12 lg:min-h-[28rem]", sizes: "100vw", emphasis: true },
] as const;

export function DestinationMosaic({
  destinations,
  headingLevel = "h3",
}: {
  destinations: readonly DestinationSummary[];
  headingLevel?: "h2" | "h3";
}) {
  return (
    <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-12 lg:auto-rows-[minmax(22rem,auto)] lg:gap-5">
      {destinations.map((destination, index) => {
        const slot = layout[index % layout.length];
        return (
          <Reveal as="li" key={destination.id} delay={(index % 3) * 0.08} className={`flex ${slot.tile}`}>
            <DestinationCard
              destination={destination}
              sizes={slot.sizes}
              emphasis={"emphasis" in slot && slot.emphasis}
              headingLevel={headingLevel}
              className="w-full"
            />
          </Reveal>
        );
      })}
    </ul>
  );
}
