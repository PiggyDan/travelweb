import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { LocaleLink } from "@/components/shared/locale-link";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { DestinationSummary } from "@/types/destination";

interface DestinationCardProps {
  destination: DestinationSummary;
  /** Responsive `sizes` hint for the image. */
  sizes: string;
  className?: string;
  /** Larger type for hero-sized tiles. */
  emphasis?: boolean;
  headingLevel?: "h2" | "h3";
}

/**
 * Full-bleed image tile with text over a gradient. The whole tile is
 * clickable via a stretched link, while the heading stays the link text.
 */
export function DestinationCard({
  destination,
  sizes,
  className,
  emphasis = false,
  headingLevel: Heading = "h3",
}: DestinationCardProps) {
  return (
    <article
      className={cn(
        "group relative isolate flex min-h-[26rem] flex-col justify-end overflow-hidden rounded-[1.75rem] bg-sky-900 text-white",
        className,
      )}
    >
      <Image
        src={destination.image.src}
        alt={destination.image.alt}
        fill
        sizes={sizes}
        className="-z-20 object-cover transition-transform duration-[1.4s] ease-[var(--ease-soft)] motion-safe:group-hover:scale-105"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-t from-sky-950/90 via-sky-950/25 to-transparent" />

      <div className="p-6 sm:p-8">
        <p className="eyebrow text-copper-300">{destination.region}</p>
        <Heading
          className={cn(
            "mt-3 font-display font-light tracking-tight",
            emphasis ? "text-4xl sm:text-5xl" : "text-3xl sm:text-[2.125rem]",
          )}
        >
          <LocaleLink
            href={routes.destination(destination.slug)}
            className="after:absolute after:inset-0 after:rounded-[1.75rem] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-[-4px] focus-visible:after:outline-copper-300"
          >
            {destination.name}
          </LocaleLink>
        </Heading>
        <p className={cn("mt-3 max-w-md text-sm leading-relaxed text-sky-50/90", emphasis && "sm:text-base")}>
          {destination.summary}
        </p>
        <span
          aria-hidden
          className="mt-6 inline-flex items-center gap-2 text-[0.6875rem] font-semibold tracking-[0.2em] uppercase"
        >
          Explore
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </article>
  );
}
