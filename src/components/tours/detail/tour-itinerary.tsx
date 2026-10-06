import { BedDouble, Route, Utensils } from "lucide-react";
import { MEAL_LABELS } from "@/lib/labels";
import type { ItineraryDay } from "@/types/tour";
import { TourSection } from "./tour-section";

export function TourItinerary({ days }: { days: readonly ItineraryDay[] }) {
  return (
    <TourSection id="itinerary" eyebrow="Day by day" title="The journey">
      <ol className="relative">
        {days.map((day, index) => {
          const isLast = index === days.length - 1;
          return (
            <li key={day.day} className="relative grid grid-cols-[3.25rem_1fr] gap-x-5 pb-10 last:pb-0 sm:grid-cols-[4rem_1fr] sm:gap-x-8">
              {!isLast && (
                <span aria-hidden className="absolute top-14 bottom-2 left-[1.625rem] w-px bg-sand-300 sm:left-8" />
              )}
              <div className="flex size-13 flex-col items-center justify-center rounded-full border border-sand-300 bg-felt-50 sm:size-16">
                <span className="text-[0.5625rem] font-semibold tracking-[0.18em] text-charcoal-500 uppercase">Day</span>
                <span className="font-display text-lg leading-none text-sky-950 sm:text-xl">{day.day}</span>
              </div>
              <div className="pt-2">
                <h3 className="font-display text-xl text-sky-950 sm:text-2xl">{day.title}</h3>
                <p className="mt-3 leading-relaxed text-charcoal-600">{day.description}</p>
                <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-charcoal-500">
                  {day.overnight !== "—" && (
                    <li className="inline-flex items-center gap-1.5">
                      <BedDouble aria-hidden className="size-3.5 text-copper-600" />
                      <span className="sr-only">Overnight: </span>
                      {day.overnight}
                    </li>
                  )}
                  {day.meals.length > 0 && (
                    <li className="inline-flex items-center gap-1.5">
                      <Utensils aria-hidden className="size-3.5 text-copper-600" />
                      <span className="sr-only">Meals: </span>
                      {day.meals.map((meal) => MEAL_LABELS[meal]).join(", ")}
                    </li>
                  )}
                  {day.distanceKm && (
                    <li className="inline-flex items-center gap-1.5">
                      <Route aria-hidden className="size-3.5 text-copper-600" />
                      <span className="sr-only">Distance: </span>~{day.distanceKm} km
                    </li>
                  )}
                </ul>
              </div>
            </li>
          );
        })}
      </ol>
    </TourSection>
  );
}
