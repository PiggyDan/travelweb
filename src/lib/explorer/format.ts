import type { Locale } from "@/types/common";
import type { ExplorerMessages } from "./messages";

export function formatDistance(meters: number, locale: Locale): string {
  const km = meters / 1000;
  return new Intl.NumberFormat(locale, {
    style: "unit",
    unit: "kilometer",
    maximumFractionDigits: km < 10 ? 1 : 0,
  }).format(km);
}

export function formatDuration(seconds: number, messages: ExplorerMessages): string {
  const totalMinutes = Math.max(1, Math.round(seconds / 60));
  return messages.summary.duration(Math.floor(totalMinutes / 60), totalMinutes % 60);
}

export function formatArea(km2: number, locale: Locale): string {
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(km2)} km²`;
}

/** Country name in the UI language, falling back to the dataset's English name. */
export function countryName(iso2: string, fallback: string, locale: Locale): string {
  if (locale === "en") return fallback;
  try {
    return new Intl.DisplayNames([locale], { type: "region" }).of(iso2) ?? fallback;
  } catch {
    return fallback;
  }
}
