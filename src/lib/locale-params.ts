import { notFound } from "next/navigation";
import type { Locale } from "@/types/common";
import { ENABLED_LOCALES, isEnabledLocale } from "./i18n";

/** Validate the `[locale]` route param, 404-ing on anything not enabled. */
export async function resolveLocale(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;
  if (!isEnabledLocale(locale)) notFound();
  return locale;
}

/** `generateStaticParams` helper for the `[locale]` segment. */
export function localeStaticParams(): { locale: Locale }[] {
  return ENABLED_LOCALES.map((locale) => ({ locale }));
}
