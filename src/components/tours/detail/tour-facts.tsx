import { Activity, CalendarDays, MapPin, Tag, Users } from "lucide-react";
import { ACTIVITY_LEVEL_LABELS, TOUR_TYPE_LABELS } from "@/lib/labels";
import { formatDuration, formatPrice } from "@/lib/utils";
import type { Tour } from "@/types/tour";

/** Key facts shown in the tour hero. */
export function TourFacts({ tour }: { tour: Tour }) {
  const facts = [
    { label: "Destination", value: tour.regionLabel, Icon: MapPin },
    { label: "Duration", value: formatDuration(tour.durationDays), Icon: CalendarDays },
    { label: "From", value: `${formatPrice(tour.priceFrom)} pp`, Icon: Tag },
    { label: "Tour type", value: TOUR_TYPE_LABELS[tour.type], Icon: Users },
    { label: "Activity", value: ACTIVITY_LEVEL_LABELS[tour.activityLevel], Icon: Activity },
  ];

  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-6 border-t border-white/20 pt-8 sm:grid-cols-3 lg:grid-cols-5">
      {facts.map(({ label, value, Icon }) => (
        <div key={label}>
          <dt className="flex items-center gap-2 text-[0.6875rem] font-semibold tracking-[0.18em] text-sky-200 uppercase">
            <Icon aria-hidden className="size-3.5 text-copper-300" />
            {label}
          </dt>
          <dd className="mt-2 font-display text-lg text-white sm:text-xl">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
