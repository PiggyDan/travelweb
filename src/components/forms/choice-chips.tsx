"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SelectOption } from "@/types/common";

interface ChoiceChipsProps {
  legend: string;
  name: string;
  options: readonly SelectOption[];
  /** "multiple" renders checkboxes, "single" renders radios. */
  mode: "multiple" | "single";
  value: readonly string[];
  onChange: (value: string[]) => void;
  hint?: string;
}

/**
 * Pill-style checkboxes/radios. Native inputs are kept (visually hidden) so
 * keyboard and screen-reader behaviour is the browser's own.
 */
export function ChoiceChips({ legend, name, options, mode, value, onChange, hint }: ChoiceChipsProps) {
  function toggle(option: string) {
    if (mode === "single") return onChange([option]);
    onChange(value.includes(option) ? value.filter((v) => v !== option) : [...value, option]);
  }

  return (
    <fieldset>
      <legend className="text-sm font-semibold text-sky-950">{legend}</legend>
      {hint && <p className="mt-1 text-xs text-charcoal-500">{hint}</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => {
          const checked = value.includes(option.value);
          return (
            <label
              key={option.value}
              className={cn(
                "relative inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-copper-500",
                checked
                  ? "border-sky-950 bg-sky-950 text-white dark:bg-felt-100 dark:text-sky-950"
                  : "border-sand-300 bg-white text-charcoal-700 hover:border-sky-950",
              )}
            >
              <input
                type={mode === "multiple" ? "checkbox" : "radio"}
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => toggle(option.value)}
                className="sr-only"
              />
              {checked && <Check aria-hidden className="size-3.5" />}
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
