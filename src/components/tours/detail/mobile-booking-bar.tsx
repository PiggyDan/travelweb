import { ButtonLink } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import { formatPrice } from "@/lib/utils";
import type { Tour } from "@/types/tour";

/**
 * Bottom CTA for small screens. It is `sticky` (not `fixed`) inside the tour
 * content wrapper, so it follows the reader through the itinerary but stops
 * before related tours and the footer instead of covering them.
 */
export function MobileBookingBar({ tour }: { tour: Tour }) {
  return (
    <div className="sticky bottom-0 z-30 -mx-5 mt-10 border-t border-sand-300 bg-felt-50/95 px-5 py-3 backdrop-blur-md sm:-mx-8 sm:px-8 lg:hidden">
      {/* Right padding keeps the button clear of the floating chat bubble. */}
      <div className="flex items-center justify-between gap-4 pr-16">
        <p className="text-xs text-charcoal-500">
          From
          <span className="block font-display text-xl leading-tight text-sky-950">{formatPrice(tour.priceFrom)}</span>
        </p>
        <ButtonLink href={routes.tourInquiry(tour.slug)} variant="dark" size="md">
          Enquire now
        </ButtonLink>
      </div>
    </div>
  );
}
