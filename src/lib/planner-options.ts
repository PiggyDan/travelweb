import type { SelectOption } from "@/types/common";
import type { AccommodationStyle, ActivityPreference, BudgetRange } from "@/types/inquiry";

/** Trip planner choices, shared by the planner form and the admin trip view. */

export const ACTIVITY_OPTIONS: SelectOption<ActivityPreference>[] = [
  { value: "relaxed", label: "Relaxed" },
  { value: "balanced", label: "Balanced" },
  { value: "active", label: "Active" },
  { value: "expedition", label: "Expedition" },
];

export const ACCOMMODATION_OPTIONS: SelectOption<AccommodationStyle>[] = [
  { value: "comfort", label: "Comfortable ger camps & hotels" },
  { value: "authentic", label: "Nomad family stays" },
  { value: "mixed", label: "A mix of both" },
  { value: "camping", label: "Wild camping" },
];

export const BUDGET_OPTIONS: SelectOption<BudgetRange>[] = [
  { value: "under-2000", label: "Under $2,000 per person" },
  { value: "2000-3500", label: "$2,000 – $3,500 per person" },
  { value: "3500-5000", label: "$3,500 – $5,000 per person" },
  { value: "5000-plus", label: "$5,000+ per person" },
];

/** Label for a stored value, falling back to the raw value if it is unknown. */
export function optionLabel(options: readonly SelectOption[], value: string): string {
  return options.find((option) => option.value === value)?.label ?? value;
}
