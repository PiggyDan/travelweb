import { ArrowRight } from "lucide-react";
import { LocaleLink } from "@/components/shared/locale-link";
import { Badge } from "@/components/ui/badge";
import { DEPARTURE_STATUS_LABELS } from "@/lib/labels";
import { routes } from "@/lib/routes";
import { formatDateRange, formatPrice } from "@/lib/utils";
import type { DepartureStatus, TourDate, TourType } from "@/types/tour";
import { TourSection } from "./tour-section";

const statusTone: Record<DepartureStatus, "steppe" | "copper" | "muted" | "sky"> = {
  available: "steppe",
  limited: "copper",
  full: "muted",
  "on-request": "sky",
};

interface TourDeparturesProps {
  tourSlug: string;
  tourType: TourType;
  departures: readonly TourDate[];
}

export function TourDepartures({ tourSlug, tourType, departures }: TourDeparturesProps) {
  const flexible = tourType !== "group";
  return (
    <TourSection
      id="departures"
      eyebrow={flexible ? "Suggested dates" : "Departures"}
      title={flexible ? "Travel when it suits you" : "Upcoming departures"}
    >
      {flexible && (
        <p className="mb-8 max-w-2xl text-charcoal-600">
          This is a {tourType} journey, so you choose your start date. The dates below are examples with seasonal
          pricing — ask us about any other date.
        </p>
      )}
      <ul className="divide-y divide-sand-300/70 border-y border-sand-300/70">
        {departures.map((departure) => {
          const bookable = departure.status !== "full";
          return (
            <li key={departure.id} className="grid gap-4 py-5 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-8">
              <div>
                <p className="font-display text-lg text-sky-950">
                  {formatDateRange(departure.startDate, departure.endDate)}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Badge tone={statusTone[departure.status]}>{DEPARTURE_STATUS_LABELS[departure.status]}</Badge>
                  {departure.seatsLeft !== undefined && (
                    <span className="text-xs text-charcoal-500">{departure.seatsLeft} places left</span>
                  )}
                </div>
              </div>
              <p className="text-sm text-charcoal-500">
                <span className="font-display text-xl text-sky-950">{formatPrice(departure.price)}</span> pp
              </p>
              {bookable ? (
                <LocaleLink
                  href={routes.tourInquiry(tourSlug, departure.id)}
                  className="inline-flex min-h-11 items-center gap-2 text-[0.6875rem] font-semibold tracking-[0.18em] text-sky-950 uppercase hover:text-copper-600"
                >
                  Enquire
                  <span className="sr-only"> about {formatDateRange(departure.startDate, departure.endDate)}</span>
                  <ArrowRight aria-hidden className="size-4" />
                </LocaleLink>
              ) : (
                <span className="text-xs text-charcoal-500">Waitlist on request</span>
              )}
            </li>
          );
        })}
      </ul>
    </TourSection>
  );
}
