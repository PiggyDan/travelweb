import { ACCOMMODATION_LABELS } from "@/lib/labels";
import type { Accommodation } from "@/types/tour";
import { TourSection } from "./tour-section";

export function TourAccommodation({ accommodations }: { accommodations: readonly Accommodation[] }) {
  return (
    <TourSection id="accommodation" eyebrow="Where you'll stay" title="Accommodation">
      <ul className="grid gap-4 sm:grid-cols-2">
        {accommodations.map((stay) => (
          <li key={`${stay.kind}-${stay.name}`} className="rounded-[1.25rem] border border-sand-300/80 bg-felt-50 p-6">
            <div className="flex items-center justify-between gap-4">
              <span className="eyebrow text-steppe-600">{ACCOMMODATION_LABELS[stay.kind]}</span>
              <span className="text-xs font-semibold text-charcoal-500">
                {stay.nights} {stay.nights === 1 ? "night" : "nights"}
              </span>
            </div>
            <h3 className="mt-3 font-display text-xl text-sky-950">{stay.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-charcoal-600">{stay.description}</p>
          </li>
        ))}
      </ul>
    </TourSection>
  );
}
