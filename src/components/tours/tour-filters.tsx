"use client";

import { ChevronDown, RotateCcw, SlidersHorizontal } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useTransition, type ChangeEvent } from "react";
import { hasActiveFilters, serializeTourFilters } from "@/lib/tour-filters";
import { cn } from "@/lib/utils";
import type { SelectOption } from "@/types/common";
import type { TourFilters as Filters } from "@/types/tour";

interface FilterOptions {
  destinations: SelectOption[];
  durations: SelectOption[];
  types: SelectOption[];
  seasons: SelectOption[];
}

interface TourFiltersProps {
  filters: Filters;
  options: FilterOptions;
}

const FIELDS = [
  { key: "destination", label: "Destination", optionsKey: "destinations", any: "Anywhere" },
  { key: "duration", label: "Duration", optionsKey: "durations", any: "Any length" },
  { key: "type", label: "Tour type", optionsKey: "types", any: "Any type" },
  { key: "season", label: "Season", optionsKey: "seasons", any: "Any season" },
] as const;

/**
 * Filter bar. State lives in the URL (?destination=…&season=…), so results
 * are server-rendered, shareable and work with the back button. It is a
 * plain GET form, so it also works before JavaScript loads.
 */
export function TourFilters({ filters, options }: TourFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  function update(next: Filters) {
    const query = serializeTourFilters(next);
    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    });
  }

  function handleChange(key: (typeof FIELDS)[number]["key"]) {
    return (event: ChangeEvent<HTMLSelectElement>) => {
      update({ ...filters, [key]: event.target.value || undefined });
    };
  }

  return (
    <form
      method="get"
      action={pathname}
      aria-label="Filter tours"
      aria-busy={pending}
      className={cn("rounded-[1.5rem] bg-felt-50 p-4 ring-1 ring-sand-200 transition-opacity sm:p-5", pending && "opacity-70")}
    >
      {filters.query && <input type="hidden" name="q" value={filters.query} />}
      <div className="flex items-center gap-2 px-1 pb-4 text-sm font-semibold text-sky-950 lg:hidden">
        <SlidersHorizontal aria-hidden className="size-4 text-copper-600" />
        Refine journeys
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto] lg:items-end">
        {FIELDS.map((field) => (
          <div key={field.key}>
            <label htmlFor={`filter-${field.key}`} className="eyebrow mb-2 block px-1 text-charcoal-500">
              {field.label}
            </label>
            <div className="relative">
              <select
                id={`filter-${field.key}`}
                name={field.key}
                value={filters[field.key] ?? ""}
                onChange={handleChange(field.key)}
                className="min-h-12 w-full cursor-pointer appearance-none rounded-xl border border-sand-300 bg-white px-4 pr-10 text-sm text-charcoal-900 hover:border-sand-500"
              >
                <option value="">{field.any}</option>
                {options[field.optionsKey].map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden
                className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-sky-950"
              />
            </div>
          </div>
        ))}
        <div className="flex gap-2 sm:col-span-2 lg:col-span-1">
          <noscript>
            <button type="submit" className="min-h-12 rounded-xl bg-sky-950 px-5 text-sm font-semibold text-white dark:bg-felt-100 dark:text-sky-950">
              Apply
            </button>
          </noscript>
          <button
            type="button"
            onClick={() => update({})}
            disabled={!hasActiveFilters(filters)}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-sky-950 transition-colors hover:bg-sand-100 disabled:cursor-not-allowed disabled:text-charcoal-400 disabled:hover:bg-transparent lg:w-auto"
          >
            <RotateCcw aria-hidden className="size-4" />
            Reset
          </button>
        </div>
      </div>
    </form>
  );
}
