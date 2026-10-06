import { Sparkle } from "lucide-react";
import type { Tour } from "@/types/tour";
import { TourSection } from "./tour-section";

export function TourOverview({ tour }: { tour: Tour }) {
  return (
    <TourSection id="overview" eyebrow="Overview" title={tour.tagline}>
      <div className="prose-editorial text-lg leading-relaxed text-charcoal-700">
        {tour.overview.map((paragraph) => (
          <p key={paragraph.slice(0, 32)}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-12 rounded-[1.5rem] bg-sand-100 p-6 sm:p-8">
        <h3 className="eyebrow text-copper-600">Highlights</h3>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {tour.highlights.map((highlight) => (
            <li key={highlight} className="flex gap-3 text-charcoal-800">
              <Sparkle aria-hidden className="mt-1 size-4 shrink-0 text-copper-500" strokeWidth={1.5} />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      </div>
    </TourSection>
  );
}
