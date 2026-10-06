import { ArrowRight, Clock, MapPin } from "lucide-react";
import Image from "next/image";
import { LocaleLink } from "@/components/shared/locale-link";
import { Badge } from "@/components/ui/badge";
import { TOUR_TYPE_LABELS } from "@/lib/labels";
import { routes } from "@/lib/routes";
import { formatDuration, formatPrice } from "@/lib/utils";
import type { TourSummary } from "@/types/tour";

interface TourCardProps {
  tour: TourSummary;
  headingLevel?: "h2" | "h3";
  sizes?: string;
}

export function TourCard({
  tour,
  headingLevel: Heading = "h3",
  sizes = "(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw",
}: TourCardProps) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-felt-50 ring-1 ring-sand-200 transition-shadow duration-500 hover:shadow-2xl hover:shadow-sky-950/10">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={tour.heroImage.src}
          alt={tour.heroImage.alt}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-soft)] motion-safe:group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge tone="glass">{TOUR_TYPE_LABELS[tour.type]}</Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-charcoal-500">
          <span className="inline-flex items-center gap-1.5">
            <MapPin aria-hidden className="size-3.5 text-copper-600" />
            {tour.regionLabel}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock aria-hidden className="size-3.5 text-copper-600" />
            {formatDuration(tour.durationDays)}
          </span>
        </div>
        <Heading className="mt-4 font-display text-2xl leading-tight font-normal text-sky-950 sm:text-[1.75rem]">
          <LocaleLink
            href={routes.tour(tour.slug)}
            className="after:absolute after:inset-0 after:rounded-[1.75rem] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-copper-500"
          >
            {tour.title}
          </LocaleLink>
        </Heading>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-charcoal-600">{tour.summary}</p>

        <div className="mt-auto flex items-end justify-between gap-4 border-t border-sand-200 pt-5">
          <p className="text-xs text-charcoal-500">
            From
            <span className="block font-display text-2xl text-sky-950">{formatPrice(tour.priceFrom)}</span>
            per person
          </p>
          <span
            aria-hidden
            className="inline-flex items-center gap-2 text-[0.6875rem] font-semibold tracking-[0.18em] text-sky-950 uppercase"
          >
            View journey
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </article>
  );
}
