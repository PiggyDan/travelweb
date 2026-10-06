import type { DestinationSummary } from "@/types/destination";

/** Slow-moving ribbon of region names between the hero and the intro. */
export function DestinationMarquee({ destinations }: { destinations: readonly DestinationSummary[] }) {
  return (
    <div className="overflow-hidden border-b border-white/10 bg-sky-950 py-7">
      <div className="flex w-max animate-marquee gap-16 hover:[animation-play-state:paused] motion-reduce:animate-none">
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center gap-16">
            {destinations.map((destination) => (
              <li key={destination.slug} className="flex items-center gap-16">
                <span className="font-display text-3xl font-light whitespace-nowrap text-sand-100 italic">
                  {destination.name}
                </span>
                <span aria-hidden className="font-display text-2xl text-copper-300">
                  ·
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
