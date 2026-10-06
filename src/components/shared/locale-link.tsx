"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import type { ComponentProps } from "react";
import { DEFAULT_LOCALE, isEnabledLocale, localizePath } from "@/lib/i18n";
import type { Locale } from "@/types/common";

export function useLocale(): Locale {
  const params = useParams<{ locale?: string }>();
  const value = params?.locale;
  return value && isEnabledLocale(value) ? value : DEFAULT_LOCALE;
}

type LocaleLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  /** Unlocalized path such as "/tours" — the active locale is prefixed. */
  href: string;
};

/**
 * Drop-in replacement for `next/link` that prefixes the active locale.
 * Lets Server Components render internal links without threading `locale`
 * through every prop.
 */
export function LocaleLink({ href, ...props }: LocaleLinkProps) {
  const locale = useLocale();
  return <Link href={localizePath(locale, href)} {...props} />;
}
