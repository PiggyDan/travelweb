import { Check, Minus } from "lucide-react";
import { TourSection } from "./tour-section";

export function TourInclusions({ included, excluded }: { included: readonly string[]; excluded: readonly string[] }) {
  return (
    <TourSection id="inclusions" eyebrow="The details" title="What's included">
      <div className="grid gap-10 sm:grid-cols-2">
        <div>
          <h3 className="font-display text-xl text-sky-950">Included</h3>
          <ul className="mt-5 space-y-3">
            {included.map((item) => (
              <li key={item} className="flex gap-3 text-charcoal-700">
                <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-steppe-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-display text-xl text-sky-950">Not included</h3>
          <ul className="mt-5 space-y-3">
            {excluded.map((item) => (
              <li key={item} className="flex gap-3 text-charcoal-600">
                <Minus aria-hidden className="mt-0.5 size-4 shrink-0 text-charcoal-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </TourSection>
  );
}
