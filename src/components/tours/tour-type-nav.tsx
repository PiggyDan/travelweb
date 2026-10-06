import { LocaleLink } from "@/components/shared/locale-link";
import { TOUR_TYPE_LABELS } from "@/lib/labels";
import { routes } from "@/lib/routes";
import { serializeTourFilters } from "@/lib/tour-filters";
import { cn } from "@/lib/utils";
import type { TourFilters, TourType } from "@/types/tour";

const TYPES: (TourType | undefined)[] = [undefined, "private", "group", "custom"];

/** All / Private / Group / Custom tabs. Preserves the other active filters. */
export function TourTypeNav({ filters }: { filters: TourFilters }) {
  return (
    <nav aria-label="Tour types" className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
      <ul className="flex min-w-max gap-2 border-b border-sand-300">
        {TYPES.map((type) => {
          const active = filters.type === type;
          const query = serializeTourFilters({ ...filters, type });
          return (
            <li key={type ?? "all"}>
              <LocaleLink
                href={query ? `${routes.tours}?${query}` : routes.tours}
                scroll={false}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative inline-flex min-h-12 items-center px-4 text-sm font-semibold tracking-wide transition-colors",
                  active ? "text-sky-950" : "text-charcoal-500 hover:text-sky-950",
                  "after:absolute after:inset-x-4 after:-bottom-px after:h-0.5 after:bg-copper-500 after:transition-transform",
                  active ? "after:scale-x-100" : "after:scale-x-0",
                )}
              >
                {type ? TOUR_TYPE_LABELS[type] : "All journeys"}
              </LocaleLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
