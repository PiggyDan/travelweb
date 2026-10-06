import type { Money } from "@/types/common";

type ClassValue = string | false | null | undefined;

/** Join class names, skipping falsy values. */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(money: Money): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: money.currency,
    maximumFractionDigits: 0,
  }).format(money.amount);
}

export function formatDuration(days: number): string {
  return `${days} ${days === 1 ? "day" : "days"}`;
}

/** Format an ISO date (YYYY-MM-DD) without timezone drift. */
export function formatDate(
  isoDate: string,
  options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" },
): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", { ...options, timeZone: "UTC" }).format(
    new Date(Date.UTC(year, (month ?? 1) - 1, day ?? 1)),
  );
}

export function formatDateRange(start: string, end: string): string {
  const sameYear = start.slice(0, 4) === end.slice(0, 4);
  const startLabel = formatDate(
    start,
    sameYear ? { day: "numeric", month: "short" } : { day: "numeric", month: "short", year: "numeric" },
  );
  return `${startLabel} – ${formatDate(end)}`;
}

export function formatMonth(yearMonth: string): string {
  return formatDate(`${yearMonth}-01`, { month: "long", year: "numeric" });
}

/** Read a single string value from Next.js search params. */
export function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
