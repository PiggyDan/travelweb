import { CalendarDays, Check, Users } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import { formatDateRange, formatPrice } from "@/lib/utils";
import type { Tour } from "@/types/tour";

const reassurances = ["No payment needed to enquire", "Speak with a Mongolia-based planner", "Every itinerary can be adjusted"];

/** Desktop sticky inquiry panel. */
export function BookingPanel({ tour }: { tour: Tour }) {
  const upcoming = tour.departures.filter((d) => d.status !== "full").slice(0, 3);

  return (
    <aside aria-label="Enquire about this journey" className="rounded-[1.75rem] bg-sky-950 p-8 text-felt-50 shadow-2xl shadow-sky-950/20">
      <p className="eyebrow text-copper-300">From</p>
      <p className="mt-2 font-display text-5xl font-light">
        {formatPrice(tour.priceFrom)}
        <span className="ml-2 font-sans text-sm font-normal text-sky-200">per person</span>
      </p>

      <dl className="mt-8 space-y-4 border-t border-white/15 pt-6 text-sm">
        <div className="flex items-center justify-between gap-4">
          <dt className="flex items-center gap-2 text-sky-200">
            <CalendarDays aria-hidden className="size-4 text-copper-300" />
            Duration
          </dt>
          <dd>{tour.durationDays} days</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="flex items-center gap-2 text-sky-200">
            <Users aria-hidden className="size-4 text-copper-300" />
            Group size
          </dt>
          <dd>
            {tour.groupSize.min} – {tour.groupSize.max} travellers
          </dd>
        </div>
      </dl>

      {upcoming.length > 0 && (
        <div className="mt-6 border-t border-white/15 pt-6">
          <p className="text-xs font-semibold tracking-[0.18em] text-sky-200 uppercase">
            {tour.type === "group" ? "Next departures" : "Example dates"}
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {upcoming.map((departure) => (
              <li key={departure.id} className="flex justify-between gap-4">
                <span>{formatDateRange(departure.startDate, departure.endDate)}</span>
                <span className="text-sky-200">{formatPrice(departure.price)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 space-y-3">
        <ButtonLink href={routes.tourInquiry(tour.slug)} variant="light" className="w-full">
          Request this journey
        </ButtonLink>
        <ButtonLink href={routes.tripPlanner} variant="outline-light" className="w-full">
          Make it my own
        </ButtonLink>
      </div>

      <ul className="mt-8 space-y-2 text-xs text-sky-200">
        {reassurances.map((item) => (
          <li key={item} className="flex items-center gap-2">
            <Check aria-hidden className="size-3.5 text-copper-300" />
            {item}
          </li>
        ))}
      </ul>
    </aside>
  );
}
